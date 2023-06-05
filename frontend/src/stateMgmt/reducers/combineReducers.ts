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
    default:
      return state
  }
}
