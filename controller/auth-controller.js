import OtpService from '../services/otp-service.js'
import HashService from '../services/hash-service.js'
import UserService from '../services/user-service.js'
import TokenService from '../services/token-service.js'
import UserDto from '../dtos/user-dto.js'
// import tokenService from '../services/token-service.js'

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
            return res.status(400).json({ message: "all fields are required", auth: false })
        }

        const [hashOtp, expires] = hash.split(".")

        if (Date.now() > expires) {
            return res.status(400).json({
                message: "OTP expired",
                auth: false
            })
        }

        const data = `${phone}.${otp}.${expires}`

        const isValid = await OtpService.verifyOtp(data, hashOtp)


        if (!isValid) {
            return res.status(400).json({ message: "invalid OTP", auth: false })
        }

        let user;

        try {

            user = await UserService.findUser(phone)

            if (!user) {
                user = await UserService.CreateUser(phone)
            }

        } catch (error) {
            return res.status(500).json({ message: "DB error" })
        }

        /**
         * Tokens
         */

        const { accessToken, refreshToken } = TokenService.generateTokens({ _id: user._id, activated: user.activated })

        await TokenService.storeRefreshToken(refreshToken, user._id)

        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true
        })

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true
        })

        const details = new UserDto(user)
        res.json({ user: details, auth: true })
    }

    async refresh(req, res) {
        // get refresh token from cookie
        const { refreshToken: oldRefreshToken } = req.cookies

        // console.log(oldRefreshToken)

        // check if token is valid
        let userData;
        try {
            userData = await TokenService.verifyRefreshToken(oldRefreshToken)
        } catch (error) {
            return res.status(401).json({
                message: "invalid token"
            })
        }

        // check if token is in database
        try {
            const token = await TokenService.findRefreshToken(userData._id, oldRefreshToken)

            if (!token) {
                return res.status(401).json({ message: "Invalid Token" })
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal error" })
        }

        // check if valid user
        const user = await UserService.findUserById(userData._id)

        if (!user) {
            return res.status(404).json({ message: "no user" })
        }

        // generate new tokens

        const { refreshToken, accessToken } = await TokenService.generateTokens({ _id: userData._id })

        // update refresh token
        try {
            await TokenService.updateRefreshToken(userData._id, refreshToken)
        } catch (error) {
            return res.status(500).json({ message: "Internal error" })
        }

        // put in cookies
        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true
        })

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true
        })

        // response
        const details = new UserDto(user)
        res.json({ user: details, auth: true })
    }

    /**
     * Logout
     */

    async logout(req, res) {
        const { refreshToken } = req.cookies
        await TokenService.removeToken(refreshToken)
        res.clearCookie('refreshToken')
        res.clearCookie('accessToken')
        res.json({ user: null, auth: false })
    }
}

export default new AuthController();