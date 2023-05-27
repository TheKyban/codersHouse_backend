import express from 'express'
import authController from './controller/auth-controller.js'

const router = express.Router()

router.post("/api/send-otp",authController.sendOtp)
router.post("/api/verify-otp",authController.verifyOtp)

export default router;