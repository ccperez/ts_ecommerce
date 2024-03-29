import { Product } from '../../types/Product'
import { CartItem, ShippingAddress } from '../../types/Cart'
import { Action } from '../../types/App'

import { convertProductToCartItem } from '../../utils'
import fn from '../../functions/cart'

export const addToCart = (
  dispatch: React.Dispatch<Action>,
  cartItems: CartItem[],
  product: Product
) => {
  const newItem = convertProductToCartItem(product)
  const existItem = fn.cart.existItem(cartItems, product._id)
  const quantity = existItem ? existItem.quantity + 1 : newItem.quantity

  if (fn.cart.checkStock(product.countInStock, quantity)) return
  dispatch({ type: 'CART_ADD_ITEM', payload: { ...newItem, quantity } })
}

export const updateCart = (
  dispatch: React.Dispatch<Action>,
  item: CartItem,
  quantity: number
) => {
  if (fn.cart.checkStock(item.countInStock, quantity)) return
  dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
}

export const removeItem = (dispatch: React.Dispatch<Action>, item: CartItem) =>
  dispatch({ type: 'CART_REMOVE_ITEM', payload: item })

export const shipping = (
  dispatch: React.Dispatch<Action>,
  shippingInfo: ShippingAddress
) => {
  dispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: shippingInfo })
  localStorage.setItem('shippingAddress', JSON.stringify(shippingInfo))
}

export const payment = (
  dispatch: React.Dispatch<Action>,
  paymentMethod: string
) => {
  dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod })
  localStorage.setItem('paymentMethod', paymentMethod)
}
