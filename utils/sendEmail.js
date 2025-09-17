import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, otp) => {
  try {
    const msg = {
      to,
      from: { email: process.env.EMAIL, name: "Blogsite Support" },
      subject: "Verify your email for MyApp",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;">
          <h2>Welcome to Blogsite 👋</h2>
          <p>Your OTP code is:</p>
          <h1 style="color:#2e6c80;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p>Thanks,<br/>The Blogsite Team</p>
        </div>
      `,
    };
    

    await sgMail.send(msg);
    console.log("Email sent via SendGrid");
  } catch (error) {
    console.error("Error sending email:", error.response?.body || error.message);
    throw error;
  }
};

