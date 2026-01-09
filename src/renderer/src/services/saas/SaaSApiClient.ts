/**
 * SaaS API Client for Cherry Studio
 */
import { loggerService } from '@logger'
import ky from 'ky'

const logger = loggerService.withContext('SaaSApiClient')

export interface User {
  id: string
  email: string
  username: string
  displayName?: string
  avatar?: string
  createdAt: string
  lastLoginAt?: string
}

export interface LoginResponse {
  success: boolean
  data: {
    user: User
    token: string
  }
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  displayName?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export class SaaSApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = 'http://localhost:3000') {
    this.baseURL = baseURL.replace(/\/$/, '')
    // Load token from localStorage
    this.token = localStorage.getItem('saas_token') || null
  }

  setToken(token: string | null): void {
    this.token = token
    if (token) {
      localStorage.setItem('saas_token', token)
    } else {
      localStorage.removeItem('saas_token')
    }
  }

  getToken(): string | null {
    return this.token
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }
    return headers
  }

  // Auth APIs
  async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await ky
        .post(`${this.baseURL}/v1/auth/register`, {
          json: data,
          headers: this.getHeaders()
        })
        .json<LoginResponse>()

      if (response.success && response.data.token) {
        this.setToken(response.data.token)
      }

      return response
    } catch (error: any) {
      logger.error('Registration failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await ky
        .post(`${this.baseURL}/v1/auth/login`, {
          json: data,
          headers: this.getHeaders()
        })
        .json<LoginResponse>()

      if (response.success && response.data.token) {
        this.setToken(response.data.token)
      }

      return response
    } catch (error: any) {
      logger.error('Login failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await ky
        .get(`${this.baseURL}/v1/auth/me`, {
          headers: this.getHeaders()
        })
        .json<{ success: boolean; data: { user: User } }>()

      return response.data.user
    } catch (error: any) {
      logger.error('Get user failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  // Sync APIs
  async getTopics(): Promise<any[]> {
    try {
      const response = await ky
        .get(`${this.baseURL}/v1/sync/topics`, {
          headers: this.getHeaders()
        })
        .json<{ success: boolean; data: any[] }>()

      return response.data
    } catch (error: any) {
      logger.error('Get topics failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  async syncTopics(topics: any[]): Promise<void> {
    try {
      await ky.post(`${this.baseURL}/v1/sync/topics`, {
        json: { topics },
        headers: this.getHeaders()
      })
    } catch (error: any) {
      logger.error('Sync topics failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  async getSettings(): Promise<Record<string, any>> {
    try {
      const response = await ky
        .get(`${this.baseURL}/v1/sync/settings`, {
          headers: this.getHeaders()
        })
        .json<{ success: boolean; data: Record<string, any> }>()

      return response.data
    } catch (error: any) {
      logger.error('Get settings failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  async syncSettings(settings: Record<string, any>): Promise<void> {
    try {
      await ky.post(`${this.baseURL}/v1/sync/settings`, {
        json: { settings },
        headers: this.getHeaders()
      })
    } catch (error: any) {
      logger.error('Sync settings failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  async getAssistants(): Promise<Record<string, any>> {
    try {
      const response = await ky
        .get(`${this.baseURL}/v1/sync/assistants`, {
          headers: this.getHeaders()
        })
        .json<{ success: boolean; data: Record<string, any> }>()

      return response.data
    } catch (error: any) {
      logger.error('Get assistants failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  async syncAssistants(assistants: Record<string, any>): Promise<void> {
    try {
      await ky.post(`${this.baseURL}/v1/sync/assistants`, {
        json: { assistants },
        headers: this.getHeaders()
      })
    } catch (error: any) {
      logger.error('Sync assistants failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  async getKnowledge(): Promise<{ knowledgeBases: Record<string, any>; knowledgeNotes: any[] }> {
    try {
      const response = await ky
        .get(`${this.baseURL}/v1/sync/knowledge`, {
          headers: this.getHeaders()
        })
        .json<{
          success: boolean
          data: { knowledgeBases: Record<string, any>; knowledgeNotes: any[] }
        }>()

      return response.data
    } catch (error: any) {
      logger.error('Get knowledge failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  async syncKnowledge(
    knowledgeBases: Record<string, any>,
    knowledgeNotes: any[]
  ): Promise<void> {
    try {
      await ky.post(`${this.baseURL}/v1/sync/knowledge`, {
        json: { knowledgeBases, knowledgeNotes },
        headers: this.getHeaders()
      })
    } catch (error: any) {
      logger.error('Sync knowledge failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  async getFiles(): Promise<any[]> {
    try {
      const response = await ky
        .get(`${this.baseURL}/v1/sync/files`, {
          headers: this.getHeaders()
        })
        .json<{ success: boolean; data: any[] }>()

      return response.data
    } catch (error: any) {
      logger.error('Get files failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  async syncFiles(files: any[]): Promise<void> {
    try {
      await ky.post(`${this.baseURL}/v1/sync/files`, {
        json: { files },
        headers: this.getHeaders()
      })
    } catch (error: any) {
      logger.error('Sync files failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  async syncAll(data: {
    topics?: any[]
    settings?: Record<string, any>
    assistants?: Record<string, any>
    knowledgeBases?: Record<string, any>
    knowledgeNotes?: any[]
    files?: any[]
  }): Promise<void> {
    try {
      await ky.post(`${this.baseURL}/v1/sync/all`, {
        json: data,
        headers: this.getHeaders()
      })
    } catch (error: any) {
      logger.error('Sync all failed', { error: error.message })
      throw this.handleError(error)
    }
  }

  logout(): void {
    this.setToken(null)
  }

  private handleError(error: any): Error {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data || {}
      const message = data.error?.message || data.message || error.message || 'Unknown error'
      return new Error(`[${status}] ${message}`)
    }
    return error instanceof Error ? error : new Error(String(error))
  }
}

// Singleton instance
let apiClientInstance: SaaSApiClient | null = null

export function getSaaSApiClient(baseURL?: string): SaaSApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new SaaSApiClient(baseURL)
  }
  return apiClientInstance
}
