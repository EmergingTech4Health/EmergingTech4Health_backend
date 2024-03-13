const nodemailer = require('nodemailer');

const mailSender = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
                port: 465,
                secure: true,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
        });
            let info = await transporter.sendMail(
                {
                    from: 'Emerging Tech4Health',
                    to:`${email}`,
                    subject: `${subject}`,
                    html: `${text}`,
                }
            )
       
       console.log(info);
        return info;
    } catch (error) {
        console.log(error);
    }
}
module.exports = mailSender;