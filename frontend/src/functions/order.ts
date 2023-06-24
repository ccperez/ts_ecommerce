import { CartItem, Cart, ShippingAddress } from '../types/Cart'
import fn from './cart'

const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100 // 123.2345 => 123.23

export default {
  order: {
    itemsPrice: (items: Array<CartItem>) => round2(fn.cart.totalAmount(items)),
    shippingPrice: (itemsPrice: number) =>
      itemsPrice > 100 ? round2(0) : round2(10),
    taxPrice: (itemsPrice: number) => round2(0.15 * itemsPrice),
    totalPrice: (cart: Cart) =>
      cart.itemsPrice + cart.shippingPrice + cart.taxPrice,
  },
}
