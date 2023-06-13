import { UserInfo } from '../../types/UserInfo'
import { Action } from '../../types/App'

export const login = (dispatch: React.Dispatch<Action>, data: UserInfo) => {
  dispatch({ type: 'USER_SIGNIN', payload: data })
  localStorage.setItem('userInfo', JSON.stringify(data))
}

export const logout = (dispatch: React.Dispatch<Action>) => {
  dispatch({ type: 'USER_SIGNOUT' })

  localStorage.removeItem('userInfo')
  localStorage.removeItem('cartItems')
  localStorage.removeItem('shippingAddress')
  localStorage.removeItem('paymentMethod')

  localStorage.removeItem('signIn')
  localStorage.removeItem('signUp')

  window.location.href = '/signin'
}
