const nodemailer = require('nodemailer')
const passwordReset = require('./emailTemplate/passwordReset')

const sendEmail = async (type, email, payload) => {

    const emailTypes = {
        PasswordReset: {
            subject: "Pineapple Password Reset",
            htmlString: async function (payload) { return await passwordReset(payload) }
        }
    }

    const html = await emailTypes[type].htmlString(payload)

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        await transporter.sendMail({
            to: email,
            subject: emailTypes[type].subject,
            html
        })

        console.log("Email sent successfully")
    } catch (err) {
        console.log("Email not sent")
        console.log(err)
    }
}

module.exports = sendEmail