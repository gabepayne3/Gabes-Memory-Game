import React from 'react';
import './App.css';
import MemoryGame from './Maingame';
import BackgroundGrid from './background.jsx';

export default function App() {
  return (
    <>
      <BackgroundGrid />
      <div className="main-container">
        <MemoryGame />
      </div>
    </>
  );
}