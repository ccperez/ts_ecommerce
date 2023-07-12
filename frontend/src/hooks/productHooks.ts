import { useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Product } from '../types/Product'

export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => (await apiClient.get<Product[]>(`api/products`)).data,
  })

export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () =>
      (await apiClient.get<[]>(`api/products/categories`)).data,
  })

export const useGetSearchProductsQuery = ({
  page,
  query,
  category,
  price,
  rating,
  order,
}: {
  page?: string | number
  query?: string
  category?: string
  price?: string
  rating?: String
  order?: string
}) =>
  useQuery({
    queryKey: ['products', page, query, category, price, rating, order],
    queryFn: async () =>
      (
        await apiClient.get<Product[]>(
          `api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        )
      ).data,
  })

export const useGetAdminProductsQuery = ({ page }: { page: string | number }) =>
  useQuery({
    queryKey: ['products', page],
    queryFn: async () =>
      (await apiClient.get<Product[]>(`api/products/admin?page=${page}`)).data,
  })

export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['products', slug],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/slug/${slug}`)).data,
  })
