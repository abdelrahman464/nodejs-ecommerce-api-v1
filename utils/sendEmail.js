const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1- create transporter (services that will send email like =>"gmail","milgun","milltrap")
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "apdomedo6@gmail.com", // your email address
      pass: "okpvsjrmfcqrzaxg", // your email password
    },
  });
  //2- define emial options (from ,to ,subject,email content)
  const mailOptions = {
    from: `E-shop <apdomedo6@gmail.com>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };
  //3- send email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
