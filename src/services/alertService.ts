import { toast } from 'sonner'

export interface AlertOptions {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export class AlertService {
  static success(message: string, options?: AlertOptions) {
    return toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action
    })
  }

  static error(message: string, options?: AlertOptions) {
    return toast.error(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action
    })
  }

  static warning(message: string, options?: AlertOptions) {
    return toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action
    })
  }

  static info(message: string, options?: AlertOptions) {
    return toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action
    })
  }

  static loading(message: string, options?: AlertOptions) {
    return toast.loading(message, {
      description: options?.description,
    })
  }

  static dismiss(toastId?: string | number) {
    return toast.dismiss(toastId)
  }

  static promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: unknown) => string)
    }
  ) {
    return toast.promise(promise, messages)
  }

  // Utility methods for common scenarios
  static uploadSuccess(filename?: string) {
    return this.success(
      'Upload successful!',
      {
        description: filename ? `${filename} has been uploaded successfully.` : 'File uploaded successfully.'
      }
    )
  }

  static uploadError(error?: string) {
    return this.error(
      'Upload failed',
      {
        description: error || 'There was an error uploading your file. Please try again.'
      }
    )
  }

  static processingSuccess() {
    return this.success(
      'Processing complete!',
      {
        description: 'Your image has been processed successfully.'
      }
    )
  }

  static processingError(error?: string) {
    return this.error(
      'Processing failed',
      {
        description: error || 'There was an error processing your image. Please try again.'
      }
    )
  }

  static networkError() {
    return this.error(
      'Network error',
      {
        description: 'Unable to connect to the server. Please check your connection and try again.'
      }
    )
  }

  static validationError(field: string) {
    return this.warning(
      'Validation error',
      {
        description: `Please check the ${field} field and try again.`
      }
    )
  }

  static downloadSuccess(filename?: string) {
    return this.success(
      'Download started!',
      {
        description: filename ? `${filename} is being downloaded.` : 'Your file download has started.'
      }
    )
  }

  static downloadError() {
    return this.error(
      'Download failed',
      {
        description: 'There was an error downloading the file. Please try again.'
      }
    )
  }
}

// Export default instance for convenience
export default AlertService

// Convenience functions that match your existing code
export const showSuccess = (message: string, options?: AlertOptions) => AlertService.success(message, options)
export const showError = (message: string, options?: AlertOptions) => AlertService.error(message, options)
export const showInfo = (message: string, options?: AlertOptions) => AlertService.info(message, options)
export const showWarning = (message: string, options?: AlertOptions) => AlertService.warning(message, options)