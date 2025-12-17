import { create } from 'zustand'

interface ToastConfig {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface LoadingState {
  isLoading: boolean
  message?: string
}

interface UIState {
  // Modal
  isModalOpen: boolean
  modalContent: React.ReactNode | null
  
  // Toast
  toastMessage: string | null
  toastType: 'success' | 'error' | 'info' | 'warning'
  
  // Sheet
  isSheetOpen: boolean
  sheetContent: React.ReactNode | null
  
  // Global loading
  loading: LoadingState
  
  // App ready state
  isAppReady: boolean
  
  // Actions
  openModal: (content: React.ReactNode) => void
  closeModal: () => void
  showToast: (config: ToastConfig | string) => void
  hideToast: () => void
  openSheet: (content: React.ReactNode) => void
  closeSheet: () => void
  setLoading: (loading: boolean, message?: string) => void
  setAppReady: (ready: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isModalOpen: false,
  modalContent: null,
  toastMessage: null,
  toastType: 'info',
  isSheetOpen: false,
  sheetContent: null,
  loading: { isLoading: false },
  isAppReady: false,
  
  // Modal actions
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  
  // Toast actions
  showToast: (config) => {
    if (typeof config === 'string') {
      set({ toastMessage: config, toastType: 'info' })
    } else {
      set({ toastMessage: config.message, toastType: config.type })
    }
  },
  hideToast: () => set({ toastMessage: null }),
  
  // Sheet actions
  openSheet: (content) => set({ isSheetOpen: true, sheetContent: content }),
  closeSheet: () => set({ isSheetOpen: false, sheetContent: null }),
  
  // Loading actions
  setLoading: (isLoading, message) => set({ 
    loading: { isLoading, message } 
  }),
  
  // App ready actions
  setAppReady: (ready) => set({ isAppReady: ready })
}))
