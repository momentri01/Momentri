import nodemailer from 'nodemailer';

// Helper to create transporter with better defaults for cloud environments
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const isGmail = host.includes('gmail.com');

  const config: any = {
    host: host,
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: process.env.EMAIL_SECURE !== 'false', // Default to true for 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Force IPv4
    family: 4,
  };

  // If using Gmail, 'service' property often works better with Nodemailer
  if (isGmail) {
    delete config.host;
    delete config.port;
    delete config.secure;
    config.service = 'gmail';
  }

  return nodemailer.createTransport(config);
};

const transporter = createTransporter();

export const sendVerificationEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: `"Momentris" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Momentris Account',
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #000000; font-size: 32px; font-weight: 800; margin: 0; letter-spacing: -1px;">Momentris</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 32px; border-radius: 12px; text-align: center;">
          <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 700; margin-bottom: 16px;">Verify your email</h2>
          <p style="color: #666666; font-size: 16px; line-height: 24px; margin-bottom: 32px;">
            Thank you for joining Momentris. To complete your registration, please enter the following verification code:
          </p>
          <div style="background-color: #ffffff; padding: 24px; border: 2px solid #e5e5e5; border-radius: 12px; display: inline-block;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 40px; font-weight: 800; color: #000000; letter-spacing: 8px;">${code}</span>
          </div>
          <p style="color: #999999; font-size: 14px; margin-top: 32px;">
            This code will expire in 10 minutes. If you didn't request this email, you can safely ignore it.
          </p>
        </div>
        <div style="text-align: center; margin-top: 40px;">
          <p style="color: #999999; font-size: 12px; margin: 0;">
            &copy; 2026 Momentris. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    // Verify connection before sending
    await transporter.verify();
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};
