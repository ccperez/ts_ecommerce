import { AppState } from '../../types/App'
import { CartItem } from '../../types/Cart'
import fn from '../../functions/cart'

export default {
  addItem: (state: AppState, newItem: CartItem) => {
    const existItem = fn.cart.existItem(state.cart.cartItems, newItem._id)
    const cartItems = existItem
      ? state.cart.cartItems.map((item: CartItem) =>
          item._id === existItem._id ? newItem : item
        )
      : [...state.cart.cartItems, newItem]

    localStorage.setItem('cartItems', JSON.stringify(cartItems))

    return { ...state, cart: { ...state.cart, cartItems } }
  },
}
