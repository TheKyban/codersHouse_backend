import tokenService from "../services/token-service.js"

export const authMiddleware = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = req.cookies
        // console.log(accessToken, refreshToken)

        if (!accessToken) {
            throw new Error()
        }

        const userData = await tokenService.verifyAccessToken(accessToken)

        if (!userData) {
            throw new Error()
        }

        req.user = userData

        next()
    } catch (error) {
        return res.status(401).json({
            message: "invalid tokenn"
        })
    }

}