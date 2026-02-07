const nodemailer = require("nodemailer");

// Create transporter
const createTransporter = () => {
  // For development, you can use mailtrap, ethereal, or Gmail
  // For production, use a service like SendGrid, AWS SES, etc.

  if (process.env.NODE_ENV === "production") {
    // Production email service (configure with your actual email service)
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Development - Log to console instead of sending actual emails
    return {
      sendMail: async (mailOptions) => {
        console.log("\n=== Email Debug ===");
        console.log("To:", mailOptions.to);
        console.log("Subject:", mailOptions.subject);
        console.log("Content:", mailOptions.html || mailOptions.text);
        console.log("==================\n");
        return { messageId: "dev-" + Date.now() };
      },
    };
  }
};

/**
 * Send OTP email for password reset
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @param {string} name - User name
 */
const sendPasswordResetOTP = async (email, otp, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${process.env.APP_NAME || "FreshMart"}" <${process.env.EMAIL_FROM || "noreply@freshmart.com"}>`,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            border: 1px solid #ddd;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #22c55e;
          }
          .otp-box {
            background: white;
            border: 2px dashed #22c55e;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #22c55e;
            letter-spacing: 8px;
            margin: 10px 0;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🥬 FreshMart</div>
            <h2>Password Reset Request</h2>
          </div>
          
          <p>Hi ${name},</p>
          
          <p>We received a request to reset your password. Use the OTP code below to proceed with resetting your password:</p>
          
          <div class="otp-box">
            <div>Your OTP Code</div>
            <div class="otp-code">${otp}</div>
            <div style="color: #666; font-size: 14px; margin-top: 10px;">
              Valid for 10 minutes
            </div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong><br>
            • Never share this OTP with anyone<br>
            • FreshMart will never ask for your OTP<br>
            • If you didn't request this, please ignore this email
          </div>
          
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          
          <div class="footer">
            <p>This is an automated email, please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} FreshMart. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = {
  sendPasswordResetOTP,
};
