import React from 'react'
import DashboardStats from '../components/Dashboard/DashboardStats'
import DashboardCharts from '../components/Dashboard/DashboardCharts'
import DashboardTables from '../components/Dashboard/DashboardTables'

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general del sistema logístico</p>
      </div>

      <DashboardStats />
      <DashboardCharts />
      <DashboardTables />
    </div>
  )
}

export default Dashboard