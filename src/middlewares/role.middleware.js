import { ResponseError } from '../error/response-error.js'

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') throw new ResponseError(403, 'Akses khusus admin')
  next()
}
