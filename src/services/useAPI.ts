import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { RootState } from '../store';
import { logout, setAccessToken } from '../auth/authSlice';

const BASE_URL = 'http://localhost:3000'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  headers?: Record<string, string>
  withAuth?: boolean
  retry?: boolean
}

export function useApi() {
  const dispatch = useAppDispatch()
  const { accessToken, refreshToken } = useAppSelector(
    (state: RootState) => state.auth
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshToken) return null

    const response = await fetch(`${BASE_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    })

    if (!response.ok) {
      dispatch(logout())
      return null
    }

    const data = await response.json()

    dispatch(setAccessToken(data.accessToken))

    return data.accessToken
  }

  const request = async <T = unknown>(
    url: string,
    {
      method = 'GET',
      body,
      headers = {},
      withAuth = false,
      retry = true
    }: RequestOptions = {}
  ): Promise<T> => {
    try {
      setIsLoading(true)
      setError(null)

      const finalHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers
      }

      if (withAuth && accessToken) {
        finalHeaders.Authorization = `Bearer ${accessToken}`
      }

      const response = await fetch(`${BASE_URL}${url}`, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined
      })

      if (response.status === 401 && withAuth && retry) {
        const newToken = await refreshAccessToken()

        if (newToken) {
          return request<T>(url, {
            method,
            body,
            headers,
            withAuth,
            retry: false
          })
        }

        throw new Error('Sessão expirada')
      }

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`)
      }

      return await response.json()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { request, isLoading, error }
}
