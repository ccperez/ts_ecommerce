import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { User, UserModel } from '../models/userModel'
import { generateToken, isAuth, isAdmin } from '../utils'
import { emailResetPasswordOTP } from '../mailer'

import { Order, OrderModel } from '../models/orderModel'
import * as mongoose from 'mongoose'

export const userRouter = express.Router()

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const users = await UserModel.find({})
    res.json(users)
  })
)

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

userRouter.put(
  '/profile',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.user._id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) user.password = bcrypt.hashSync(req.body.password)
      const updatedUser = await user.save()
      const { _id, name, email, isAdmin } = updatedUser
      const token = generateToken(user)
      res.json({ _id, name, email, isAdmin, token })
      return
    }
    res.status(404).json({ message: 'User not found' })
  })
)

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const idUser = req.params.id
    const hasOrders = await OrderModel.find({ user: idUser })
    if (hasOrders.length > 0) {
      res.status(404).json({ message: "Can't delete it has related orders" })
    } else {
      const deletedUser = await UserModel.findByIdAndDelete(idUser)
      deletedUser
        ? res.json({ message: 'User Deleted' })
        : res.status(404).json({ message: 'User not found' })
    }
  })
)
