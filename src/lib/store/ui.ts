import { create } from 'zustand'

interface UIState {
  isModalOpen: boolean
  modalContent: React.ReactNode | null
  toastMessage: string | null
  isSheetOpen: boolean
  sheetContent: React.ReactNode | null
  
  openModal: (content: React.ReactNode) => void
  closeModal: () => void
  showToast: (message: string) => void
  hideToast: () => void
  openSheet: (content: React.ReactNode) => void
  closeSheet: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  modalContent: null,
  toastMessage: null,
  isSheetOpen: false,
  sheetContent: null,
  
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  
  showToast: (message) => set({ toastMessage: message }),
  hideToast: () => set({ toastMessage: null }),
  
  openSheet: (content) => set({ isSheetOpen: true, sheetContent: content }),
  closeSheet: () => set({ isSheetOpen: false, sheetContent: null }),
}))
