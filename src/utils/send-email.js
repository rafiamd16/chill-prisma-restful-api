import nodemailer from 'nodemailer'
import 'dotenv/config'

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verifikasi Email',
    html: `<a href="${process.env.BASE_URL}/verify-email?token=${token}">Klik untuk verifikasi email</a>`,
  })
}

export const sendEmailNotification = async (to, content) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: `"Chill Movie App" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Notifikasi Akun',
    html: `<p>${content}</p>`,
  })
}
