import { create } from 'zustand'
import api from '../services/api'
import { toast } from 'react-hot-toast'

export const useRepartosStore = create((set, get) => ({
  repartos: [],
  loading: false,
  error: null,

  fetchRepartos: async () => {
    try {
      set({ loading: true, error: null })
      const response = await api.get('/repartos')
      set({ 
        repartos: response.data || [],
        loading: false 
      })
    } catch (error) {
      console.error('Error fetching repartos:', error)
      set({ 
        error: error.message, 
        loading: false,
        repartos: []
      })
    }
  },

  addReparto: async (repartoData) => {
    try {
      set({ loading: true, error: null })
      const response = await api.post('/repartos', repartoData)
      const newReparto = response.data

      set(state => ({ 
        repartos: [...state.repartos, newReparto],
        loading: false
      }))

      toast.success('Reparto agregado exitosamente')
      return newReparto
    } catch (error) {
      console.error('Error adding reparto:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al agregar reparto')
      throw error
    }
  },

  updateReparto: async (id, repartoData) => {
    try {
      set({ loading: true, error: null })
      const response = await api.put(`/repartos/${id}`, repartoData)
      const updatedReparto = response.data

      set(state => ({
        repartos: state.repartos.map(reparto => 
          reparto.id === id ? updatedReparto : reparto
        ),
        loading: false
      }))

      toast.success('Reparto actualizado exitosamente')
      return updatedReparto
    } catch (error) {
      console.error('Error updating reparto:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al actualizar reparto')
      throw error
    }
  },

  deleteReparto: async (id) => {
    try {
      set({ loading: true, error: null })
      await api.delete(`/repartos/${id}`)

      set(state => ({
        repartos: state.repartos.filter(reparto => reparto.id !== id),
        loading: false
      }))

      toast.success('Reparto eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting reparto:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al eliminar reparto')
      throw error
    }
  },

  updateRepartoStatus: async (id, status) => {
    try {
      set({ loading: true, error: null })
      const response = await api.patch(`/repartos/${id}/status`, { estado: status })
      const updatedReparto = response.data

      set(state => ({
        repartos: state.repartos.map(reparto => 
          reparto.id === id ? updatedReparto : reparto
        ),
        loading: false
      }))

      toast.success(`Estado del reparto actualizado a: ${status}`)
      return updatedReparto
    } catch (error) {
      console.error('Error updating reparto status:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al actualizar estado del reparto')
      throw error
    }
  },

  getRepartosByStatus: (status) => {
    const { repartos } = get()
    return repartos.filter(reparto => reparto.estado === status)
  },

  getRepartosHoy: () => {
    const { repartos } = get()
    const today = new Date().toISOString().split('T')[0]
    return repartos.filter(reparto => reparto.fecha === today)
  },

  getRepartosByCamion: (camionId) => {
    const { repartos } = get()
    return repartos.filter(reparto => reparto.camion === camionId)
  },

  getRepartosByCliente: (clienteNombre) => {
    const { repartos } = get()
    return repartos.filter(reparto => 
      reparto.cliente.toLowerCase().includes(clienteNombre.toLowerCase())
    )
  },

  getRepartosEnRango: (fechaInicio, fechaFin) => {
    const { repartos } = get()
    return repartos.filter(reparto => {
      const fechaReparto = new Date(reparto.fecha)
      const inicio = new Date(fechaInicio)
      const fin = new Date(fechaFin)
      return fechaReparto >= inicio && fechaReparto <= fin
    })
  },

  getEstadisticasRepartos: () => {
    const { repartos } = get()

    const total = repartos.length
    const completados = repartos.filter(r => r.estado === 'completado').length
    const pendientes = repartos.filter(r => r.estado === 'pendiente').length
    const enTransito = repartos.filter(r => r.estado === 'en_transito').length
    const cancelados = repartos.filter(r => r.estado === 'cancelado').length

    return {
      total,
      completados,
      pendientes,
      enTransito,
      cancelados,
      porcentajeCompletado: total > 0 ? Math.round((completados / total) * 100) : 0
    }
  }
}))
