// import api from 'axios'
import express from 'express'
import authController from './controller/auth-controller.js'
import ActivateController from './controller/activate-controller.js'
import { authMiddleware } from './middlewares/auth-middleware.js'
import RoomController from './rooms/RoomController.js'

const router = express.Router()

router.post("/api/send-otp", authController.sendOtp)
router.post("/api/verify-otp", authController.verifyOtp)
router.post('/api/activate', authMiddleware, ActivateController.activate)
router.get('/api/refresh', authController.refresh)
router.post('/api/logout', authMiddleware, authController.logout)
router.post('/api/rooms', authMiddleware, RoomController.create)
router.get('/api/rooms', authMiddleware, RoomController.index)



export default router;