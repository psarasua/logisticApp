import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const Sidebar = ({ mobile, onClose }) => {
  const location = useLocation()

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'bi-speedometer2',
      description: 'Panel principal'
    },
    {
      path: '/clientes',
      label: 'Clientes',
      icon: 'bi-people',
      description: 'Gestión de clientes'
    },
    {
      path: '/camiones',
      label: 'Camiones',
      icon: 'bi-truck',
      description: 'Flota de vehículos'
    },
    {
      path: '/rutas',
      label: 'Rutas',
      icon: 'bi-geo-alt',
      description: 'Rutas de reparto'
    },
    {
      path: '/repartos',
      label: 'Repartos',
      icon: 'bi-box-seam',
      description: 'Gestión de entregas'
    }
  ]

  const handleNavClick = () => {
    if (mobile && onClose) {
      onClose()
    }
  }

  return (
    <div className={`bg-light border-end h-100 ${mobile ? '' : 'position-sticky top-0'}`} style={{ width: '280px' }}>
      {/* Mobile Header */}
      {mobile && (
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <div className="d-flex align-items-center">
            <i className="bi bi-truck text-primary fs-4 me-2"></i>
            <span className="fw-bold">Logística App</span>
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}

      {/* Desktop Header */}
      {!mobile && (
        <div className="p-3 border-bottom">
          <div className="d-flex align-items-center">
            <i className="bi bi-truck text-primary fs-4 me-2"></i>
            <div>
              <h6 className="mb-0 fw-bold">Logística App</h6>
              <small className="text-muted">v1.0.0</small>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="p-3">
        <h6 className="text-muted text-uppercase fw-bold mb-3 small">Navegación</h6>
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item mb-1">
              <NavLink
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center py-2 px-3 rounded ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-dark hover-bg-light'
                  }`
                }
              >
                <i className={`bi ${item.icon} me-3`}></i>
                <div className="flex-fill">
                  <div className="fw-medium">{item.label}</div>
                  <small className={location.pathname === item.path ? 'text-white-50' : 'text-muted'}>
                    {item.description}
                  </small>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Stats Section */}
      <div className="mt-auto p-3 border-top">
        <div className="card bg-gradient-primary text-white">
          <div className="card-body p-3">
            <div className="d-flex align-items-center">
              <i className="bi bi-bar-chart fs-3 me-3"></i>
              <div>
                <h6 className="mb-1">Estadísticas Rápidas</h6>
                <small>Sistema funcionando correctamente</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
