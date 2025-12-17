'use client'

import { useState } from 'react'
import { MobileHeader } from '@/components/navigation/mobile-header'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Button } from '@/components/ui/button'
import { MapPin, Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

interface Address {
  id: string
  name: string
  phone: string
  address: string
  city: string
  province?: string
  postal_code?: string
  is_default: boolean
}

export function AddressManagementClient() {
  const [addresses, setAddresses] = useState<Address[]>([])

  const renderEmpty = () => {
    return (
      <div className="py-12">
        <EmptyState
          icon={<MapPin className="w-10 h-10 text-neutral-400" />}
          title="Belum Ada Alamat"
          description="Tambahkan alamat pengiriman untuk memudahkan proses checkout"
          action={{
            label: 'Tambah Alamat',
            onClick: () => {
              // TODO: Open add address modal
              alert('Fitur akan segera aktif')
            }
          }}
        />
      </div>
    )
  }

  return (
    <AuthGuard>
      <MobileHeader title="Alamat Pengiriman" showBack />

      <div className="container-mobile py-6 pb-24">
        {addresses.length === 0 ? (
          renderEmpty()
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white rounded-lg border border-neutral-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-neutral-900">{address.name}</h4>
                      {address.is_default && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Utama
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600">{address.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-neutral-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-neutral-600" />
                    </button>
                    <button className="p-2 hover:bg-error-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-error-600" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-neutral-700 mb-2">{address.address}</p>
                <p className="text-sm text-neutral-600">
                  {address.city}
                  {address.province && `, ${address.province}`}
                  {address.postal_code && ` ${address.postal_code}`}
                </p>

                {!address.is_default && (
                  <button className="mt-3 text-sm text-primary-600 font-medium hover:text-primary-700">
                    Jadikan Alamat Utama
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Add Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 safe-area-bottom z-40">
        <div className="container-mobile">
          <Button
            size="lg"
            className="w-full"
            onClick={() => alert('Fitur akan segera aktif')}
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Alamat Baru
          </Button>
        </div>
      </div>
    </AuthGuard>
  )
}
