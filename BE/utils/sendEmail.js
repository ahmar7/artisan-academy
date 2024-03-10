const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      // service: process.env.SERVICE,
      port: '2525',
      //   secure: Boolean(process.env.SECURE),
      auth: {
        user: '56b326f87c1be9',
        pass: 'a4721981aada6c',
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
