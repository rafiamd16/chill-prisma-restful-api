import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { errorMiddleware } from './middlewares/error-middleware.js'
import { userRouter } from './routes/api.route.js'
import { publicRouter } from './routes/public.route.js'
import { adminRouter } from './routes/admin.route.js'
import path from 'path'

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')))

app.use(publicRouter)
app.use(userRouter)
app.use(adminRouter)

app.use(errorMiddleware)

app.listen(PORT, () => console.log('Server running on port', PORT))
