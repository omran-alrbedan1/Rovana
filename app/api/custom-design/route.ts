import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    // Handle FormData for file uploads
    const formData = await req.formData();
    
    const fullName = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const jewelryType = formData.get('jewelryType') as string;
    const goldKarat = formData.get('goldKarat') as string;
    const goldColor = formData.get('goldColor') as string;
    const budget = formData.get('budget') as string;
    const occasion = formData.get('occasion') as string;
    const description = formData.get('description') as string;
    const contactMethod = formData.get('contactMethod') as string;
    const referenceImage = formData.get('referenceImage') as File | null;

    // Validation
    if (!fullName || !phone || !jewelryType || !goldKarat || !description) {
      return NextResponse.json({ message: 'All required fields must be filled.' }, { status: 400 });
    }
    if (fullName.trim().length < 2) {
      return NextResponse.json({ message: 'Name must be at least 2 characters.' }, { status: 400 });
    }
    if (phone.trim().length < 6) {
      return NextResponse.json({ message: 'Please provide a valid phone number.' }, { status: 400 });
    }
    if (description.trim().length < 10) {
      return NextResponse.json({ message: 'Description must be at least 10 characters.' }, { status: 400 });
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

    // Helper to render a card row
    const card = (label: string, value: string | undefined) => {
      if (!value) return '';
      return `
        <tr>
          <td style="padding:12px 28px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ede8;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="background:#f9f7f5;padding:8px 14px;font-size:10px;font-weight:bold;color:#E6C687;text-transform:uppercase;letter-spacing:0.15em;font-family:Arial,sans-serif;">
                  ${label}
                </td>
              </tr>
              <tr>
               <td style="padding:12px 14px;font-size:14px;color:#333333;font-family:Arial,sans-serif;">
                    ${value}
                  </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    };

    // Handle image attachment
    let imageAttachment = null;
    let imageHtml = '';
    
    if (referenceImage && referenceImage.size > 0) {
      const bytes = await referenceImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      imageAttachment = {
        filename: referenceImage.name,
        content: buffer,
        cid: 'referenceImage',
      };
      
      imageHtml = `
        <tr>
          <td style="padding:12px 28px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ede8;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="background:#f9f7f5;padding:8px 14px;font-size:10px;font-weight:bold;color:#E6C687;text-transform:uppercase;letter-spacing:0.15em;font-family:Arial,sans-serif;">
                  Reference Image
                </td>
              </tr>
              <tr>
                <td style="padding:12px 14px;text-align:center;">
                  <img src="cid:referenceImage" alt="${referenceImage.name}" style="max-width:100%;height:auto;border-radius:4px;" />
                  <p style="font-size:11px;color:#888;margin-top:8px;">${referenceImage.name}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    }

    await transporter.sendMail({
      from: `"Rovana Jewelry" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Custom Design Request from ${fullName}`,
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
              <p style="font-size:24px;color:#ffffff;margin:0;font-weight:300;font-family:Arial,sans-serif;">New Custom Design Request</p>
              <p style="font-size:12px;color:#888888;margin:8px 0 0;font-family:Arial,sans-serif;">Customer design form submission</p>
            </td>
          </tr>

          <!-- Section: Customer Info -->
          <tr>
            <td style="padding:28px 28px 0;">
              <p style="font-size:10px;font-weight:bold;color:#E6C687;text-transform:uppercase;letter-spacing:0.2em;margin:0;font-family:Arial,sans-serif;">
                Customer Information
              </p>
              <div style="height:1px;background:#f0ede8;margin-top:8px;"></div>
            </td>
          </tr>

          ${card('Full Name', fullName)}
          ${card('Phone', phone)}
          ${card('Email', email)}
          ${card('Preferred Contact', contactMethod)}

          <!-- Section: Design Details -->
          <tr>
            <td style="padding:28px 28px 0;">
              <p style="font-size:10px;font-weight:bold;color:#E6C687;text-transform:uppercase;letter-spacing:0.2em;margin:0;font-family:Arial,sans-serif;">
                Design Details
              </p>
              <div style="height:1px;background:#f0ede8;margin-top:8px;"></div>
            </td>
          </tr>

          ${card('Jewelry Type', jewelryType)}
          ${card('Gold Karat', goldKarat)}
          ${card('Gold Color', goldColor)}
          ${card('Budget', budget)}
          ${card('Occasion', occasion)}
          ${card('Design Description', description)}
          
          ${imageHtml}

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;">
                <tr>
                  <td style="padding:20px 28px;text-align:center;">
                    <p style="font-size:11px;color:#ffffff;margin:0;font-family:Arial,sans-serif;">
                      Sent via <span style="color:#E6C687;">rovanajewellery.com</span> &nbsp;·&nbsp; ${sentAt}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
      `,
      attachments: imageAttachment ? [imageAttachment] : [],
    });

    return NextResponse.json({ message: 'Custom design request submitted successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Custom design email error:', error);
    return NextResponse.json({ message: 'Failed to submit request. Please try again.' }, { status: 500 });
  }
}