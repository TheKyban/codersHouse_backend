import { randomInt } from 'node:crypto'
import Twilio from 'twilio'
import hashService from './hash-service.js'

// import { config } from 'dotenv'
// import path from 'path'

// /**
//  * Dotenv configuration
//  */
// config({
//     path: path.join(process.cwd(), ".env")
// })




class OtpService {

    async generateOtp() {
        const OTP = await randomInt(1000, 9999)
        return OTP
    }

    async sendBySms(phone, otp) {
        const smsSid = process.env.TWILIO_SID
        const smsAuthToken = process.env.TWILIO_AUTH_TOKEN
        const twilio = Twilio(smsSid, smsAuthToken)

        console.log(otp)

        // return await twilio.messages.create({
        //     to: phone,
        //     from: process.env.MY_PHONE_NUMBER,
        //     body: `Your coderhouse OTP is ${otp}`
        // })
    }
    async verifyOtp(data, hash) {
        let computedHash = await hashService.hashOtp(data);
        return computedHash === hash ? true : false
    }
}

export default new OtpService()