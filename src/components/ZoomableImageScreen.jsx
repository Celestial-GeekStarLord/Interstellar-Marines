import React, { useState, useRef, useEffect } from 'react';

const ZoomableImageScreen = ({
  imagePath,
  labels,
  onAddLabel,
  onDeleteLabel,
  onEditLabel
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [showLabelMenu, setShowLabelMenu] = useState(null);
  const containerRef = useRef(null);
  const lastPan = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);

  // Zoom with cursor focus
  const handleWheel = (e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - position.x;
    const offsetY = e.clientY - rect.top - position.y;

    const delta = -e.deltaY * 0.0015; // smoother zoom
    let newScale = Math.min(Math.max(0.1, scale * (1 + delta)), 10);

    // Adjust position to zoom towards cursor
    const ratio = newScale / scale;
    const newX = position.x - (offsetX * (ratio - 1));
    const newY = position.y - (offsetY * (ratio - 1));

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };

  // Pan handling
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isPanning.current = true;
    lastPan.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    containerRef.current.style.cursor = 'grabbing';

    const handleMouseMove = (moveEvent) => {
      if (!isPanning.current) return;
      setPosition({
        x: moveEvent.clientX - lastPan.current.x,
        y: moveEvent.clientY - lastPan.current.y
      });
    };

    const handleMouseUp = () => {
      isPanning.current = false;
      containerRef.current.style.cursor = scale > 1 ? 'grab' : 'default';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = (e) => {
    if (e.shiftKey) {
      resetView();
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - position.x) / scale;
    const y = (e.clientY - rect.top - position.y) / scale;

    const relativeX = x / rect.width;
    const relativeY = y / rect.height;

    if (relativeX >= 0 && relativeX <= 1 && relativeY >= 0 && relativeY <= 1) {
      showAddLabelDialog(relativeX, relativeY);
    }
  };

  const showAddLabelDialog = async (x, y) => {
    const labelText = prompt('Enter label:');
    if (labelText && labelText.trim()) {
      onAddLabel(labelText.trim(), { x, y });
    }
  };

  const handleLabelClick = (label, index, e) => {
    e.stopPropagation();
    setSelectedLabel(label);
    setShowLabelMenu({
      x: e.clientX,
      y: e.clientY,
      index: index
    });
  };

  const handleEditLabel = (index) => {
    const newText = prompt('Edit label:', labels[index].text);
    if (newText && newText.trim()) {
      onEditLabel(index, newText.trim());
    }
    setShowLabelMenu(null);
  };

  const handleRemoveLabel = (index) => {
    if (window.confirm('Are you sure you want to remove this label?')) {
      onDeleteLabel(index);
    }
    setShowLabelMenu(null);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setSelectedLabel(null);
    setShowLabelMenu(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowLabelMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="zoomable-screen">
      <div className="zoom-controls">
        <button className="btn btn-primary" onClick={() => setScale(s => Math.min(s + 0.5, 10))}>Zoom In</button>
        <button className="btn btn-secondary" onClick={() => setScale(s => Math.max(s - 0.5, 0.1))}>Zoom Out</button>
        <button className="btn" onClick={resetView} style={{ background: '#6B7280' }}>Reset</button>
        <div className="scale-display">Scale: {scale.toFixed(2)}x</div>
        <div className="instructions">Double-click to add labels. Shift + Double-click to reset.</div>
      </div>

      <div
        ref={containerRef}
        className="image-container"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: scale > 1 ? 'grab' : 'default' }}
      >
        <div
          className="image-wrapper"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0'
          }}
        >
          <img src={imagePath} alt="Space" className="zoomable-image" />

          {/* Labels */}
          {labels.map((label, index) => (
            <div
              key={index}
              className={`image-label ${selectedLabel === label ? 'selected' : ''}`}
              style={{
                left: `${label.position.x * 100}%`,
                top: `${label.position.y * 100}%`,
                transform: `translate(-50%, -50%) scale(${1/scale})` // scale down label when zooming
              }}
              onClick={(e) => handleLabelClick(label, index, e)}
            >
              {label.text}
            </div>
          ))}
        </div>
      </div>

      {/* Context Menu */}
      {showLabelMenu && (
        <>
          <div className="context-menu-overlay" onClick={() => setShowLabelMenu(null)} />
          <div className="context-menu" style={{ left: showLabelMenu.x, top: showLabelMenu.y }}>
            <button className="context-menu-item edit" onClick={() => handleEditLabel(showLabelMenu.index)}>✏️ Edit</button>
            <button className="context-menu-item remove" onClick={() => handleRemoveLabel(showLabelMenu.index)}>🗑️ Remove</button>
          </div>
        </>
      )}

      <style jsx>{`
        .zoomable-screen {
          background: #0D111F;
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .zoom-controls {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 10;
          display: flex;
          gap: 10px;
          align-items: center;
          background: rgba(20, 26, 42, 0.9);
          padding: 12px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
          flex-wrap: wrap;
        }

        .scale-display {
          color: white;
          font-weight: bold;
          margin: 0 10px;
        }

        .instructions {
          color: #A0AEC0;
          font-size: 12px;
          font-style: italic;
        }

        .image-container {
          flex: 1;
          overflow: hidden;
          position: relative;
          background: #1a202c;
        }

        .image-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .zoomable-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          user-select: none;
          -webkit-user-drag: none;
        }

        .image-label {
          position: absolute;
          background: rgba(244, 67, 54, 0.9);
          padding: 6px 12px;
          border-radius: 6px;
          color: white;
          font-weight: bold;
          font-size: 14px;
          cursor: pointer;
          user-select: none;
          backdrop-filter: blur(10px);
          border: 2px solid white;
          min-width: 60px;
          text-align: center;
          transition: all 0.2s ease;
          z-index: 5;
        }

        .image-label:hover {
          background: rgba(244, 67, 54, 1);
          transform: translate(-50%, -50%) scale(${1/scale}) scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .image-label.selected {
          background: rgba(33, 150, 243, 0.9);
          border-color: #90CAF9;
        }

        /* Context Menu */
        .context-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 100;
        }

        .context-menu {
          position: fixed;
          background: #2D3748;
          border: 1px solid #4A5568;
          border-radius: 8px;
          padding: 8px 0;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          z-index: 101;
          min-width: 120px;
        }

        .context-menu-item {
          display: block;
          width: 100%;
          padding: 8px 16px;
          border: none;
          background: none;
          color: white;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s ease;
        }

        .context-menu-item:hover {
          background: #4A5568;
        }

        .context-menu-item.edit:hover { background: #2B6CB0; }
        .context-menu-item.remove:hover { background: #C53030; }

        @media (max-width: 768px) {
          .zoom-controls { top: 10px; left: 10px; right: 10px; }
          .scale-display, .instructions { margin: 5px 0; }
        }
      `}</style>
    </div>
  );
};

export default ZoomableImageScreen;
