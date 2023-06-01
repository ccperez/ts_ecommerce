import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { productRouter } from './routers/productRouter'
import { seedRouter } from './routers/seedRouter'

dotenv.config()

const { MONGODB_URI, CLIENT_URL, PORT } = process.env

mongoose.set('strictQuery', true)
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('connected to mongodb'))
  .catch(() => console.log('error mongodb'))

const app = express()

app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  })
)

app.use('/api/products', productRouter)
app.use('/api/seed', seedRouter)

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
