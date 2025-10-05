import React, { useState } from 'react'
import AppDrawer from './AppDrawer'
import GestureControl from './GestureControl'

const NavigatePage = ({ onNavigate }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="navigate-page">
      <div className="app-bar">
        <button 
          className="menu-btn"
          onClick={() => setDrawerOpen(true)}
        >
          ☰
        </button>
        <div className="app-title">Navigate</div>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="navigate-content">
        <GestureControl />
      </div>

      <AppDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  )
}

export default NavigatePage