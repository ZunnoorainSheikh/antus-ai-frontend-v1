import { ProcessImageResponse, ApiError } from '@/types'
import { API_ENDPOINTS } from '@/utils/constants'

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      )
    }
    return response.json()
  }

  async processImage(file: File, phase: string): Promise<ProcessImageResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('phase', phase)

    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.PROCESS_IMAGE}`, {
      method: 'POST',
      body: formData,
    })

    return this.handleResponse<ProcessImageResponse>(response)
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.HEALTH_CHECK}`)
    return this.handleResponse(response)
  }

  async uploadImage(file: File): Promise<{ url: string; id: string }> {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.UPLOAD}`, {
      method: 'POST',
      body: formData,
    })

    return this.handleResponse(response)
  }
}

// Create a singleton instance
let apiService: ApiService | null = null

export const getApiService = (baseUrl?: string): ApiService => {
  if (!apiService || (baseUrl && apiService['baseUrl'] !== baseUrl)) {
    apiService = new ApiService(baseUrl || 'http://localhost:8000')
  }
  return apiService
}

export default ApiService