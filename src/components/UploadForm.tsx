'use client'

import { useState, useRef } from 'react'
import axios from 'axios'
import { showSuccess, showError, showInfo } from '../services/alertService'

interface UploadFormProps {
  onImageProcessed: (original: string | null, processed: string | null, phase: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  backendUrl: string
}

const UploadForm = ({ onImageProcessed, isLoading, setIsLoading, backendUrl }: UploadFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedPhase, setSelectedPhase] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file (JPG, PNG)')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      showError('File size too large. Please select an image under 10MB.')
      return
    }

    setSelectedFile(file)
    
    // Create blob URL for immediate display
    const originalUrl = URL.createObjectURL(file)
    
    // Display original image immediately
    onImageProcessed(originalUrl, null, '')
    
    showInfo(`Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      showError('Please select an image file')
      return
    }

    if (!selectedPhase) {
      showError('Please select a processing phase')
      return
    }

    setIsLoading(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('phase', selectedPhase)

      showInfo(`Processing image with ${selectedPhase} phase simulation...`)

      // Make API request
      const response = await axios.post(`${backendUrl}/process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
        timeout: 30000, // 30 second timeout
      })

      // Create blob URLs for display
      const originalUrl = URL.createObjectURL(selectedFile)
      const processedUrl = URL.createObjectURL(response.data)

      // Pass results to parent component
      onImageProcessed(originalUrl, processedUrl, selectedPhase)

      showSuccess(`${selectedPhase.charAt(0).toUpperCase() + selectedPhase.slice(1)} phase processing completed!`)

    } catch (error: any) {
      console.error('Processing error:', error)
      
      if (error.code === 'ECONNABORTED') {
        showError('Request timeout. Please try again with a smaller image.')
      } else if (error.response) {
        // Server responded with error
        const errorMessage = error.response.data?.detail || 'Processing failed'
        showError(`Error: ${errorMessage}`)
      } else if (error.request) {
        // Network error
        showError('Cannot connect to backend server. Please check if it\'s running.')
      } else {
        showError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhaseChange = (phase: string) => {
    setSelectedPhase(phase)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setSelectedPhase('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Upload Medical Image
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical Image File
          </label>
          
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 cursor-pointer ${
              dragActive
                ? 'border-medical bg-medical-light'
                : selectedFile
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
            />
            
            <div className="space-y-2">
              <div className="text-4xl">
                {selectedFile ? '✅' : '📁'}
              </div>
              
              {selectedFile ? (
                <div>
                  <p className="text-sm font-medium text-green-700">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-green-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    Drag and drop your medical image here, or{' '}
                    <label
                      htmlFor="file-upload"
                      className="text-medical cursor-pointer hover:text-medical-dark font-medium"
                    >
                      browse
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports JPG, PNG (max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {selectedFile && (
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Clear selection
            </button>
          )}
        </div>

        {/* Phase Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Processing Phase
          </label>
          
          <div className="grid grid-cols-1 gap-3">
            <div
              className={`radio-option ${
                selectedPhase === 'arterial' ? 'selected' : ''
              }`}
              onClick={() => handlePhaseChange('arterial')}
            >
              <input
                type="radio"
                name="phase"
                value="arterial"
                checked={selectedPhase === 'arterial'}
                onChange={() => handlePhaseChange('arterial')}
                className="text-medical focus:ring-medical"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">🔴</span>
                  <span className="font-medium">Arterial Phase</span>
                </div>
              </div>
            </div>

            <div
              className={`radio-option ${
                selectedPhase === 'venous' ? 'selected' : ''
              }`}
              onClick={() => handlePhaseChange('venous')}
            >
              <input
                type="radio"
                name="phase"
                value="venous"
                checked={selectedPhase === 'venous'}
                onChange={() => handlePhaseChange('venous')}
                className="text-medical focus:ring-medical"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">🔵</span>
                  <span className="font-medium">Venous Phase</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedFile || !selectedPhase || isLoading}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>🧠</span>
              <span>Process Image</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default UploadForm