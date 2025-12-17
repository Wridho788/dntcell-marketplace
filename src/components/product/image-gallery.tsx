'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { getProductImage } from '@/lib/utils/product'

interface ImageGalleryProps {
  images: string[]
  productName: string
  className?: string
}

export function ImageGallery({ images, productName, className = '' }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const validImages = images?.length > 0 ? images : [getProductImage([])]
  const currentImage = validImages[selectedIndex]

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden group">
        <Image
          src={currentImage}
          alt={`${productName} - Gambar ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 500px"
          priority={selectedIndex === 0}
        />

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-lg shadow-md transition-all opacity-0 group-hover:opacity-100"
          aria-label="Zoom gambar"
        >
          <ZoomIn className="w-5 h-5 text-neutral-700" />
        </button>

        {/* Navigation Arrows (if multiple images) */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
              aria-label="Gambar sebelumnya"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
              aria-label="Gambar selanjutnya"
            >
              <ChevronRight className="w-5 h-5 text-neutral-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/70 text-white text-sm rounded-lg">
            {selectedIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? 'border-primary-600 ring-2 ring-primary-200'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            aria-label="Tutup zoom"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
            <Image
              src={currentImage}
              alt={`${productName} - Zoom`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              quality={100}
            />
          </div>

          {/* Navigation in Zoom Mode */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                aria-label="Gambar sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                aria-label="Gambar selanjutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 text-white rounded-lg">
                {selectedIndex + 1} / {validImages.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Simple image carousel for product card previews
 */
interface ImageCarouselProps {
  images: string[]
  productName: string
  className?: string
}

export function ImageCarousel({ images, productName, className = '' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const validImages = images?.length > 0 ? images : [getProductImage([])]

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
  }

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
  }

  if (validImages.length === 1) {
    return (
      <div className={`relative aspect-square bg-neutral-100 ${className}`}>
        <Image
          src={validImages[0]}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 480px) 50vw, 200px"
        />
      </div>
    )
  }

  return (
    <div className={`relative aspect-square bg-neutral-100 group ${className}`}>
      <Image
        src={validImages[currentIndex]}
        alt={`${productName} - Gambar ${currentIndex + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 480px) 50vw, 200px"
      />

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Gambar sebelumnya"
      >
        <ChevronLeft className="w-4 h-4 text-neutral-700" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Gambar selanjutnya"
      >
        <ChevronRight className="w-4 h-4 text-neutral-700" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {validImages.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
