import { useMutation, useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { iOrder, iOrdered, iOrderSummary } from '../types/Order'

export const useGetOrderDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: async () =>
      (await apiClient.get<iOrdered>(`api/orders/${id}`)).data,
  })

export const useGetPaypalClientIdQuery = () =>
  useQuery({
    queryKey: ['paypal-clientId'],
    queryFn: async () =>
      (await apiClient.get<{ clientId: string }>(`api/keys/paypal`)).data,
  })

export const useGetOrderHistoryQuery = () =>
  useQuery({
    queryKey: ['order-history'],
    queryFn: async () =>
      (await apiClient.get<iOrdered[]>(`api/orders/history`)).data,
  })

export const useGetOrderSummaryQuery = () =>
  useQuery({
    queryKey: ['order-summary'],
    queryFn: async () =>
      (await apiClient.get<iOrderSummary>(`api/orders/summary`)).data,
  })

export const usePayOrderMutation = () =>
  useMutation({
    mutationFn: async (details: { orderId: string }) =>
      (
        await apiClient.put<{ message: string; order: iOrdered }>(
          `api/orders/${details.orderId}/pay`,
          details
        )
      ).data,
  })

export const useDeliverOrderMutation = () =>
  useMutation({
    mutationFn: async (idOrder: string) => (
      await apiClient.put<{ message: string }>(
        `api/orders/${idOrder}/deliver`, {}
      )).data
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

export const useDeleteOrderMutation = () =>
  useMutation({
    mutationFn: async (id: string) =>
      (
        await apiClient.delete<{ message: string }>(
          `/api/orders/${id}`
        )
      ).data,
  })
