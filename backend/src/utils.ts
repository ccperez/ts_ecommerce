import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from './models/userModel'

type UserInfo = {
  _id: string
  name: string
  email: string
  isAdmin: boolean
  token: string
}

export const generateToken = (user: User) => {
  const { _id, name, email, isAdmin } = user
  return jwt.sign({ _id, name, email, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  if (authorization) {
    const token = authorization.slice(7, authorization.length) // Bearer xxxxx
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decode as UserInfo
    next()
  } else {
    res.status(401).json({ message: 'No Token' })
  }
}
