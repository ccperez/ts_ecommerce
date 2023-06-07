import { useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { UserInfo } from '../types/UserInfo'

interface userProps {
  email: string
  password: string
}

export const useSigninMutation = () =>
  useMutation({
    mutationFn: async ({ email, password }: userProps) =>
      (await apiClient.post<UserInfo>(`api/users/signin`, { email, password }))
        .data,
  })
