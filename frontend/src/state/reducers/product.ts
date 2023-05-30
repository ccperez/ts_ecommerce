import { State, Action } from '../types/Product'

export const reducerProducts = (state: State, action: Action) => {
  switch (action.type) {
    case 'PRODUCTS_REQUEST':
      return { ...state, loading: true }
    case 'PRODUCTS_SUCCESS':
      return { ...state, loading: false, products: action.payload }
    case 'PRODUCTS_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}
