import React from 'react'

const AppDrawer = ({ isOpen, onClose, images, onSelectImage, onNavigate }) => {
  if (!isOpen) return null

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer open">
        <div className="drawer-header">
          <h2>Interstellar Menu</h2>
        </div>
        <div className="drawer-content">
          <button 
            className="drawer-item"
            onClick={() => {
              onNavigate('landing')
              onClose()
            }}
          >
            Explore
          </button>
          
          {images && onSelectImage && (
            <>
              <div style={{ 
                height: '1px', 
                background: 'rgba(255, 255, 255, 0.3)', 
                margin: '16px 24px' 
              }} />
              {images.map((img, index) => (
                <button
                  key={index}
                  className="drawer-item"
                  onClick={() => {
                    onSelectImage(img)
                    onClose()
                  }}
                >
                  {img.split('/').pop()}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default AppDrawer