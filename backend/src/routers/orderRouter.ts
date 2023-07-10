import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Order, OrderModel } from '../models/orderModel'
import { ProductModel } from '../models/productModel'
import { UserModel } from '../models/userModel'
import { isAuth, isAdmin, stockUpdate } from '../utils'

export const orderRouter = express.Router()

orderRouter.get(
  '/history',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({ user: req.user._id })
    res.json(orders)
  })
)

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.aggregate([
      {
        $group: {
          _id: { $toString: null },
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ])
    const users = await UserModel.aggregate([
      {
        $group: {
          _id: { $toString: null },
          numUsers: { $sum: 1 },
        },
      },
    ])
    const dailyOrders = await OrderModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ])
    const productCategories = await ProductModel.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ])
    res.json({ users, orders, dailyOrders, productCategories })
  })
)

orderRouter.get(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)
    order
      ? res.json(order)
      : res.status(404).json({ message: 'Order Not Found' })
  })
)

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
      } as Order)
      stockUpdate('Decrement', req.body.orderItems)
      res.status(201).json({ message: 'Order Created', order: createdOrder })
      return
    }
    res.status(400).json({ message: 'No ordered items or Cart is empty' })
  })
)

orderRouter.put(
  '/:id/pay',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)

    if (order) {
      const { id, status, update_time, email_address } = req.body

      order.isPaid = true
      order.paidAt = new Date(Date.now())
      order.paymentResult = {
        paymentId: id,
        status,
        update_time,
        email_address,
      }
      const updatedOrder = await order.save()
      res.send({ message: 'Order Paid Successfully', order: updatedOrder })
    } else {
      res.status(404).json({ message: 'Order Not Found' })
    }
  })
)
