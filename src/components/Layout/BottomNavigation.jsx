import React from 'react'
import { NavLink } from 'react-router-dom'

const BottomNavigation = () => {
  const navItems = [
    {
      path: '/dashboard',
      icon: 'bi-speedometer2',
      label: 'Dashboard'
    },
    {
      path: '/clientes',
      icon: 'bi-people',
      label: 'Clientes'
    },
    {
      path: '/camiones',
      icon: 'bi-truck',
      label: 'Camiones'
    },
    {
      path: '/rutas',
      icon: 'bi-geo-alt',
      label: 'Rutas'
    },
    {
      path: '/repartos',
      icon: 'bi-box-seam',
      label: 'Repartos'
    }
  ]

  return (
    <nav className="bg-white border-top position-fixed bottom-0 start-0 end-0" style={{ zIndex: 1030 }}>
      <div className="d-flex">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex-fill text-center py-2 text-decoration-none ${
                isActive ? 'text-primary' : 'text-muted'
              }`
            }
          >
            <div>
              <i className={`bi ${item.icon} d-block fs-5 mb-1`}></i>
              <small className="d-block" style={{ fontSize: '0.7rem' }}>
                {item.label}
              </small>
            </div>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNavigation
