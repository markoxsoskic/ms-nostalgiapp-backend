const nodemailer = require("nodemailer");

const emailVerification = async (email, link) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: "Verify your \"Nostalgiapp\" account",
            html: `
            <div>
            <h2>Hello!</h2>
            <h3>Thank you for signing up on Nostalgiapp!</h3>
            <br>
            <a href=${link}>Click here to verify your account.</a>
            </div>
            `
        });
        console.log("E-mail sent.");
    } catch (err) {
        console.log("E-mail not sent.");
        console.log(err);
    }
}

module.exports = emailVerification;