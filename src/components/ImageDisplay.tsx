'use client'

import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import Image from 'next/image'

interface ImageDisplayProps {
  originalImage: string | null
  processedImage: string | null
  isLoading: boolean
  selectedPhase: string
}

const ImageDisplay = ({ originalImage, processedImage, isLoading, selectedPhase }: ImageDisplayProps) => {
  const [imageView, setImageView] = useState('side-by-side') // 'side-by-side', 'overlay', 'original', 'processed'

  // Switch to side-by-side view if current view requires processed image but it's not available
  useEffect(() => {
    if (!processedImage && (imageView === 'overlay' || imageView === 'processed')) {
      setImageView('side-by-side')
    }
  }, [processedImage, imageView])

  if (isLoading) {
    return (
      <div className="card p-8">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Processing Image...
          </h3>
          <p className="text-gray-600">
            Applying {selectedPhase} phase simulation
          </p>
        </div>
      </div>
    )
  }

  if (!originalImage) {
    return (
      <div className="card p-8">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">🖼️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Images to Display
          </h3>
          <p className="text-gray-600">
            Upload and process an image to see the results here
          </p>
        </div>
      </div>
    )
  }

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderSideBySide = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Original Image */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">Original Image</h4>
          <button
            onClick={() => handleDownload(originalImage, 'original-image.png')}
            className="text-sm text-medical hover:text-medical-dark p-1"
            title="Download Original"
          >
            <Download size={16} />
          </button>
        </div>
        <div className="image-container">
          <Image
            src={originalImage}
            alt="Original medical image"
            className="w-full h-auto max-h-96 object-contain"
            width={800}
            height={600}
            style={{ maxHeight: '24rem', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Processed Image */}
      {processedImage ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">
              Processed ({selectedPhase.charAt(0).toUpperCase() + selectedPhase.slice(1)})
            </h4>
            <button
              onClick={() => handleDownload(processedImage, `processed-${selectedPhase}.png`)}
              className="text-sm text-medical hover:text-medical-dark p-1"
              title="Download Processed"
            >
              <Download size={16} />
            </button>
          </div>
          <div className="image-container">
            <Image
              src={processedImage}
              alt={`${selectedPhase} phase processed image`}
              className="w-full h-auto max-h-96 object-contain"
              width={800}
              height={600}
              style={{ maxHeight: '24rem', objectFit: 'contain' }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Processed Image</h4>
          <div className="image-container bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">⚙️</div>
              <p className="text-sm">Select a phase and process to see results</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="card p-6 fade-in">
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Processing Results
        </h3>
      </div>

      {/* Image Display */}
      <div className="space-y-4">
        {renderSideBySide()}
      </div>

      {/* Bulk Download */}
      {processedImage && (
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => {
              handleDownload(originalImage!, 'original-image.png')
              setTimeout(() => handleDownload(processedImage, `processed-${selectedPhase}.png`), 500)
            }}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Download Both Images
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageDisplay