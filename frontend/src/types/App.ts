import { Cart, CartItem } from './Cart'

export type AppState = {
  mode: string
  cart: Cart
}

export type Action =
  | { type: 'SWITCH_MODE' }
  | { type: 'CART_ADD_ITEM'; payload: CartItem }
  | { type: 'CART_REMOVE_ITEM'; payload: CartItem }
