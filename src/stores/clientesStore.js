import { create } from 'zustand'
import api from '../services/api'
import { toast } from 'react-hot-toast'

export const useClientesStore = create((set, get) => ({
  clientes: [],
  loading: false,
  error: null,

  fetchClientes: async () => {
    try {
      set({ loading: true, error: null })
      const response = await api.get('/clientes')
      set({ 
        clientes: response.data || [],
        loading: false 
      })
    } catch (error) {
      console.error('Error fetching clientes:', error)
      set({ 
        error: error.message, 
        loading: false,
        clientes: []
      })
    }
  },

  addCliente: async (clienteData) => {
    try {
      set({ loading: true, error: null })
      const response = await api.post('/clientes', clienteData)
      const newCliente = response.data

      set(state => ({ 
        clientes: [...state.clientes, newCliente],
        loading: false
      }))

      toast.success('Cliente agregado exitosamente')
      return newCliente
    } catch (error) {
      console.error('Error adding cliente:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al agregar cliente')
      throw error
    }
  },

  updateCliente: async (id, clienteData) => {
    try {
      set({ loading: true, error: null })
      const response = await api.put(`/clientes/${id}`, clienteData)
      const updatedCliente = response.data

      set(state => ({
        clientes: state.clientes.map(cliente => 
          cliente.id === id ? updatedCliente : cliente
        ),
        loading: false
      }))

      toast.success('Cliente actualizado exitosamente')
      return updatedCliente
    } catch (error) {
      console.error('Error updating cliente:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al actualizar cliente')
      throw error
    }
  },

  deleteCliente: async (id) => {
    try {
      set({ loading: true, error: null })
      await api.delete(`/clientes/${id}`)

      set(state => ({
        clientes: state.clientes.filter(cliente => cliente.id !== id),
        loading: false
      }))

      toast.success('Cliente eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting cliente:', error)
      set({ error: error.message, loading: false })
      toast.error('Error al eliminar cliente')
      throw error
    }
  },

  searchClientes: (query) => {
    const { clientes } = get()
    if (!query) return clientes

    return clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(query.toLowerCase()) ||
      cliente.email.toLowerCase().includes(query.toLowerCase()) ||
      cliente.telefono.includes(query)
    )
  }
}))
