export interface Phase {
  id: string
  name: string
  description: string
}

export interface ProcessImageResponse {
  processed_image: string
  success: boolean
  message?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface ImageFile {
  file: File
  preview: string
  name: string
  size: number
  type: string
}

export interface ProcessingState {
  isLoading: boolean
  progress?: number
  stage?: string
}

export interface AppConfig {
  backendUrl: string
  maxFileSize: number
  supportedFormats: string[]
  apiTimeout: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface HistoryItem {
  id: string
  originalImage: string
  processedImage: string
  phase: string
  timestamp: Date
  user?: User
}