import {
  changePasswordValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidationForAdmin,
  updateUserValidationForSelf,
} from '../validation/user-validation.js'
import { requestValidate } from '../validation/validation.js'
import bcrypt from 'bcrypt'
import prisma from '../config/db.js'
import { ResponseError } from '../error/response-error.js'
import { v4 as uuid } from 'uuid'
import { sendEmailNotification, sendVerificationEmail } from '../utils/send-email.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const register = async (data) => {
  const registerRequest = requestValidate(registerUserValidation, data)

  const user = await prisma.user.findUnique({
    where: {
      email: registerRequest.email,
    },
  })
  if (user) throw new ResponseError(400, 'Email sudah terdaftar')

  const hashed = await bcrypt.hash(registerRequest.password, 10)
  const token = uuid()

  await prisma.user.create({
    data: {
      ...registerRequest,
      password: hashed,
      token,
    },
    select: {
      nama_lengkap: true,
      email: true,
      username: true,
      role: true,
    },
  })

  try {
    await sendVerificationEmail(registerRequest.email, token)
  } catch (err) {
    await prisma.user.delete({ where: { id: user.id } })
    throw new ResponseError(500, 'Gagal mengirim email verifikasi. Silakan coba lagi.')
  }

  return { message: 'Registrasi berhasil. Silakan cek email Anda untuk verifikasi.' }
}

const login = async (data) => {
  const loginRequest = requestValidate(loginUserValidation, data)

  const user = await prisma.user.findUnique({
    where: {
      email: loginRequest.email,
    },
  })
  if (!user || !user.password) throw new ResponseError(401, 'Email atau Password salah')

  const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password)
  if (!isPasswordValid) throw new ResponseError(401, 'Email atau Password salah')

  const payload = {
    id: user.id,
    nama_lengkap: user.nama_lengkap,
    email: user.email,
    username: user.username,
    role: user.role,
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })
  return { token }
}

const getUsersByAdmin = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      nama_lengkap: true,
      username: true,
      email: true,
      role: true,
    },
  })
  return users
}

const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nama_lengkap: true,
      username: true,
      email: true,
    },
  })
  if (!user) throw new ResponseError(404, 'User tidak ditemukan')
  return user
}

const updateUserProfile = async (userId, data) => {
  const updateRequest = requestValidate(updateUserValidationForSelf, data)

  await getCurrentUser(userId)

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...updateRequest,
    },
    select: {
      id: true,
      nama_lengkap: true,
      username: true,
      email: true,
    },
  })
  return user
}

const updateUserByAdmin = async (userId, data) => {
  const updateRequest = requestValidate(updateUserValidationForAdmin, data)

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  })
  if (!user) throw new ResponseError(404, 'User tidak ditemukan')

  const updateUser = await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      ...updateRequest,
    },
  })

  return updateUser
}

const deleteUserByAdmin = async (userId) => {
  await getCurrentUser(parseInt(userId))

  await prisma.user.delete({
    where: { id: parseInt(userId) },
  })
  return { message: 'User berhasil dihapus' }
}

const verifyEmail = async (token) => {
  const user = await prisma.user.findFirst({
    where: { token },
  })
  if (!user) throw new ResponseError(400, 'Token verifikasi tidak valid')

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      token: null,
    },
  })
  return { message: 'verifikasi Email berhasil' }
}

const changePassword = async (userId, data) => {
  const changePasswordRequest = requestValidate(changePasswordValidation, data)

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  if (!user) throw new ResponseError(404, 'User tidak ditemukan')

  const isPasswordValid = await bcrypt.compare(changePasswordRequest.oldPassword, user.password)
  if (!isPasswordValid) throw new ResponseError(400, 'Password lama salah')

  const samePassword = await bcrypt.compare(changePasswordRequest.newPassword, user.password)
  if (samePassword)
    throw new ResponseError(400, 'Password baru tidak boleh sama dengan password lama')

  const newHashed = await bcrypt.hash(changePasswordRequest.newPassword, 10)
  await prisma.user.update({
    where: { id: userId },
    data: { password: newHashed },
  })

  await sendEmailNotification(user.email, 'Password berhasil diubah')

  return { message: 'Password berhasil diubah' }
}

export default {
  register,
  login,
  getUsersByAdmin,
  getCurrentUser,
  updateUserProfile,
  updateUserByAdmin,
  deleteUserByAdmin,
  verifyEmail,
  changePassword,
}
