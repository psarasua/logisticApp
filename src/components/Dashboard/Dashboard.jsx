import React, { useEffect } from 'react'
import StatsCards from './StatsCards'
import { useClientesStore } from '../../stores/clientesStore'
import { useCamionesStore } from '../../stores/camionesStore'
import { useRepartosStore } from '../../stores/repartosStore'

const Dashboard = () => {
  const { clientes, fetchClientes } = useClientesStore()
  const { camiones, fetchCamiones } = useCamionesStore()
  const { repartos, fetchRepartos } = useRepartosStore()

  useEffect(() => {
    fetchClientes()
    fetchCamiones()
    fetchRepartos()
  }, [fetchClientes, fetchCamiones, fetchRepartos])

  const stats = {
    totalClientes: clientes.length,
    totalCamiones: camiones.length,
    repartosHoy: repartos.filter(r => {
      const today = new Date().toISOString().split('T')[0]
      return r.fecha === today
    }).length,
    repartosCompletados: repartos.filter(r => r.estado === 'completado').length
  }

  const repartosRecientes = repartos
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, 5)

  const camioneActivos = camiones.filter(c => c.estado === 'activo').slice(0, 3)

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Panel de control general del sistema</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <i className="bi bi-download me-2"></i>
            Exportar
          </button>
          <button className="btn btn-primary">
            <i className="bi bi-arrow-clockwise me-2"></i>
            Actualizar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="row g-4 mt-4">
        {/* Repartos Recientes */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Repartos Recientes
              </h5>
              <button className="btn btn-sm btn-outline-primary">Ver todos</button>
            </div>
            <div className="card-body">
              {repartosRecientes.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Camión</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repartosRecientes.map((reparto) => (
                        <tr key={reparto.id}>
                          <td>
                            <span className="badge bg-light text-dark">{reparto.id}</span>
                          </td>
                          <td>
                            <div>
                              <div className="fw-medium">{reparto.cliente}</div>
                              <small className="text-muted">{reparto.direccion}</small>
                            </div>
                          </td>
                          <td>
                            <small>{new Date(reparto.fecha).toLocaleDateString()}</small>
                          </td>
                          <td>
                            <span className={`badge ${
                              reparto.estado === 'completado' ? 'bg-success' :
                              reparto.estado === 'en_transito' ? 'bg-warning text-dark' :
                              reparto.estado === 'pendiente' ? 'bg-info' : 'bg-secondary'
                            }`}>
                              {reparto.estado.replace('_', ' ')}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-primary">{reparto.camion}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-inbox fs-1 text-muted"></i>
                  <p className="text-muted mt-2">No hay repartos recientes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Camiones Activos */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-truck me-2"></i>
                Camiones Activos
              </h5>
            </div>
            <div className="card-body">
              {camioneActivos.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {camioneActivos.map((camion) => (
                    <div key={camion.id} className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="me-3">
                        <i className="bi bi-truck fs-3 text-primary"></i>
                      </div>
                      <div className="flex-fill">
                        <h6 className="mb-1">{camion.id}</h6>
                        <p className="mb-1 small text-muted">{camion.conductor}</p>
                        <span className={`badge ${
                          camion.estado === 'activo' ? 'bg-success' :
                          camion.estado === 'mantenimiento' ? 'bg-warning text-dark' : 'bg-secondary'
                        }`}>
                          {camion.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-truck fs-1 text-muted"></i>
                  <p className="text-muted mt-2">No hay camiones activos</p>
                </div>
              )}
            </div>
          </div>

          {/* Alertas */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Alertas del Sistema
              </h5>
            </div>
            <div className="card-body">
              <div className="alert alert-warning" role="alert">
                <i className="bi bi-clock me-2"></i>
                <strong>Retraso detectado</strong><br />
                El reparto R045 lleva 30 min de retraso.
              </div>
              <div className="alert alert-info" role="alert">
                <i className="bi bi-fuel-pump me-2"></i>
                <strong>Mantenimiento programado</strong><br />
                Camión C003 requiere revisión en 2 días.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
