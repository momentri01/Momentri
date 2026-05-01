import nodemailer from 'nodemailer';
import dns from 'node:dns';

// Custom lookup function to force IPv4
const lookupIPv4 = (hostname: string, options: any, callback: any) => {
  return dns.lookup(hostname, { family: 4 }, (err, address, family) => {
    callback(err, address, family);
  });
};

const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : '';
  
  return nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    auth: { user, pass },
    family: 4,
    lookup: lookupIPv4,
    connectionTimeout: 10000,
  });
};

export const sendVerificationEmail = async (email: string, code: string) => {
  console.log(`\n--- VERIFICATION CODE FOR ${email} ---`);
  console.log(`CODE: ${code}`);
  console.log(`---------------------------------------\n`);

  // 1. Try sending via Resend API if key is provided (Highly Recommended for Railway)
  if (process.env.RESEND_API_KEY) {
    try {
      console.log('Attempting to send email via Resend API...');
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Momentris <onboarding@resend.dev>',
          to: email,
          subject: 'Verify Your Momentris Account',
          html: `<div style="font-family: sans-serif; padding: 40px; text-align: center;">
                  <h1>Momentris</h1>
                  <p>Your verification code is:</p>
                  <div style="font-size: 40px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">${code}</div>
                </div>`,
        }),
      });

      if (response.ok) {
        console.log('Email sent successfully via Resend API');
        return;
      }
      console.error('Resend API failed:', await response.text());
    } catch (apiError) {
      console.error('Resend API Error:', apiError);
    }
  }

  // 2. Fallback to SMTP
  try {
    console.log('Attempting SMTP fallback...');
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Momentris" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Momentris Account',
      text: `Your verification code is: ${code}`,
      html: `<b>Your verification code is: ${code}</b>`,
    });
    console.log('Email sent via SMTP');
  } catch (error: any) {
    console.warn('SMTP Fallback failed. Please check Railway logs for the code.');
    // We don't throw here so the user is redirected to the verification page anyway
  }
};
