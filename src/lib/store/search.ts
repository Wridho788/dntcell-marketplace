import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchState {
  query: string
  history: string[]
  setQuery: (query: string) => void
  addToHistory: (query: string) => void
  clearHistory: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      query: '',
      history: [],
      
      setQuery: (query) => set({ query }),
      
      addToHistory: (query) => set((state) => {
        if (!query.trim() || state.history.includes(query)) return state
        return {
          history: [query, ...state.history].slice(0, 10) // Keep last 10
        }
      }),
      
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'search-storage',
      skipHydration: true,
    }
  )
)
