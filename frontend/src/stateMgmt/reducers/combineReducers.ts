import { AppState, Action } from '../../types/App'
import cartReducers from './cartReducers'

export default (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SWITCH_MODE':
      return { ...state, mode: state.mode === 'dark' ? 'light' : 'dark' }
    case 'CART_ADD_ITEM':
      return cartReducers.addItem(state, action.payload)
    default:
      return state
  }
}
