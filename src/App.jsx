import React, { useState } from 'react'
import LandingPage from './components/LandingPage'
import HomeScreenWrapper from './components/HomeScreenWrapper'
import NavigatePage from './components/NavigatePage'
import GestureControl from "./components/GestureControl";

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeScreenWrapper onNavigate={setCurrentPage} />
      case 'navigate':
        return <NavigatePage onNavigate={setCurrentPage} />
      case 'gesture':
        return <GestureControl /> ;  {/* 👈 new page */}
      default:
        return <LandingPage onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="app">
      {renderPage()}
    </div>
  )
}

export default App
