import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Product, iProductImage } from '../types/Product'

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

export const useGetProductDetailsByIDQuery = (id: string) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/${id}`)).data,
  })

export const useCreateProductMutation = () =>
  useMutation({
    mutationFn: async () =>
      (await apiClient.post<Product>(`/api/products`, {})).data,
  })

export const useDeleteProductMutation = () =>
  useMutation({
    mutationFn: async (id: string) =>
      (await apiClient.delete(`/api/products/${id}`)).data,
  })

export const useUpdateProductMutation = () =>
  useMutation({
    mutationFn: async (product: Product) =>
      (await apiClient.put(`/api/products/${product._id}`, product)).data,
  })

export const useUploadProductImageMutation = () =>
  useMutation({
    mutationFn: async (formData: any) =>
      await apiClient.post(`/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
  })

export const useDeleteProductImageMutation = () =>
  useMutation({
    mutationFn: async (image: iProductImage) =>
      (
        await apiClient.put<{ message: string }>(
          `/api/upload/image/${image.id}`,
          image
        )
      ).data,
  })
