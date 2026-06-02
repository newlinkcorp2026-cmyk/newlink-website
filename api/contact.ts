import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    const { name, phone, email, company, message } = req.body;

    await resend.emails.send({
      from: "NEWLINK <onboarding@resend.dev>",
      to: ["contact@newlinkcorp.kr"],
      subject: `[NEWLINK 문의] ${name}`,
      html: `
        <h2>신규 문의 접수</h2>

        <p><b>이름</b><br/>${name}</p>
        <p><b>연락처</b><br/>${phone}</p>
        <p><b>이메일</b><br/>${email}</p>
        <p><b>회사명</b><br/>${company}</p>
        <p><b>문의내용</b><br/>${message}</p>
      `,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
    });
  }
}