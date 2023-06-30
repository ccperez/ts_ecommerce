import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { productRouter } from './routers/productRouter'
import { seedRouter } from './routers/seedRouter'
import { userRouter } from './routers/userRouter'
import { orderRouter } from './routers/orderRouter'
import { keyRouter } from './routers/keyRouter'

dotenv.config()

mongoose.set('strictQuery', true)
mongoose
  .connect(process.env.PRD_MONGODB_URI)
  .then(() => console.log('connected to mongodb'))
  .catch(() => console.log('error mongodb'))

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/seed', seedRouter)
app.use('/api/keys', keyRouter)

app.use(express.static(path.join(__dirname, '../dist')))
app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../dist/index.html'))
)

const PORT: number = parseInt((process.env.PORT || '5000') as string, 10)

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
