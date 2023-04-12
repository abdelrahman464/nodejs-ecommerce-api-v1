const nodemailer = require("nodemailer");
const mailgun = require("mailgun-js");

const sendEmail = async (options) => {
  // MAILGUN_DOMAIN=sandbox64298fb70c974e42809db2511d6e1836.mailgun.org
  // MAILGUN_SECRET=65604400f40b2deeb76093d1bfd9f1c8-c9746cf8-5036e731

  const DOMAIN = "sandbox0689d49d90bb4fa8a99a3e409f5007e3.mailgun.org";
  const API_KEY = "d0c626f92b2f6ee2bb81209bac057890-d51642fa-08e9461c";
  mailgun({ apiKey: API_KEY, domain: DOMAIN });

  const transporter = nodemailer.createTransport({
    // service: "Mailgun",
    host: "smtp.mailgun.org",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: API_KEY,
    },
  });

  const mailOptions = {
    from: `${process.env.EMAIL_FROM} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);

  // //1- create transporter (services that will send email like =>"gmail","milgun","milltrap")
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT, //if sucure false => port =  587 if true =>port = 465
  //   secure: true,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });
  // //2- define emial options (from ,to ,subject,email content)
  // const mailOpts = {
  //   from: `${process.env.EMAIL_FROM} <${process.env.EMAIL_USER}>`,
  //   to: options.email,
  //   subject: options.subject,
  //   text: options.message,
  // };
  // //3- send email
  // await transporter.sendMail(mailOpts);
};
module.exports = sendEmail;
