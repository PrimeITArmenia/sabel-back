const nodemailer = require('nodemailer');
require('dotenv').config();

function sendMail(email, message) {
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_TLS,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });

    const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: message.subject,
    text: message.text 
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log(info)
        console.log('Email sent: ' + info.response);
    }
    });
}

module.exports = sendMail