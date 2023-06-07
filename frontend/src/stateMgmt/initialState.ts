import { AppState } from '../types/App'

const windowMatchMedia =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

const itemValue = (item: string) =>
  localStorage.getItem(item)
    ? item === 'mode' || item === 'paymentMethod'
      ? localStorage.getItem(item)!
      : JSON.parse(localStorage.getItem(item)!)
    : item === 'cartItems'
    ? []
    : item === 'shippingAddress'
    ? {}
    : item === 'paymentMethod'
    ? 'PayPal'
		: item === 'userInfo'
		? null
    : windowMatchMedia
    ? 'dark'
    : 'light'

const initialState: AppState = {
	userInfo: itemValue('userInfo'),
  mode: itemValue('mode'),
  cart: {
    cartItems: itemValue('cartItems'),
    shippingAddress: itemValue('shippingAddress'),
    paymentMethod: itemValue('paymentMethod'),
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  },
}

export default initialState
