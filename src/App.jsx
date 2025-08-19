import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './components/Dashboard/Dashboard'
import ClientesList from './components/Clientes/ClientesList'
import CamionesList from './components/Camiones/CamionesList'
import RutasList from './components/Rutas/RutasList'
import RepartosList from './components/Repartos/RepartosList'
import { useAuthStore } from './stores/authStore'

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (!isAuthenticated) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <i className="bi bi-truck text-primary fs-1"></i>
              <h2 className="mt-2">Logística App</h2>
              <p className="text-muted">Sistema de Gestión de Repartos</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const username = formData.get('username')
              const password = formData.get('password')

              if (username === 'admin' && password === 'admin') {
                useAuthStore.getState().login({ username, role: 'admin' })
              } else {
                alert('Credenciales incorrectas')
              }
            }}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="admin"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="admin"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Ingresar
              </button>
            </form>

            <div className="text-center mt-3">
              <small className="text-muted">
                Demo: admin/admin
              </small>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes" element={<ClientesList />} />
        <Route path="/camiones" element={<CamionesList />} />
        <Route path="/rutas" element={<RutasList />} />
        <Route path="/repartos" element={<RepartosList />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
