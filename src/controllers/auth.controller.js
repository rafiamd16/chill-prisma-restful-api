import authService from '../services/auth.service.js'

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body)
    res.status(201).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    res.status(200).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const getUsersByAdmin = async (req, res, next) => {
  try {
    const result = await authService.getUsersByAdmin()
    res.status(200).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const getCurrentUser = async (req, res, next) => {
  try {
    const result = await authService.getCurrentUser(req.user.id)
    res.status(200).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const updateUserProfile = async (req, res, next) => {
  try {
    const result = await authService.updateUserProfile(req.user.id, req.body)
    res.status(200).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const updateUserByAdmin = async (req, res, next) => {
  try {
    const result = await authService.updateUserByAdmin(req.params.id, req.body)
    res.status(200).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const deleteUserByAdmin = async (req, res, next) => {
  try {
    const result = await authService.deleteUserByAdmin(req.params.id)
    res.status(200).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const verifyEmail = async (req, res, next) => {
  try {
    const result = await authService.verifyEmail(req.query.token)
    res.status(200).json({ data: result })
  } catch (err) {
    next(err)
  }
}

const changePassword = async (req, res, next) => {
  try {
    const result = await authService.changePassword(req.user.id, req.body)
    res.status(200).json({ data: result })
  } catch (err) {
    next(err)
  }
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
