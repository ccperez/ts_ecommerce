import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { OrderModel } from '../models/orderModel'
import { Product, ProductModel } from '../models/productModel'
import { isAuth } from '../utils'

export const orderRouter = express.Router()

const productStock = (type: string, orderItems: any) => {
  orderItems.map(async (itm: any) => {
    const product = await ProductModel.findById(itm._id)
    if (product) {
      product.countInStock
      type === 'Decrement'
        ? product.countInStock - itm.quantity
        : product.countInStock + itm.quantity
      await product.save()
    }
  })
}

orderRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orderItems = req.body.orderItems
    if (orderItems) {
      const createdOrder = await OrderModel.create({
        orderItems: orderItems.map((p: Product) => ({ ...p, product: p._id })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      })
      productStock('Decrement', orderItems)
      res.status(201).json({ message: 'Order Created', order: createdOrder })
      return
    }
    res.status(400).json({ message: 'No ordered items or Cart is empty' })
  })
)
