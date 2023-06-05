import { toast } from 'react-toastify'
import { Product } from '../../types/Product'
import { CartItem } from '../../types/Cart'
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
  toast.success('Product added to the cart')
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
