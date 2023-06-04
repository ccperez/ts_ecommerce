import { CartItem } from '../types/Cart'

export default {
  cart: {
    existItem: (cartItems: CartItem[], id: string) =>
      cartItems.find((item) => item._id === id),
    checkStock: (countInStock: number, quantity: number) => {
      if (countInStock < quantity) {
        alert('Quantity added is more than the current stock')
        return true
      }
      return false
    },
    totalItems: (items: Array<CartItem>) =>
      items.reduce((a: number, c: CartItem) => a + c.quantity, 0),
  },
}
