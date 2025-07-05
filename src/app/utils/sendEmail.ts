import nodemailer from "nodemailer";
import config from "../config";

const sendEmail = async (to: string, html: string, subject: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.EMAIL_USER,
      pass: config.SM_PASS,
    },
  });

  await transporter.sendMail({
    // add there only website name
    from: `"Goup-Shup Team" <${config.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
