import { AppState, Action } from '../../types/App'
import fn from '../../functions/cart'

export default (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SWITCH_MODE':
      const mode = state.mode === 'dark' ? 'light' : 'dark'
      localStorage.setItem('mode', mode)
      return { ...state, mode }
    case 'CART_ADD_ITEM':
      return fn.cart.items.add(state, action.payload)
    case 'CART_REMOVE_ITEM':
      return fn.cart.items.remove(state, action.payload)
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } }
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
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      }
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      }
    default:
      return state
  }
}
