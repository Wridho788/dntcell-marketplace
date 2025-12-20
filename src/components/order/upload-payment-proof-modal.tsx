'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Upload, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

interface UploadPaymentProofModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (imageUrl: string) => Promise<void>
  isLoading?: boolean
}

export function UploadPaymentProofModal({ 
  isOpen, 
  onClose, 
  onUpload,
  isLoading = false
}: UploadPaymentProofModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  if (!isOpen) return null

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB')
        return
      }

      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !previewUrl) return

    try {
      setUploading(true)
      // In real implementation, upload to cloud storage (Supabase Storage, Cloudinary, etc.)
      // For now, we'll use the preview URL (temporary)
      await onUpload(previewUrl)
      
      // Close modal on success
      onClose()
      
      // Reset state
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null)
      setPreviewUrl(null)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-900">
            Upload Bukti Transfer
          </h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-info-50 border border-info-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-info-900 mb-2">
            Panduan Upload
          </h3>
          <ul className="text-xs text-info-800 space-y-1 list-disc list-inside">
            <li>Pastikan foto bukti transfer jelas dan mudah dibaca</li>
            <li>Foto harus menampilkan nominal transfer yang sesuai</li>
            <li>Format: JPG, PNG (maksimal 5MB)</li>
            <li>Admin akan memverifikasi dalam 1x24 jam</li>
          </ul>
        </div>

        {/* File Input or Preview */}
        {!previewUrl ? (
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 hover:border-primary-500 hover:bg-primary-50 transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary-600" />
                </div>
                <p className="font-medium text-neutral-900 mb-1">
                  Pilih Foto Bukti Transfer
                </p>
                <p className="text-sm text-neutral-600">
                  JPG, PNG hingga 5MB
                </p>
              </div>
            </div>
          </label>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden border border-neutral-200">
              <Image
                src={previewUrl}
                alt="Preview bukti transfer"
                fill
                className="object-contain bg-neutral-100"
              />
            </div>

            {/* File info */}
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-600" />
                <span className="text-sm font-medium text-neutral-900">
                  {selectedFile?.name}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewUrl(null)
                }}
                disabled={uploading}
                className="text-xs text-error-600 hover:text-error-700 font-medium disabled:opacity-50"
              >
                Ganti
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={uploading}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? 'Mengupload...' : 'Upload'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
