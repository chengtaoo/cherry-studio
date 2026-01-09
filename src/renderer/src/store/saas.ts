/**
 * SaaS Redux store for user authentication and sync state
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@renderer/services/saas/SaaSApiClient'

export interface SaaSState {
  isEnabled: boolean
  isAuthenticated: boolean
  user: User | null
  token: string | null
  apiBaseURL: string
  isSyncing: boolean
  lastSyncTime: number | null
  syncError: string | null
}

// Load initial state from localStorage
const loadInitialState = (): SaaSState => {
  if (typeof window === 'undefined') {
    return {
      isEnabled: false,
      isAuthenticated: false,
      user: null,
      token: null,
      apiBaseURL: 'http://localhost:3000',
      isSyncing: false,
      lastSyncTime: null,
      syncError: null
    }
  }

  const savedToken = localStorage.getItem('saas_token')
  const savedApiURL = localStorage.getItem('saas_api_url') || 'http://localhost:3000'
  const savedEnabled = localStorage.getItem('saas_enabled') === 'true'

  return {
    isEnabled: savedEnabled,
    isAuthenticated: !!savedToken,
    user: null, // Will be loaded from API if token exists
    token: savedToken,
    apiBaseURL: savedApiURL,
    isSyncing: false,
    lastSyncTime: null,
    syncError: null
  }
}

const initialState: SaaSState = loadInitialState()

const saasSlice = createSlice({
  name: 'saas',
  initialState,
  reducers: {
    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.isEnabled = action.payload
      localStorage.setItem('saas_enabled', String(action.payload))
    },
    setApiBaseURL: (state, action: PayloadAction<string>) => {
      state.apiBaseURL = action.payload
      localStorage.setItem('saas_api_url', action.payload)
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
      if (!action.payload) {
        state.user = null
        state.token = null
      }
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = action.payload !== null
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload
      if (action.payload) {
        localStorage.setItem('saas_token', action.payload)
      } else {
        localStorage.removeItem('saas_token')
      }
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload
      if (action.payload) {
        state.syncError = null
      }
    },
    setLastSyncTime: (state, action: PayloadAction<number | null>) => {
      state.lastSyncTime = action.payload
    },
    setSyncError: (state, action: PayloadAction<string | null>) => {
      state.syncError = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.lastSyncTime = null
      state.syncError = null
      localStorage.removeItem('saas_token')
    }
  }
})

export const {
  setEnabled,
  setApiBaseURL,
  setAuthenticated,
  setUser,
  setToken,
  setSyncing,
  setLastSyncTime,
  setSyncError,
  logout
} = saasSlice.actions

export default saasSlice.reducer
