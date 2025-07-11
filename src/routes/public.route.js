import express from 'express'
import authController from '../controllers/auth.controller.js'

const publicRouter = express.Router()

publicRouter.post('/api/users/register', authController.register)
publicRouter.post('/api/users/login', authController.login)
publicRouter.get('/api/users/verify-email', authController.verifyEmail)

export { publicRouter }
