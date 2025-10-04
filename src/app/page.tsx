'use client'

import { useState } from 'react'
import { Toaster } from 'sonner'
import UploadForm from '@/components/UploadForm'
import ImageDisplay from '@/components/ImageDisplay'
import { APP_CONFIG } from '@/utils/constants'

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPhase, setSelectedPhase] = useState('')

  // Backend URL - use environment variable or default
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

  const handleImageProcessed = (original: string | null, processed: string | null, phase: string) => {
    setOriginalImage(original)
    setProcessedImage(processed)
    setSelectedPhase(phase)
  }

  const handleReset = () => {
    setOriginalImage(null)
    setProcessedImage(null)
    setSelectedPhase('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🧠 {APP_CONFIG.NAME}
              </h1>
              {/* <p className="text-gray-600 mt-1">{APP_CONFIG.DESCRIPTION}</p> */}
            </div>
            <div className="text-sm text-gray-500">
              v{APP_CONFIG.VERSION}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <UploadForm
              onImageProcessed={handleImageProcessed}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              backendUrl={BACKEND_URL}
            />
            
            {(originalImage || processedImage) && (
              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Start New Analysis
                </button>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div>
            <ImageDisplay
              originalImage={originalImage}
              processedImage={processedImage}
              isLoading={isLoading}
              selectedPhase={selectedPhase}
            />
          </div>
        </div>
      </main>


      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          },
        }}
      />
    </div>
  )
}
