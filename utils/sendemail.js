const nodeemail = require("nodemailer");

exports.sendEmail = async (options) => {
  const transporter = nodeemail.createTransport({
    host: process.env.SMTP_HOST,  // Corrected variable name
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_MAIL_SERVICE,
    secure:true,
    logger:true,
    debug:true,
    secureConnection:false,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,  
    },
    tls:{
      rejectUnauthorized:true,
    }
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

