import { toast } from 'react-toastify'
import { CartItem, Cart } from '../types/Cart'
import { AppState } from '../types/App'


const rnd2d = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100 // 123.2345 => 123.23

export default {
  cart: {
    items: {
      add: (state: AppState, newItem: CartItem) => {
        const existItem = state.cart.cartItems.find(
          (item) => item._id === newItem._id
        )
        const cartItems = existItem
          ? state.cart.cartItems.map((item: CartItem) =>
              item._id === existItem._id ? newItem : item
            )
          : [...state.cart.cartItems, newItem]

        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        return { ...state, cart: { ...state.cart, cartItems } }
      },
      remove: (state: AppState, crtItm: CartItem) => {
        const cartItems = state.cart.cartItems.filter(
          (item: CartItem) => item._id !== crtItm._id
        )

        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        return { ...state, cart: { ...state.cart, cartItems } }
      },
    },
    existItem: (cartItems: CartItem[], id: string) =>
      cartItems.find((item) => item._id === id),
    checkStock: (countInStock: number, quantity: number) =>
      countInStock < quantity
        ? toast.warn('Quantity added more than the current stock')
        : false,
    itemQtyEQStock: (cartItems: CartItem[], id: string, stock:number) =>
      cartItems.find((itm) => itm._id === id)?.quantity! >= stock,
    totalItems: (items: Array<CartItem>) =>
      items.reduce((a: number, c: CartItem) => a + c.quantity, 0),
    itemsPrice: (items: Array<CartItem>) =>
      rnd2d(items.reduce((a: number, c: CartItem) => a + c.price * c.quantity, 0)),
    shippingPrice: (itemsPrice: number) => itemsPrice > 100 ? rnd2d(0) : rnd2d(10),
    taxPrice: (itemsPrice: number) => rnd2d(0.15 * itemsPrice),
    totalPrice: (cart: Cart) => cart.itemsPrice + cart.shippingPrice + cart.taxPrice,
  },
}
