import { create } from 'zustand'
import api from '../services/api'
import { toast } from 'react-hot-toast'

export const useCamionesStore = create((set, get) => ({
  camiones: [],
  loading: false,
  error: null,

  fetchCamiones: async () => {
    try {
      set({ loading: true, error: null })
      const response = await api.get('/camiones')
      set({ 
        camiones: response.data || [],
        loading: false 
      })
    } catch (error) {
      console.error('Error fetching camiones:', error)
      set({ 
        error: error.message, 
        loading: false,
        camiones: []
      })
    }
  },

  addCamion: async (camionData) => {
    try {
      set({ loading: true, error: null })
      const response = await api.post('/camiones', camionData)
      const newCamion = response.data

      set(state => ({ 
        camiones: [...state.camiones, newCamion],
        loading: false
      }))

      toast.success('Camión agregado exitosamente')
      return newCamion
    } catch (error) {
      console.error('Error adding camion:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al agregar camión')
      throw error
    }
  },

  updateCamion: async (id, camionData) => {
    try {
      set({ loading: true, error: null })
      const response = await api.put(`/camiones/${id}`, camionData)
      const updatedCamion = response.data

      set(state => ({
        camiones: state.camiones.map(camion => 
          camion.id === id ? updatedCamion : camion
        ),
        loading: false
      }))

      toast.success('Camión actualizado exitosamente')
      return updatedCamion
    } catch (error) {
      console.error('Error updating camion:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al actualizar camión')
      throw error
    }
  },

  deleteCamion: async (id) => {
    try {
      set({ loading: true, error: null })
      await api.delete(`/camiones/${id}`)

      set(state => ({
        camiones: state.camiones.filter(camion => camion.id !== id),
        loading: false
      }))

      toast.success('Camión eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting camion:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al eliminar camión')
      throw error
    }
  },

  updateCamionStatus: async (id, status) => {
    try {
      set({ loading: true, error: null })
      const response = await api.patch(`/camiones/${id}/status`, { estado: status })
      const updatedCamion = response.data

      set(state => ({
        camiones: state.camiones.map(camion => 
          camion.id === id ? updatedCamion : camion
        ),
        loading: false
      }))

      toast.success(`Estado del camión actualizado a: ${status}`)
      return updatedCamion
    } catch (error) {
      console.error('Error updating camion status:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al actualizar estado del camión')
      throw error
    }
  },

  getCamionesByStatus: (status) => {
    const { camiones } = get()
    return camiones.filter(camion => camion.estado === status)
  },

  getCamionesDisponibles: () => {
    const { camiones } = get()
    return camiones.filter(camion => 
      camion.estado === 'activo' || camion.estado === 'disponible'
    )
  }
}))
