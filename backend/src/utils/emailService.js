const nodemailer = require("nodemailer");

// Create transporter
const createTransporter = () => {
  // Check if email credentials are provided in env
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Development fallback - Log to console
  return {
    sendMail: async (mailOptions) => {
      console.log("\n=== Email Debug (No Credentials Found) ===");
      console.log("To:", mailOptions.to);
      console.log("Subject:", mailOptions.subject);
      console.log("Content:", mailOptions.html || mailOptions.text);
      console.log("==================\n");
      return { messageId: "dev-" + Date.now() };
    },
  };
};

/**
 * Send Password Reset Email
 * @param {string} email - Recipient email
 * @param {string} resetUrl - Reset link
 * @param {string} name - User name
 */
const sendPasswordResetEmail = async (email, resetUrl, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${process.env.APP_NAME || "THETAHLIADDA MART"}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: #f0f5f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }

    .wrapper {
      max-width: 560px;
      width: 100%;
    }

    .container {
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 40px rgba(34, 90, 34, 0.12);
    }

    /* Header band */
    .header {
      background: linear-gradient(135deg, #1a4d2e 0%, #2d7a4f 60%, #3fa96a 100%);
      padding: 44px 40px 36px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 180px; height: 180px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
    }

    .header::after {
      content: '';
      position: absolute;
      bottom: -40px; left: -40px;
      width: 120px; height: 120px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }

    /* SVG Leaf Logo */
    .logo-wrap {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 18px;
    }

    .leaf-icon {
      width: 48px;
      height: 48px;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.25));
    }

    .brand-name {
      font-family: 'DM Serif Display', serif;
      font-size: 22px;
      color: #ffffff;
      letter-spacing: 0.04em;
      line-height: 1.2;
    }

    .brand-name span {
      display: block;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.18em;
      color: rgba(255,255,255,0.65);
      text-transform: uppercase;
    }

    .header h2 {
      font-family: 'DM Serif Display', serif;
      font-size: 26px;
      font-weight: 400;
      color: #fff;
      opacity: 0.95;
    }

    /* Body */
    .body {
      padding: 44px 40px;
    }

    .body p {
      color: #3d4d3d;
      font-size: 15px;
      line-height: 1.75;
      margin-bottom: 16px;
      font-weight: 300;
    }

    .body p strong {
      font-weight: 600;
      color: #1a4d2e;
    }

    /* CTA Button */
    .btn-wrap {
      text-align: center;
      margin: 32px 0;
    }

    .btn {
      display: inline-block;
      padding: 15px 40px;
      background: linear-gradient(135deg, #1a4d2e, #2d7a4f);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 50px;
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.04em;
      box-shadow: 0 6px 24px rgba(26, 77, 46, 0.35);
      transition: all 0.2s;
    }

    .link-fallback {
      background: #f4faf4;
      border: 1px solid #c8e6c9;
      border-radius: 10px;
      padding: 14px 18px;
      margin: 8px 0 20px;
    }

    .link-fallback a {
      font-size: 12px;
      color: #2d7a4f;
      word-break: break-all;
      font-weight: 500;
    }

    .validity-note {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fffbe6;
      border-left: 3px solid #f59e0b;
      border-radius: 0 8px 8px 0;
      padding: 12px 16px;
      margin: 20px 0;
      font-size: 13px !important;
      color: #78530a !important;
      font-weight: 500 !important;
    }

    .divider {
      border: none;
      border-top: 1px solid #e8f0e8;
      margin: 24px 0;
    }

    .ignore-note {
      font-size: 13px !important;
      color: #7a9a7a !important;
    }

    /* Footer */
    .footer {
      background: #f4faf4;
      border-top: 1px solid #e0ede0;
      padding: 22px 40px;
      text-align: center;
    }

    .footer-logo {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 8px;
    }

    .footer p {
      font-size: 12px;
      color: #8aaa8a;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">

      <!-- HEADER -->
      <div class="header">
        <div class="logo-wrap">
          <!-- Lucide Leaf SVG (inline, email-safe) -->
          <svg class="leaf-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
          <div class="brand-name">
            Thetahliadda Mart
            <span>Fresh · Natural · Organic</span>
          </div>
        </div>
        <h2>Password Reset Request</h2>
      </div>

      <!-- BODY -->
      <div class="body">
        <p>Hi <strong>${name}</strong>,</p>
        <p>We received a request to reset the password for your account. Click the button below to create a new password — it's quick and secure.</p>

        <div class="btn-wrap">
          <a href="${resetUrl}" class="btn">🔒 Reset My Password</a>
        </div>

        <p>Or copy and paste this link into your browser:</p>
        <div class="link-fallback">
          <a href="${resetUrl}">${resetUrl}</a>
        </div>

        <div class="validity-note">
          ⏱ This link will expire in <strong>&nbsp;15 minutes</strong>&nbsp;for your security.
        </div>

        <hr class="divider">

        <p class="ignore-note">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged and no action is needed.</p>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <div class="footer-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            stroke="#3db860" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
        </div>
        <p>&copy; ${new Date().getFullYear()} Thetahliadda Mart. All rights reserved.<br>
        You're receiving this because a password reset was requested for your account.</p>
      </div>

    </div>
  </div>
</body>
</html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

module.exports = {
  sendPasswordResetEmail,
};


