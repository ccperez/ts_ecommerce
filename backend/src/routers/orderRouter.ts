import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { OrderModel } from '../models/orderModel'
import { isAuth, stockUpdate } from '../utils'

export const orderRouter = express.Router()

orderRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.orderItems) {
      const createdOrder = await OrderModel.create({
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      })
      stockUpdate('Decrement', req.body.orderItems)
      res.status(201).json({ message: 'Order Created', order: createdOrder })
      return
    }
    res.status(400).json({ message: 'No ordered items or Cart is empty' })
  })
)
