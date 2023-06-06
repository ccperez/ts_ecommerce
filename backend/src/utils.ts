import jwt from 'jsonwebtoken'
import { User } from './models/userModel'

export const generateToken = (user: User) => {
  const { _id, name, email, isAdmin } = user
  return jwt.sign({ _id, name, email, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}
