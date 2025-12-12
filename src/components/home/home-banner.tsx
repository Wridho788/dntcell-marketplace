'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Banner {
  id: string
  image: string
  title: string
  subtitle?: string
  link?: string
}

interface HomeBannerProps {
  banners: Banner[]
}

export function HomeBanner({ banners }: HomeBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length)
    }, 5000) // Auto-slide every 5 seconds

    return () => clearInterval(timer)
  }, [banners.length])

  if (!banners.length) return null

  return (
    <div className="relative w-full aspect-video max-h-48 bg-neutral-100 rounded-2xl overflow-hidden">
      {/* Banner Images */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          
          {/* Overlay Text */}
          {(banner.title || banner.subtitle) && (
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
              {banner.title && (
                <h2 className="text-white text-lg font-bold mb-1">
                  {banner.title}
                </h2>
              )}
              {banner.subtitle && (
                <p className="text-white/90 text-sm">
                  {banner.subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex 
                  ? 'w-6 bg-white' 
                  : 'w-1.5 bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
