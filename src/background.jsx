import React, { useEffect, useRef, useState } from 'react';
import './background.css';

const BackgroundGrid = () => {
  const [hoverCoords, setHoverCoords] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setHoverCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const rows = 20;
  const cols = 30;

  return (
    <div className="bg-grid">
      {[...Array(rows * cols)].map((_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const top = row * 50;
        const left = col * 50;

        const dx = hoverCoords.x - left;
        const dy = hoverCoords.y - top;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isNear = distance < 100;

        return (
          <div
            key={index}
            className={`bg-question ${isNear ? 'active' : ''}`}
            style={{ top: `${top}px`, left: `${left}px` }}
          >
            ?
          </div>
        );
      })}
    </div>
  );
};

export default BackgroundGrid;