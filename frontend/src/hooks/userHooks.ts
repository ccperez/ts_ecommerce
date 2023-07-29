import { useMutation, useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { UserInfo } from '../types/UserInfo'
import { User } from '../types/User'

interface signInProps {
  email: string
  password: string
}

interface signUpProps {
  name: string
  email: string
  password: string
}

export const useSignInMutation = () =>
  useMutation({
    mutationFn: async ({ email, password }: signInProps) =>
      (await apiClient.post<UserInfo>(`api/users/signin`, { email, password }))
        .data,
  })

export const useSignUpMutation = () =>
  useMutation({
    mutationFn: async ({ name, email, password }: signUpProps) =>
      (
        await apiClient.post<UserInfo>(`api/users/signup`, {
          name,
          email,
          password,
        })
      ).data,
  })

export const useUpdateProfileMutation = () =>
  useMutation({
    mutationFn: async ({ name, email, password }: signUpProps) =>
      (
        await apiClient.put<UserInfo>(`api/users/profile`, {
          name,
          email,
          password,
        })
      ).data,
  })

export const userPasswordMutation = () =>
  useMutation({
    mutationFn: async (sendData: { data: string }) =>
      (
        await apiClient.post<{ data: string }>(
          `api/users/password/reset`,
          sendData
        )
      ).data,
  })

export const useGetUsersQuery = () =>
  useQuery({
    queryKey: ['users-List'],
    queryFn: async () => (await apiClient.get<User[]>(`api/users/`)).data,
  })

export const useGetUserQuery = (id: string) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: async () => (await apiClient.get<User>(`api/users/${id}`)).data,
  })

export const useDeleteUserMutation = () =>
  useMutation({
    mutationFn: async (id: string) =>
      (await apiClient.delete<{ message: string }>(`/api/users/${id}`)).data,
  })

export const useUpdateUserMutation = () =>
  useMutation({
    mutationFn: async ({ id, isAdmin }: { id: string; isAdmin: boolean }) =>
      (await apiClient.put<{ message: string }>(`/api/users/${id}`, { isAdmin })).data,
  })
