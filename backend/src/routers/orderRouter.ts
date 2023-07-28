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
    const orders = req.user.isAdmin
      ? await OrderModel.find().populate('user', 'name')
      : await OrderModel.find({ user: req.user._id })

    res.json(orders)
  })
)

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const [users, orders, dailyOrders, productCategories] = await Promise.all([
      UserModel.aggregate([
        {
          $group: {
            _id: { $toString: '' },
            numUsers: { $sum: 1 },
          },
        },
      ]),
      OrderModel.aggregate([
        {
          $group: {
            _id: { $toString: '' },
            numOrders: { $sum: 1 },
            totalSales: { $sum: '$totalPrice' },
          },
        },
      ]),
      OrderModel.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            orders: { $sum: 1 },
            sales: { $sum: '$totalPrice' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      ProductModel.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ]),
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

orderRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)
    if (order) {
      order.isDelivered = true
      order.deliveredAt = new Date(Date.now())
      await order.save()
      res.send({ message: 'Order Delivered' })
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const idOrder = req.params.id
    const deletedOrder = await OrderModel.findById(idOrder)
    if (deletedOrder) {
      const [stock, deleted, orders] = await Promise.all([
        stockUpdate('Increment', deletedOrder.orderItems),
        OrderModel.findByIdAndDelete(idOrder),
        OrderModel.find().populate('user', 'name'),
      ])
      res.json({ message: 'Order Deleted', orders })
      return
    }
    res.status(404).json({ message: 'Order not found!' })
  })
)
