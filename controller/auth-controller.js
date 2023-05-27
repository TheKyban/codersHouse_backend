import OtpService from '../services/otp-service.js'
import HashService from '../services/hash-service.js'
import UserService from '../services/user-service.js'
import TokenService from '../services/token-service.js'
import UserDto from '../dtos/user-dto.js'

class AuthController {

    async sendOtp(req, res) {

        const { phone } = req.body

        if (!phone) {
            return res.status(400).json({ message: "phone field is required" })
        }

        const otp = await OtpService.generateOtp()

        // Hash
        const ttl = 1000 * 60 * 5
        const expires = Date.now() + ttl
        const data = `${phone}.${otp}.${expires}`
        const hash = await HashService.hashOtp(data)
        // Hash

        // send otp
        try {
            await OtpService.sendBySms(phone, otp)
            res.json({
                hash: `${hash}.${expires}`,
                phone
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: "message sending failed"
            })
        }
    }

    /**
     * Verify OTP
     */

    async verifyOtp(req, res) {
        const { phone, otp, hash } = req.body

        if (!otp || !hash || !phone) {
            return res.status(400).json({ message: "all fields are required" })
        }

        const [hashOtp, expires] = hash.split(".")

        if (Date.now() > expires) {
            return res.status(400).json({
                message: "OTP expired"
            })
        }

        const data = `${phone}.${otp}.${expires}`

        const isValid = await OtpService.verifyOtp(data, hashOtp)

        console.log(isValid)

        if (!isValid) {
            return res.status(400).json({ message: "invalid OTP" })
        }

        let user;

        try {

            user = await UserService.findUser(phone)

            // console.log(user)

            if (!user) {
                user = await UserService.CreateUser(phone)
                console.log(user)
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "DB error" })
        }

        /**
         * Tokens
         */

        const { accessToken, refreshToken } = TokenService.generateTokens({ _id: user._id, activated: false })

        res.cookie("refreshtoken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true
        })
        const details = new UserDto(user)
        res.json({ accessToken, user: details })
    }
}

export default new AuthController();