const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: process.env.EMAIL_PORT,

      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    let data = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent successfully", transporter, data);
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};
