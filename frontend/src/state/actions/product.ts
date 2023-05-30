import api from '../../utils/api'
import { getError } from '../../utils/getError'
import { ApiError } from '../types/ApiError'

export const fetchProducts = async (dispatch: any) => {
  const prefix = 'PRODUCTS'

  dispatch({ type: `${prefix}_REQUEST` })
  try {
    const { data } = await api.product.list()
    dispatch({ type: `${prefix}_SUCCESS`, payload: data })
  } catch (err) {
    dispatch({
      type: `${prefix}_FAIL`,
      payload: getError(err as ApiError),
    })
  }
}
