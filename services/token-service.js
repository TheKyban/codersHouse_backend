import jwt from "jsonwebtoken"
import refreshModel from "../models/refresh-model.js"

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '1m'
        })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '1y'
        })

        return {
            accessToken, refreshToken
        }
    }

    async storeRefreshToken(token, userId) {
        try {
            await refreshModel.create({ token, userId })
        } catch (error) {
            console.log(error)
        }
    }

    async verifyAccessToken(token) {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    }

    async verifyRefreshToken(token) {
        // console.log(process.env.JWT_REFRESH_SECRECT)
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    }

    async findRefreshToken(userId, refreshToken) {
        return await refreshModel.findOne({ userId: userId, token: refreshToken })
    }

    async updateRefreshToken(userId, refreshToken) {
        return await refreshModel.updateOne({ userId: userId }, { token: refreshToken })
    }

    async removeToken(refreshToken) {
        await refreshModel.deleteOne({token:refreshToken})
    }

}

export default new TokenService()