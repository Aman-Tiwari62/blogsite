import nodemailer from "nodemailer";

export async function sendEmail(to, subject, text) {
    console.log("inside transporter");
    console.log("EMAIL:", process.env.EMAIL);
    console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use your SMTP
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text
  });
}
