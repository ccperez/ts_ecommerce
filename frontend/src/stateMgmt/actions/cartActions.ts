import { Product } from '../../types/Product'
import { CartItem } from '../../types/Cart'

import { convertProductToCartItem } from '../../utils'
import fn from '../../functions/cart'

export const addToCart = (
  dispatch: any,
  cartItems: CartItem[],
  product: Product
) => {
  const newItem = convertProductToCartItem(product)
  const existItem = fn.cart.existItem(cartItems, product._id)
  const quantity = existItem ? existItem.quantity + 1 : newItem.quantity

  if (fn.cart.checkStock(product.countInStock, quantity)) return
  dispatch({ type: 'CART_ADD_ITEM', payload: { ...newItem, quantity } })
}
