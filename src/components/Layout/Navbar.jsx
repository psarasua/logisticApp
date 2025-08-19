import React from 'react'
import { useAuthStore } from '../../stores/authStore'

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuthStore()

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3">
      {/* Mobile Menu Button */}
      <button
        className="btn btn-outline-secondary d-lg-none me-2"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Brand/Logo */}
      <span className="navbar-brand mb-0 h1 d-flex align-items-center">
        <i className="bi bi-truck text-primary me-2"></i>
        <span className="d-none d-sm-inline">Logística App</span>
      </span>

      {/* Right side content */}
      <div className="ms-auto d-flex align-items-center">
        {/* Notifications */}
        <div className="dropdown me-3">
          <button 
            className="btn btn-outline-secondary position-relative" 
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-bell"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
              3
            </span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><h6 className="dropdown-header">Notificaciones</h6></li>
            <li><a className="dropdown-item" href="#"><i className="bi bi-truck me-2"></i>Camión C001 completó ruta</a></li>
            <li><a className="dropdown-item" href="#"><i className="bi bi-exclamation-triangle me-2"></i>Retraso en reparto R045</a></li>
            <li><a className="dropdown-item" href="#"><i className="bi bi-check-circle me-2"></i>Cliente nuevo agregado</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-center" href="#">Ver todas</a></li>
          </ul>
        </div>

        {/* User Menu */}
        <div className="dropdown">
          <button 
            className="btn btn-outline-primary d-flex align-items-center" 
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-circle me-2"></i>
            <span className="d-none d-sm-inline">{user?.username || 'Usuario'}</span>
            <i className="bi bi-chevron-down ms-2"></i>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><h6 className="dropdown-header">¡Hola, {user?.username}!</h6></li>
            <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i>Mi Perfil</a></li>
            <li><a className="dropdown-item" href="#"><i className="bi bi-gear me-2"></i>Configuración</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-danger" onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
