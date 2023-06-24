import { useMutation, useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { iOrder, iOrdered } from '../types/Order'

export const useGetOrderDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: async () =>
      (await apiClient.get<iOrdered>(`api/orders/${id}`)).data,
  })

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
