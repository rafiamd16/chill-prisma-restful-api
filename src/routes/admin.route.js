import { Router } from 'express'
import { isAdmin } from '../middlewares/role.middleware.js'
import userController from '../controllers/auth.controller.js'
import { verifyToken } from '../middlewares/auth-middleware.js'
import { uploadImage, validateImageFile } from '../middlewares/upload.middleware.js'
import movieController from '../controllers/movie.controller.js'

const adminRouter = Router()
adminRouter.use(verifyToken, isAdmin)

// User API
adminRouter.get('/api/users', userController.getUsersByAdmin)
adminRouter.put('/api/users/:id', userController.updateUserByAdmin)
adminRouter.delete('/api/users/:id', userController.deleteUserByAdmin)

// Movie API
adminRouter.get('/api/movies/:id', movieController.getMovieById)
adminRouter.post('/api/movies', uploadImage, validateImageFile, movieController.createMovie)
adminRouter.put('/api/movies/:id', uploadImage, validateImageFile, movieController.updateMovie)
adminRouter.delete('/api/movies/:id', movieController.deleteMovie)

export { adminRouter }
