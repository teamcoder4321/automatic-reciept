import nodemailer from 'nodemailer';

export async function sendNotificationEmail(receiptData) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NOTIFICATION_FROM,
    to: process.env.FINANCE_TEAM_EMAIL,
    subject: 'New Receipt Processed',
    text: `
      A new receipt has been processed:
      
      Vendor: ${receiptData.vendorName}
      Total Amount: ${receiptData.totalAmount}
      Date: ${receiptData.receiptDate}
      Receipt Number: ${receiptData.receiptNumber}
      
      Items Purchased:
      ${receiptData.itemsPurchased.join('\n')}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent successfully');
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
}