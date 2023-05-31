import { ApiError } from '../types/ApiError'

export const getError = (error: ApiError) =>
  error.response && error.response.data.message
    ? error.response.data.message
    : error.message
