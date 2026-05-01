import nodemailer from 'nodemailer';
import dns from 'node:dns';

// Custom lookup function to force IPv4
const lookupIPv4 = (hostname: string, options: any, callback: any) => {
  return dns.lookup(hostname, { family: 4 }, (err, address, family) => {
    if (err) console.error(`DNS Lookup Failed: ${hostname}`, err);
    callback(err, address, family);
  });
};

const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : '';
  
  console.log(`Initializing Mailer: Host=${host}, User=${user}, Port=587`);

  const config: any = {
    host: host,
    port: 587, // Switching to 587 (STARTTLS)
    secure: false, // Must be false for 587
    auth: {
      user: user,
      pass: pass,
    },
    // Force IPv4
    family: 4,
    lookup: lookupIPv4,
    // Increase timeouts for cloud environments
    connectionTimeout: 20000, // 20 seconds
    greetingTimeout: 20000,
    socketTimeout: 20000,
    debug: true,
    logger: true 
  };

  return nodemailer.createTransport(config);
};

let transporter = createTransporter();

export const sendVerificationEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: `"Momentris" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Momentris Account',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 16px;">
        <h1 style="text-align: center; color: #000;">Momentris</h1>
        <div style="background-color: #f9f9f9; padding: 32px; border-radius: 12px; text-align: center;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <div style="font-size: 40px; font-weight: 800; letter-spacing: 8px; margin: 20px 0; color: #000;">${code}</div>
          <p style="color: #666;">This code expires in 10 minutes.</p>
        </div>
      </div>
    `,
  };

  try {
    console.log('Attempting to send email via Port 587...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error: any) {
    console.error('DETAILED EMAIL ERROR:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
