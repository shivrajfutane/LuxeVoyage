import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using environment variables
// Note: For Gmail, use an App Password. For others, standard SMTP credentials.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a deletion OTP to the user's email.
 * @param {string} email - The user's email address.
 * @param {string} otp - The 6-digit OTP.
 */
export const sendDeleteOTP = async (email, otp) => {
  const mailOptions = {
    from: '"LuxeVoyage Security" <security@luxevoyage.com>',
    to: email,
    subject: 'LuxeVoyage: Confirm Account Deletion',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #050505; color: #ffffff; border: 1px solid #d4af37;">
        <h1 style="color: #d4af37; font-size: 24px; border-bottom: 1px solid #333; padding-bottom: 20px;">Identity Verification Required</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #cccccc;">You have requested to permanently delete your LuxeVoyage account. This action is irreversible and will erase all your itineraries and data.</p>
        <div style="background: rgba(212, 175, 55, 0.1); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
          <p style="font-size: 14px; letter-spacing: 2px; color: #d4af37; margin-bottom: 10px;">YOUR SECURITY CODE</p>
          <h2 style="font-size: 48px; letter-spacing: 12px; margin: 0; color: #ffffff;">${otp}</h2>
        </div>
        <p style="font-size: 14px; color: #888888;">This code will expire in 10 minutes. If you did not request this, please secure your account immediately.</p>
        <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px; font-size: 12px; color: #555555; text-align: center;">
          <p>&copy; 2026 LuxeVoyage | Elite Travel Concierge</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL-SERVICE] Deletion OTP sent to:', email);
    return info;
  } catch (error) {
    console.error('[EMAIL-SERVICE] Error sending email:', error);
    // In development, log the OTP anyway for easier testing without a real SMTP
    console.log(`[DEV-MODE] SECURITY CODE for ${email}: ${otp}`);
    return null;
  }
};

/**
 * Sends a password reset PIN to the user's email.
 * @param {string} email - The user's email address.
 * @param {string} pin - The 6-digit PIN.
 */
export const sendResetPIN = async (email, pin) => {
  const mailOptions = {
    from: '"LuxeVoyage Security" <security@luxevoyage.com>',
    to: email,
    subject: 'LuxeVoyage: Password Recovery Request',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #050505; color: #ffffff; border: 1px solid #d4af37;">
        <h1 style="color: #d4af37; font-size: 24px; border-bottom: 1px solid #333; padding-bottom: 20px;">Secure Account Recovery</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #cccccc;">We received a request to reset your password for your LuxeVoyage account. Use the code below to authorize this change.</p>
        <div style="background: rgba(212, 175, 55, 0.1); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
          <p style="font-size: 14px; letter-spacing: 2px; color: #d4af37; margin-bottom: 10px;">YOUR RECOVERY CODE</p>
          <h2 style="font-size: 48px; letter-spacing: 12px; margin: 0; color: #ffffff;">${pin}</h2>
        </div>
        <p style="font-size: 14px; color: #888888;">This code will expire in 10 minutes. If you did not request this, please ignore this email or contact support.</p>
        <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px; font-size: 12px; color: #555555; text-align: center;">
          <p>&copy; 2026 LuxeVoyage | Elite Travel Concierge</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL-SERVICE] Reset PIN sent to:', email);
    return info;
  } catch (error) {
    console.error('[EMAIL-SERVICE] Error sending email:', error);
    console.log(`[DEV-MODE] RECOVERY CODE for ${email}: ${pin}`);
    return null;
  }
};
