import nodemailer from 'nodemailer';

const sendEmail = async (email: string, subject: string, body: string) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // should be replaced with real sender's account
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PW
        }
    });
    let mailOptions = {
        // should be replaced with real recipient's account
        from: `Cybertron Technologies <${process.env.EMAIL_ID}>`,
        to: email,
        subject: subject,
        html: body,
    };
    return transporter.sendMail(mailOptions);
}

export default sendEmail;