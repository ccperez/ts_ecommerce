import { CartItem, ShippingAddress } from './Cart'
import { User } from './User'

export interface iOrder {
  orderItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
}

export interface iOrdered extends iOrder {
  _id: string
  user: User
  createdAt: string
  isPaid: boolean
  paidAt: string
  isDelivered: boolean
  deliveredAt: string
}

export interface iOrderSummary {
  users: [
    {
      _id: string
      numUsers: number
    }
  ]
  orders: [
    {
      _id: string
      numOrders: number
      totalSales: number
    }
  ]
  dailyOrders: [
    {
      _id: string
      orders: number
      sales: number
    }
  ]
  productCategories: [
    {
      _id: string
      count: number
    }
  ]
}
