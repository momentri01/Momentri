import nodemailer from 'nodemailer';
import dns from 'node:dns';

// Custom lookup function to force IPv4 and log the result
const lookupIPv4 = (hostname: string, options: any, callback: any) => {
  console.log(`DNS Lookup for: ${hostname}`);
  return dns.lookup(hostname, { family: 4 }, (err, address, family) => {
    if (err) {
      console.error(`DNS Lookup Failed for ${hostname}:`, err);
    } else {
      console.log(`DNS Lookup Success: ${hostname} -> ${address} (IPv${family})`);
    }
    callback(err, address, family);
  });
};

const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const user = process.env.EMAIL_USER;
  // Automatically strip spaces from the app password
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : '';
  
  console.log(`Initializing Mailer: Host=${host}, User=${user}, Pass=${pass ? 'PROVIDED (Spaces Stripped)' : 'MISSING'}`);

  const config: any = {
    host: host,
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: true, // Use SSL for 465
    auth: {
      user: user,
      pass: pass,
    },
    // Extremely strict IPv4 enforcement
    family: 4,
    lookup: lookupIPv4,
    debug: true,
    logger: true 
  };

  return nodemailer.createTransport(config);
};

let transporter = createTransporter();

export const sendVerificationEmail = async (email: string, code: string) => {
  console.log(`Attempting to send verification code to: ${email}`);
  
  const mailOptions = {
    from: `"Momentris" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Momentris Account',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 16px;">
        <h1 style="text-align: center;">Momentris</h1>
        <div style="background-color: #f9f9f9; padding: 32px; border-radius: 12px; text-align: center;">
          <h2>Your Verification Code</h2>
          <div style="font-size: 40px; font-weight: 800; letter-spacing: 8px; margin: 20px 0;">${code}</div>
          <p>This code expires in 10 minutes.</p>
        </div>
      </div>
    `,
  };

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP Connection Verified. Sending Mail...');
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error: any) {
    console.error('DETAILED EMAIL ERROR:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      stack: error.stack
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
