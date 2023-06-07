import { AppState, Action } from '../../types/App'
import fn from '../../functions/cart'

export default (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SWITCH_MODE':
      return { ...state, mode: state.mode === 'dark' ? 'light' : 'dark' }
    case 'CART_ADD_ITEM':
      return fn.cart.items.add(state, action.payload)
    case 'CART_REMOVE_ITEM':
      return fn.cart.items.remove(state, action.payload)
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload }
    case 'USER_SIGNOUT':
      return {
        mode:
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light',
        cart: {
          cartItems: [],
          paymentMethod: 'PayPal',
          shippingAddress: {
            fullName: '',
            address: '',
            postalCode: '',
            city: '',
            country: '',
          },
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      }
    default:
      return state
  }
}
