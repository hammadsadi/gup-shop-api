export const getOtpEmailTemplate = ({
  userName,
  otpCode,
  context = "Registration",
  appName = "Gup-Shup",
}: {
  userName: string;
  otpCode: string;
  context?: "Registration" | "Resend";
  appName?: string;
}) => {
  const year = new Date().getFullYear();
  const title =
    context === "Registration" ? "Verify Your Account" : "Your New OTP Code";
  const message =
    context === "Registration"
      ? "Thanks for signing up! Please verify your account."
      : "You requested a new OTP. Please use the code below to continue.";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f3f4f6;
            color: #1f2937;
            padding: 20px;
          }
          .container {
            max-width: 500px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
            text-align: center;
          }
          .brand {
            font-size: 24px;
            font-weight: 700;
            color: #4f46e5;
            margin-bottom: 12px;
          }
          .title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #111827;
          }
          .message {
            font-size: 16px;
            margin-bottom: 24px;
            color: #374151;
          }
          .otp {
            font-size: 32px;
            font-weight: bold;
            color: #4f46e5;
            letter-spacing: 8px;
            margin: 20px 0;
          }
          .footer {
            font-size: 13px;
            color: #6b7280;
            margin-top: 32px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">${appName}</div>
          <div class="title">${title}</div>
          <div class="message">
            Hello <strong>${userName}</strong>,<br /><br />
            ${message}<br />
            This OTP is valid for <strong>5 minutes</strong>.
          </div>
          <div class="otp">${otpCode}</div>
          <div class="message">
            If you didn’t request this, you can safely ignore this email.
          </div>
          <div class="footer">
            &copy; ${year} ${appName}. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  return html;
};
