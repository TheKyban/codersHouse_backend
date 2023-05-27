import jwt from "jsonwebtoken"

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '1h'
        })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRECT, {
            expiresIn: '1y'
        })

        return {
            accessToken, refreshToken
        }
    }

}

export default new TokenService()