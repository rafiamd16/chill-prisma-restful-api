import z from 'zod'

export const registerUserValidation = z.object({
  nama_lengkap: z
    .string()
    .trim()
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  email: z
    .string()
    .trim()
    .min(3, 'Email minimal 3 karakter')
    .max(100, 'Email maksimal 100 karakter')
    .email('Email tidak valid'),
  username: z
    .string()
    .trim()
    .min(3, 'Username minimal 3 karakter')
    .max(100, 'Username maksimal 100 karakter'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

export const loginUserValidation = z.object({
  email: z
    .string()
    .trim()
    .min(3, 'Email minimal 3 karakter')
    .max(100, 'Email maksimal 100 karakter')
    .email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

export const updateUserValidationForSelf = z.object({
  nama_lengkap: z
    .string()
    .trim()
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .optional(),
  username: z
    .string()
    .trim()
    .min(3, 'Username minimal 3 karakter')
    .max(100, 'Username maksimal 100 karakter')
    .optional(),
  email: z
    .string()
    .trim()
    .min(3, 'Email minimal 3 karakter')
    .max(100, 'Email maksimal 100 karakter')
    .email()
    .optional(),
})

export const updateUserValidationForAdmin = z.object({
  nama_lengkap: z
    .string()
    .trim()
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .optional(),
  username: z
    .string()
    .trim()
    .min(3, 'Username minimal 3 karakter')
    .max(100, 'Username maksimal 100 karakter')
    .optional(),
  email: z
    .string()
    .trim()
    .min(3, 'Email minimal 3 karakter')
    .max(100, 'Email maksimal 100 karakter')
    .email()
    .optional(),
  role: z.enum(['user', 'admin']).optional(),
})

export const changePasswordValidation = z.object({
  oldPassword: z.string().min(8, 'Password minimal 8 karakter'),
  newPassword: z.string().min(8, 'Password minimal 8 karakter'),
})
