const nodemailer = require('nodemailer');

const sendEmail = async(options) => {
  // 1) Create transport
    const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the mail options
    const mailOptions = {
    from: 'Ian Githungo <admin@fantastic.com> ',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the mail
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
