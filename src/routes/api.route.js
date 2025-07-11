import express from 'express'
import movieController from '../controllers/movie.controller.js'
import userController from '../controllers/auth.controller.js'
import { verifyToken } from '../middlewares/auth-middleware.js'

const userRouter = express.Router()
userRouter.use(verifyToken)

// User API
userRouter.get('/api/users/current', userController.getCurrentUser)
userRouter.put('/api/users/profile', userController.updateUserProfile)
userRouter.put('/api/users/change-password', userController.changePassword)

// Movie API
userRouter.get('/api/movies', movieController.movieQueryParams)

export { userRouter }
