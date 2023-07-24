import express, { Request, Response } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import streamifier from 'streamifier'
import { isAuth, isAdmin } from '../utils'

const upload = multer()

const uploadRouter = express.Router()

uploadRouter.post(
  '/',
  isAuth,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    const streamUpload = (req: any) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          result ? resolve(result) : reject(error)
        })
        streamifier.createReadStream(req.file.buffer).pipe(stream)
      })
    }
    const result = await streamUpload(req)
    res.send(result)
  }
)

uploadRouter.delete(
  '/image/:id',
  isAuth,
  isAdmin,
  async (req: Request, res: Response) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    const productImages = await cloudinary.uploader.destroy(req.params.id);
    productImages
      ? res.json({ message: 'Product Image Deleted' })
      : res.status(404).json({ message: 'Product Image Not Found' })
  }
)

export default uploadRouter
