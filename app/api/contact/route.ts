import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, message } = await req.json();

    if (!name || !phone || !message) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }
    if (name.trim().length < 2) {
      return NextResponse.json({ message: 'Name must be at least 2 characters.' }, { status: 400 });
    }
    if (phone.trim().length < 6) {
      return NextResponse.json({ message: 'Please provide a valid phone number.' }, { status: 400 });
    }
    if (message.trim().length < 10) {
      return NextResponse.json({ message: 'Message must be at least 10 characters.' }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
      console.error('Missing email environment variables');
      return NextResponse.json({ message: 'Email service not configured.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const sentAt = new Date().toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    await transporter.sendMail({
      from: `"Rovana Jewelry" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Inquiry from ${name}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a;padding:36px 28px;text-align:center;">
              <div style="width:40px;height:2px;background:#E6C687;margin:0 auto 16px;"></div>
              <div style="margin-bottom:16px;">
                <img src="https://rovana-gilt.vercel.app/assets/logo-as-CZhQ19Bt.jpg" alt="Rovana Jewelry" style="width:60px;height:60px;border-radius:50%;border:2px solid #E6C687;">
              </div>
              <p style="font-size:10px;color:#E6C687;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px;font-family:Arial,sans-serif;">Rovana Jewelry</p>
              <p style="font-size:24px;color:#ffffff;margin:0;font-weight:300;font-family:Arial,sans-serif;">New Message Received</p>
              <p style="font-size:12px;color:#888888;margin:8px 0 0;font-family:Arial,sans-serif;">Customer contact form submission</p>
            </td>
          </tr>

          <!-- Name Card -->
          <tr>
            <td style="padding:24px 28px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ede8;border-radius:8px;overflow:hidden;">
                <tr>
                  <td style="background:#f9f7f5;padding:8px 14px;font-size:10px;font-weight:bold;color:#E6C687;text-transform:uppercase;letter-spacing:0.15em;font-family:Arial,sans-serif;">
                    Name
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;font-size:14px;color:#333333;font-family:Arial,sans-serif;">
                    ${name}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Phone Card -->
          <tr>
            <td style="padding:12px 28px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ede8;border-radius:8px;overflow:hidden;">
                <tr>
                  <td style="background:#f9f7f5;padding:8px 14px;font-size:10px;font-weight:bold;color:#E6C687;text-transform:uppercase;letter-spacing:0.15em;font-family:Arial,sans-serif;">
                    Phone
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 14px;font-size:14px;color:#333333;font-family:Arial,sans-serif;">
                    ${phone}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Card -->
          <tr>
            <td style="padding:12px 28px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ede8;border-radius:8px;overflow:hidden;">
                <tr>
                  <td style="background:#f9f7f5;padding:8px 14px;font-size:10px;font-weight:bold;color:#E6C687;text-transform:uppercase;letter-spacing:0.15em;font-family:Arial,sans-serif;">
                    Message
                  </td>
                </tr>
                <tr>
                   <td style="padding:12px 14px;font-size:14px;color:#333333;font-family:Arial,sans-serif;">
                    ${message}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a1a1a;padding:20px 28px;text-align:center;margin-top:24px;">
              <p style="font-size:11px;color:#555555;margin:0;font-family:Arial,sans-serif;">
                Sent via <span style="color:#E6C687;">rovanajewellery.com</span> &nbsp;·&nbsp; ${sentAt}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
      `,
    });

    return NextResponse.json({ message: 'Message sent successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ message: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}