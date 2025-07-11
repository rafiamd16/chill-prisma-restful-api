import jwt from 'jsonwebtoken'
import { ResponseError } from '../error/response-error.js'

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization
  if (!header) throw new ResponseError(401, 'Unauthorized')

  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    throw new ResponseError(403, 'Token tidak valid')
  }
}
