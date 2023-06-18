import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { User, UserModel } from '../models/userModel'
import { generateToken } from '../utils'
import { emailResetPasswordOTP } from '../mailer'

export const userRouter = express.Router()
// POST /api/users/signin
userRouter.post(
  '/signin',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })
    if (user && (await bcrypt.compareSync(password, user.password))) {
      const { _id, name, email, isAdmin } = user
      const token = generateToken(user)
      res.json({ _id, name, email, isAdmin, token })
      return
    }

    res.status(401).json({ message: 'Invalid email or password' })
  })
)

userRouter.post(
  '/signup',
  asyncHandler(async (req: Request, res: Response) => {
    const userExists = await UserModel.findOne({ email: req.body.email })
    if (userExists) res.status(400).json({ message: 'User already exists' })

    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    } as User)

    const { _id, name, email, isAdmin } = user
    const token = generateToken(user)
    res.json({ _id, name, email, isAdmin, token })
  })
)

userRouter.post(
  '/password/reset',
  asyncHandler(async (req: Request, res: Response) => {
    const info = req.body.data.split('|')
    const user = await UserModel.findOne({ email: info[1] })
    if (user) {
      switch (info[0]) {
        case '1':
          // 0:type|1:email|2:otp
          emailResetPasswordOTP({ user, otp: info[2] })
          break
        case '2':
          // 0:type|1:email|2:newPassword
          user.password = bcrypt.hashSync(info[2])
          await user.save()
      }
      res.json({ data: info[0] === '1' ? req.body.data : 'success' })
      return
    }
    res.status(400).json({ message: 'Email provided not exits' })
  })
)
