import express, { Request, Response } from 'express'
import multer from 'multer'
import streamifier from 'streamifier'
import { isAuth, isAdmin } from '../utils'
import cloudinary from '../cloudinary'
import { ProductModel } from '../models/productModel'

const upload = multer()

const uploadRouter = express.Router()

uploadRouter.post(
  '/',
  isAuth,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
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

uploadRouter.put(
  '/image/:id',
  isAuth,
  isAdmin,
  async (req: Request, res: Response) => {
    const product = await ProductModel.findById(req.body.idProduct)
    const productImages = await cloudinary.uploader.destroy(req.params.id)
    if (product && productImages) {
      product.images = req.body.images
      await product.save()
      res.json({
        message: 'Product Image Deleted',
        product: { _id: product!._id, images: product!.images },
      })
    } else {
      res.status(404).json({ message: 'Product Image Not Found' })
    }
  }
)

export default uploadRouter
