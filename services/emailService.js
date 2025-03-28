// services/emailService.js
const nodemailer = require('nodemailer');

// Create a transporter using Gmail's SMTP server (or use your own email service's SMTP server)
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to 'smtp' or any other service if needed
  auth: {
    user: process.env.EMAIL_USER, // Your email address (e.g., your-email@gmail.com)
    pass: process.env.EMAIL_PASS, // Your email password or App Password
  },
});

// Function to send an email
async function sendEmail(to, subject, text, html) {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email address
    to: to, // Recipient email address
    subject: subject, // Email subject
    text: text, // Plain text version of the email
    html: html, // HTML version of the email
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email failed to send');
  }
}

module.exports = { sendEmail };
