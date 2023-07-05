import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ProductModel } from '../models/productModel'

export const productRouter = express.Router()

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
    const PAGE_SIZE = 2
    const { query } = req
    const pageSize = parseInt(<string>query.pageSize) || PAGE_SIZE
    const page = parseInt(<string>query.page) || 1
    const category = query.category || ''
    const price = <string>query.price || ''
    const rating = query.rating || ''
    const order = query.order || ''
    const searchQuery = query.query || ''

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
    const sortOrder =
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

    const products = await ProductModel.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize)

    const countProducts = await ProductModel.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })

    res.json({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    })
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
