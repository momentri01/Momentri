import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import dns from 'node:dns';

// Force IPv4 for all DNS lookups in this module
dns.setDefaultResultOrder('ipv4first');

const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : '';
  
  const options: SMTPTransport.Options = {
    host,
    port: 587,
    secure: false,
    auth: { user, pass },
    connectionTimeout: 10000,
  };
  return nodemailer.createTransport(options);
};

export const sendVerificationEmail = async (email: string, code: string) => {
  console.log(`\n--- VERIFICATION CODE FOR ${email} ---`);
  console.log(`CODE: ${code}`);
  console.log(`---------------------------------------\n`);

  // 1. Try sending via Resend API if key is provided (Highly Recommended for Railway)
  if (process.env.RESEND_API_KEY) {
    try {
      const fromField = process.env.EMAIL_FROM || 'Momentris <onboarding@resend.dev>';
      console.log(`Attempting to send email via Resend API from: ${fromField}`);
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: fromField,
          to: email,
          subject: 'Verify Your Momentris Account',
          html: `<div style="font-family: sans-serif; padding: 40px; text-align: center; color: #111;">
                  <h1 style="font-size: 24px; font-weight: bold;">Momentris</h1>
                  <p style="font-size: 16px; color: #666;">Thank you for joining. Use the code below to verify your account:</p>
                  <div style="font-size: 42px; font-weight: 900; letter-spacing: 10px; margin: 30px 0; color: #000; font-family: monospace;">${code}</div>
                  <p style="font-size: 14px; color: #999;">This code will expire in 10 minutes.</p>
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
