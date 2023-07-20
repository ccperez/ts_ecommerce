import express, { Request, Response } from 'express'
import mongoose from 'mongoose'

import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

import { productRouter } from './routers/productRouter'
import { seedRouter } from './routers/seedRouter'
import { userRouter } from './routers/userRouter'
import { orderRouter } from './routers/orderRouter'
import { keyRouter } from './routers/keyRouter'
import uploadRoutes from './routers/uploadRoutes'

dotenv.config()

const { NODE_ENV, MONGODB_URI } = process.env

mongoose.set('strictQuery', true)
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('connected to mongodb'))
  .catch(() => console.log('error mongodb'))

const app = express()

if (NODE_ENV === 'dev') {
  app.use(
    cors({
      credentials: true,
      origin: [process.env.CLIENT_URL],
    })
  )
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/seed', seedRouter)
app.use('/api/keys', keyRouter)
app.use('/api/upload', uploadRoutes)

app.use(express.static(path.join(__dirname, '../dist')))
app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../dist/index.html'))
)

const PORT: number = parseInt((process.env.PORT || '5000') as string, 10)

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
