import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    const { name, phone, email, company, message } = req.body;

    const result = await resend.emails.send({
      from: "NEWLINK <onboarding@resend.dev>",
      to: ["contact@newlinkcorp.kr"],
      subject: `[NEWLINK 문의] ${name}`,
      html: `
        <h2>신규 문의 접수</h2>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("RESEND ERROR:", error);

    return res.status(500).json({
      success: false,
      error: String(error),
    });
  }
}