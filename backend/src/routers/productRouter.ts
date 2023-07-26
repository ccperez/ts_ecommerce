import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { v2 as cloudinary } from 'cloudinary'
import { ProductModel } from '../models/productModel'
import { isAuth, isAdmin } from '../utils'

export const productRouter = express.Router()

const PAGE_SIZE = 2

productRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await ProductModel.find()
    res.json(products)
  })
)

productRouter.get(
  '/categories',
  asyncHandler(async (req: Request, res: Response) => {
    const categories = await ProductModel.find().distinct('category')
    res.json(categories)
  })
)

productRouter.get(
  '/search',
  asyncHandler(async (req: Request, res: Response) => {
    const { query } = req
    const pageSize = parseInt(<string>query.pageSize) || PAGE_SIZE
    const page = parseInt(<string>query.page) || 1
    const category = <string>query.category || ''
    const price = <string>query.price || ''
    const rating = <string>query.rating || ''
    const order = <string>query.order || ''
    const searchQuery = <string>query.query || ''

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? { name: { $regex: searchQuery, $options: 'i' } }
        : {}
    const categoryFilter = category && category !== 'all' ? { category } : {}
    const ratingFilter =
      rating && rating !== 'all' ? { rating: { $gte: Number(rating) } } : {}
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {}
    const sortOrder: any =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 }

    const [products, countProducts] = await Promise.all([
      ProductModel.find({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      })
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize),
      ProductModel.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      }),
    ])
    const pages = Math.ceil(countProducts / pageSize)
    res.json({ products, countProducts, page, pages })
  })
)

productRouter.get(
  '/slug/:slug',
  asyncHandler(async (req, res) => {
    const product = await ProductModel.findOne({ slug: req.params.slug })
    !product
      ? res.status(404).json({ message: 'Product Not Found' })
      : res.json(product)
  })
)

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { query } = req
    const pageSize = parseInt(<string>query.pageSize) || PAGE_SIZE
    const page = parseInt(<string>query.page) || 1

    const [products, countProducts] = await Promise.all([
      ProductModel.find()
        .sort({ _id: -1 })
        .skip(pageSize * (page - 1))
        .limit(pageSize),
      ProductModel.countDocuments(),
    ])
    const pages = Math.ceil(countProducts / pageSize)
    res.json({ products, countProducts, page, pages })
  })
)

productRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id)
    !product
      ? res.status(404).json({ message: 'Product Not Found' })
      : res.json(product)
  })
)

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const newProduct = new ProductModel({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: 'images/sample.jpg',
      images: 'images/sample.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    })
    const product = await newProduct.save()
    res.json(product)
  })
)

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findById(req.params.id)
    if (product) {
      product.name = req.body.name
      product.slug = req.body.slug
      product.price = req.body.price
      product.image = req.body.image
      product.category = req.body.category
      product.brand = req.body.brand
      product.countInStock = req.body.countInStock
      product.description = req.body.description
      product.images = req.body.images
      await product.save()
      res.json({ message: 'Product Updated', product })
    } else {
      res.status(404).json({ message: 'Product Not Found' })
    }
  })
)

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    const idProduct = req.params.id
    const product = await ProductModel.findById(idProduct)
    if (product) {
      await Promise.allSettled([
        product.images
          .split(',')
          .filter((x) => x !== 'images/sample.jpg')
          .map(async (filename: any) => {
            const idImage = filename.split('/')[1].split('.')[0]
            await cloudinary.uploader.destroy(idImage)
          }),
        ProductModel.findByIdAndDelete(idProduct),
      ])
      res.json({ message: 'Product Deleted' })
    } else {
      res.status(404).json({ message: 'Product Not Found' })
    }
  })
)
