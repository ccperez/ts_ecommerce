import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { UserModel } from '../models/userModel'
import { generateToken } from '../utils'

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
