import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { RootState } from '../store'
import { logout, setAccessRefreshToken, setAccessToken } from '../auth/authSlice'
import type { RefreshTokenResponse } from '../interfaces/token/response-refreshToken.interface'
import type { HttpError } from '../interfaces/error/http-error.interface'

const API_URL = import.meta.env.VITE_API_URL

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

  /**
   * 🔄 Refresh Token
   */
  const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshToken) return null

    const response = await fetch(`${API_URL}/auth/refresh`, {
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

    const data = (await response.json()) as RefreshTokenResponse

    // Atualiza accessToken e refreshToken no Redux + localStorage
    dispatch(setAccessToken(data.token))
    if (data.refreshToken) {
      dispatch(setAccessRefreshToken(data.refreshToken))
    }

    return data.token
  }

  /**
   * 🌐 Request principal
   */
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
        // Sempre usa o accessToken no header Authorization
        finalHeaders.Authorization = `Bearer ${accessToken}`
      }

      const response = await fetch(`${API_URL}${url}`, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined
      })

      /**
       * 🔐 Tratamento de 401 + refresh automático
       */
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

        throw {
          status: 401,
          message: 'Sessão expirada'
        } as HttpError
      }

      /**
       * ❌ Tratamento correto de erro retornando JSON do backend
       */
      console.log('Response status:', response)
      if (!response.ok) {
        let errorData: any = null

        try {
          errorData = await response.json()
        } catch {
          // pode não ter body
        }

        const apiError: HttpError = {
          status: response.status,
          ...(errorData || {
            message: `Erro ${response.status}`
          })
        }

        throw apiError
      }

      if (response.status === 204) {
        // Nenhum conteúdo: retorna null para permitir checagem simples (!data)
        return null as T
      }

      return (await response.json()) as T
    } catch (err: any) {
      const message =
        err?.message || 'Ocorreu um erro inesperado.'

      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    request,
    isLoading,
    error
  }
}