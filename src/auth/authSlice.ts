import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Usuario } from '../interfaces/user/response-user.interface'

interface AuthState {
  user: Usuario | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

const storedAccessToken = localStorage.getItem('accessToken')
const storedRefreshToken = localStorage.getItem('refreshToken')
const storedUser = localStorage.getItem('user')

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedAccessToken,
  refreshToken: storedRefreshToken,
  isAuthenticated: !!storedAccessToken,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        user: any
        accessToken: string
        refreshToken: string
      }>
    ) {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true

      localStorage.setItem('accessToken', action.payload.accessToken)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },

    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
      localStorage.setItem('accessToken', action.payload)
    },

    logout(state) {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false

      localStorage.clear()
    },
  },
})

export const { login, logout, setAccessToken } = authSlice.actions
export default authSlice.reducer
