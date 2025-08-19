import { create } from 'zustand'
import api from '../services/api'
import { toast } from 'react-hot-toast'

export const useRutasStore = create((set, get) => ({
  rutas: [],
  loading: false,
  error: null,

  fetchRutas: async () => {
    try {
      set({ loading: true, error: null })
      const response = await api.get('/rutas')
      set({ 
        rutas: response.data || [],
        loading: false 
      })
    } catch (error) {
      console.error('Error fetching rutas:', error)
      set({ 
        error: error.message, 
        loading: false,
        rutas: []
      })
    }
  },

  addRuta: async (rutaData) => {
    try {
      set({ loading: true, error: null })
      const response = await api.post('/rutas', rutaData)
      const newRuta = response.data

      set(state => ({ 
        rutas: [...state.rutas, newRuta],
        loading: false
      }))

      toast.success('Ruta agregada exitosamente')
      return newRuta
    } catch (error) {
      console.error('Error adding ruta:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al agregar ruta')
      throw error
    }
  },

  updateRuta: async (id, rutaData) => {
    try {
      set({ loading: true, error: null })
      const response = await api.put(`/rutas/${id}`, rutaData)
      const updatedRuta = response.data

      set(state => ({
        rutas: state.rutas.map(ruta => 
          ruta.id === id ? updatedRuta : ruta
        ),
        loading: false
      }))

      toast.success('Ruta actualizada exitosamente')
      return updatedRuta
    } catch (error) {
      console.error('Error updating ruta:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al actualizar ruta')
      throw error
    }
  },

  deleteRuta: async (id) => {
    try {
      set({ loading: true, error: null })
      await api.delete(`/rutas/${id}`)

      set(state => ({
        rutas: state.rutas.filter(ruta => ruta.id !== id),
        loading: false
      }))

      toast.success('Ruta eliminada exitosamente')
    } catch (error) {
      console.error('Error deleting ruta:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al eliminar ruta')
      throw error
    }
  },

  updateRutaStatus: async (id, status) => {
    try {
      set({ loading: true, error: null })
      const response = await api.patch(`/rutas/${id}/status`, { estado: status })
      const updatedRuta = response.data

      set(state => ({
        rutas: state.rutas.map(ruta => 
          ruta.id === id ? updatedRuta : ruta
        ),
        loading: false
      }))

      toast.success(`Estado de la ruta actualizado a: ${status}`)
      return updatedRuta
    } catch (error) {
      console.error('Error updating ruta status:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al actualizar estado de la ruta')
      throw error
    }
  },

  getRutasByStatus: (status) => {
    const { rutas } = get()
    return rutas.filter(ruta => ruta.estado === status)
  },

  getRutasActivas: () => {
    const { rutas } = get()
    return rutas.filter(ruta => 
      ruta.estado === 'activa' || ruta.estado === 'en_progreso'
    )
  },

  calculateRutaDistance: (puntos) => {
    // Función simple para calcular distancia aproximada
    // En una implementación real usarías APIs de mapas
    if (!puntos || puntos.length < 2) return 0

    let totalDistance = 0
    for (let i = 0; i < puntos.length - 1; i++) {
      const p1 = puntos[i]
      const p2 = puntos[i + 1]

      const R = 6371 // Radio de la Tierra en km
      const dLat = (p2.lat - p1.lat) * Math.PI / 180
      const dLon = (p2.lng - p1.lng) * Math.PI / 180
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      const d = R * c

      totalDistance += d
    }

    return Math.round(totalDistance * 100) / 100
  }
}))
