import { useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { iOrder, iOrdered } from '../types/Order'

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: iOrder) =>
      (
        await apiClient.post<{ message: string; order: iOrdered }>(
          `api/orders`,
          order
        )
      ).data,
  })
