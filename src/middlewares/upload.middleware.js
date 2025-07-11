import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { ResponseError } from '../error/response-error.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e5)}${ext}`
    cb(null, filename)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg']
  if (allowed.includes(file.mimetype)) cb(null, true)
  else cb(new Error('Hanya JPG, JPEG dan PNG yang diperbolehkan'), false)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
})

const validateImageFile = (req, res, next) => {
  const file = req.file
  if (!file) {
    throw new ResponseError(400, 'File thumbnail wajib di-upload')
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.mimetype)) {
    throw new ResponseError(400, 'Tipe file harus JPG, JPEG atau PNG')
  }

  next()
}

export const uploadImage = upload.single('thumbnail')
export { validateImageFile }
