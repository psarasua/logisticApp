import React from 'react'

const StatsCards = ({ stats }) => {
  const cardsData = [
    {
      title: 'Total Clientes',
      value: stats.totalClientes || 0,
      icon: 'bi-people',
      color: 'primary',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Flota de Camiones',
      value: stats.totalCamiones || 0,
      icon: 'bi-truck',
      color: 'success',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Repartos Hoy',
      value: stats.repartosHoy || 0,
      icon: 'bi-calendar-check',
      color: 'warning',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Completados',
      value: stats.repartosCompletados || 0,
      icon: 'bi-check-circle',
      color: 'info',
      change: '87%',
      changeType: 'neutral'
    }
  ]

  return (
    <div className="row g-4">
      {cardsData.map((card, index) => (
        <div key={index} className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">{card.title}</h6>
                  <h2 className="mb-0 fw-bold">{card.value}</h2>
                  <div className="d-flex align-items-center mt-2">
                    <span 
                      className={`badge ${
                        card.changeType === 'positive' ? 'bg-success-subtle text-success' :
                        card.changeType === 'negative' ? 'bg-danger-subtle text-danger' :
                        'bg-secondary-subtle text-secondary'
                      }`}
                    >
                      <i className={`bi ${
                        card.changeType === 'positive' ? 'bi-arrow-up' :
                        card.changeType === 'negative' ? 'bi-arrow-down' :
                        'bi-dash'
                      } me-1`}></i>
                      {card.change}
                    </span>
                    <small className="text-muted ms-2">vs último mes</small>
                  </div>
                </div>
                <div className="text-end">
                  <div 
                    className={`bg-${card.color}-subtle text-${card.color} rounded-3 p-3 d-inline-flex`}
                    style={{ fontSize: '1.5rem' }}
                  >
                    <i className={`bi ${card.icon}`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
