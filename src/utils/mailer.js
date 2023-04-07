const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config
// const { mail } = configs

/**
 * It sends an email to the specified recipient(s) using the specified subject and message
 * @param {string[] | string} to - The email address of the recipient
 * @param {string} subject - The subject of the email
 * @param {string} message - The message to be sent
 * @param {string} [from] - The email address that the email is sent from.
 * @returns A boolean
 */

const sendMail = async (to, subject, message, from) => {
  from = from || `Citrone <no-reply${process.env.APP_DOMAIN}>`
  if(!to) return
  
  // create reus able transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", //process.env.EMAIL_HOST,
    port: 465, //process.env.PORT,
    auth: {
      user: "vhoti.app@gmail.com", //process.env.EMAIL_USERNAME,
      pass: "jpncvufrlppdxesl", //process.env.EMAIL_PASSWORD
    }
  });

  // send mail with defined transport object
  const result = await transporter.sendMail({
    from, // sender address
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    // text: "Hello world?", // plain text body
    html: message, // html body,
    contentType: "text/html"
  });

  if(!result) throw new Error("Unable to send email")

  return true
}

module.exports = {
  sendMail
}