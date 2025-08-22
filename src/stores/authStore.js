import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api.js'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      login: async (credentials) => {
        try {
          const response = await api.post('/auth/login', credentials);
          const { user, tokens } = response.data;
          
          set({ 
            user, 
            tokens,
            isAuthenticated: true 
          });

          // Configurar token en axios
          api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
          
          return { success: true };
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          tokens: null,
          isAuthenticated: false 
        });
        
        // Limpiar headers
        delete api.defaults.headers.common['Authorization'];
        localStorage.clear();
      },

      refreshToken: async () => {
        try {
          const { tokens } = get();
          if (!tokens?.refresh) {
            throw new Error('No refresh token available');
          }

          const response = await api.post('/auth/refresh', {
            refreshToken: tokens.refresh
          });

          const newTokens = response.data;
          set({ tokens: newTokens });
          
          // Actualizar header
          api.defaults.headers.common['Authorization'] = `Bearer ${newTokens.access}`;
          
          return newTokens;
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && state.tokens?.access;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)