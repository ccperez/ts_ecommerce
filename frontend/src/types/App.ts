import { Cart, CartItem } from './Cart'
import { UserInfo } from './UserInfo'

export type AppState = {
  mode: string
  cart: Cart
  userInfo?: UserInfo
}

export type Action =
  | { type: 'SWITCH_MODE' }
  | { type: 'CART_ADD_ITEM'; payload: CartItem }
  | { type: 'CART_REMOVE_ITEM'; payload: CartItem }
  | { type: 'USER_SIGNIN'; payload: UserInfo }
  | { type: 'USER_SIGNOUT' }
