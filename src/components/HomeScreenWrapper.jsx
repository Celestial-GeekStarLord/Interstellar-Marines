import React, { useState } from 'react'
import AppDrawer from './AppDrawer'
import ZoomableImageScreen from './ZoomableImageScreen'
import { labelService } from '../services/labelService'

const HomeScreenWrapper = ({ onNavigate }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState('/images/test_image.png')
  const [labels, setLabels] = useState(labelService.getLabels())

  const images = [
    'public/images/test_image.png',
    'public/images/test_image2.jpg'
  ]

  const handleSelectImage = (imagePath) => {
    setCurrentImage(imagePath)
    labelService.clearLabels()
    setLabels([])
  }

  const handleAddLabel = (label, position) => {
    labelService.addLabelAtPosition(label, position)
    setLabels([...labelService.getLabels()])
  }

  const handleDeleteLabel = (index) => {
    labelService.deleteLabel(index)
    setLabels([...labelService.getLabels()])
  }

  const handleEditLabel = (index, text) => {
    labelService.editLabel(index, text)
    setLabels([...labelService.getLabels()])
  }

  return (
    <div className="home-screen">
      <div className="app-bar">
        <button 
          className="menu-btn"
          onClick={() => setDrawerOpen(true)}
        >
          ☰
        </button>
        <div className="app-title">Interstellar Marines</div>
        <div style={{ width: '40px' }}></div>
      </div>

      <ZoomableImageScreen 
        imagePath={currentImage}
        labels={labels}
        onAddLabel={handleAddLabel}
        onDeleteLabel={handleDeleteLabel}
        onEditLabel={handleEditLabel}
      />

      <AppDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        images={images}
        onSelectImage={handleSelectImage}
        onNavigate={onNavigate}
      />

      <style jsx>{`
        .home-screen {
          height: 100vh;
          background: #0D111F;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default HomeScreenWrapper