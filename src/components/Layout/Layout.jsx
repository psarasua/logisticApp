import React, { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import BottomNavigation from './BottomNavigation'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="d-flex vh-100">
      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="d-lg-none">
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50" 
            style={{ zIndex: 1040 }}
            onClick={() => setSidebarOpen(false)}
          />
          <div 
            className="position-fixed top-0 start-0 h-100 bg-white shadow-lg" 
            style={{ width: '280px', zIndex: 1050 }}
          >
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-fill d-flex flex-column overflow-hidden">
        {/* Top Navbar */}
        <Navbar onToggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-fill overflow-auto">
          <div className="container-fluid p-3 pb-5 pb-lg-3">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="d-lg-none">
          <BottomNavigation />
        </div>
      </div>
    </div>
  )
}

export default Layout
