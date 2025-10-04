export const PHASES = [
  {
    id: 'arterial',
    name: 'Arterial Phase',
    description: 'Enhanced arterial blood flow visualization',
    color: 'red',
    icon: '🔴'
  },
  {
    id: 'venous',
    name: 'Venous Phase',
    description: 'Enhanced venous blood flow visualization',
    color: 'blue',
    icon: '🔵'
  }
] as const

export const FILE_CONSTRAINTS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
} as const

export const API_ENDPOINTS = {
  PROCESS_IMAGE: '/process',
  HEALTH_CHECK: '/health',
  UPLOAD: '/upload'
} as const

export const UI_CONSTANTS = {
  TOAST_DURATION: {
    SUCCESS: 4000,
    ERROR: 5000,
    WARNING: 4000,
    INFO: 3000
  },
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200
} as const

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your connection.',
  FILE_TOO_LARGE: 'File size is too large. Please select a smaller image.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a valid image file.',
  PROCESSING_FAILED: 'Failed to process image. Please try again.',
  UPLOAD_FAILED: 'Failed to upload image. Please try again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.'
} as const

export const SUCCESS_MESSAGES = {
  IMAGE_UPLOADED: 'Image uploaded successfully!',
  IMAGE_PROCESSED: 'Image processed successfully!',
  IMAGE_DOWNLOADED: 'Image downloaded successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!'
} as const

export const APP_CONFIG = {
  NAME: 'MedTech Phase Simulator',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-powered medical image phase transformation tool',
  AUTHOR: 'Intas AI Team'
} as const