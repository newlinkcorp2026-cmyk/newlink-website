import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { name, phone, email, company, message } = req.body;

    const result = await resend.emails.send({
      from: "NEWLINK <contact@newlinkcorp.kr>",
      to: ["contact@newlinkcorp.kr"],
      subject: `[NEWLINK 문의] ${name}`,
      html: `
        <h2>신규 문의 접수</h2>

        <p><strong>이름</strong><br>${name}</p>
        <p><strong>연락처</strong><br>${phone}</p>
        <p><strong>이메일</strong><br>${email}</p>
        <p><strong>회사명</strong><br>${company}</p>
        <p><strong>문의내용</strong><br>${message}</p>
      `,
    });

    // Resend 에러 체크
    if (result.error) {
      console.error("RESEND ERROR:", result.error);

      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }

    console.log("RESEND SUCCESS:", result);

    return res.status(200).json({
      success: true,
      id: result.data?.id,
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: String(error),
    });
  }
}