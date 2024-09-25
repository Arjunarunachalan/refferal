const OTP = require("../../Models/otp")
const generateOtp = require("../../utilities/generateOtp")
const { hashData } = require("../../utilities/hashData")
const {sendEmail} = require("../../utilities/sendmail")
const moment = require("moment")

const { AUTH_EMAIL } = process.env

const sendInvoice = async ({email,template,subject,products}) => {
    try {
        if (!(email)) {
            throw Error("Provide proper email")
        }


        //send email
        const mailOptions ={
            from: AUTH_EMAIL,
            to: email,
            subject:subject,
            template:template,
            context:{

            }
        }

        await sendEmail(mailOptions)


    } catch (error) {
        console.log('error send otp',error.message);
        throw error
    }
}

module.exports = { sendInvoice };