import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (userData) => {
        set({ 
          user: userData, 
          isAuthenticated: true 
        })
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        })
        // Limpiar localStorage
        localStorage.clear()
      },

      checkAuth: () => {
        const state = get()
        return state.isAuthenticated
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
