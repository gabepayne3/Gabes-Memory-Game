import React, { useEffect, useState } from 'react';
import './App.css';

const allCardImages = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍍', '🥝', '🍒', '🥥', '🍑', '🍊', '🍈'];

function shuffleCards(cardCount) {
  const selected = allCardImages.slice(0, cardCount);
  const doubled = [...selected, ...selected].map((emoji, index) => ({
    id: index + Math.random(),
    emoji,
    matched: false,
    matchedBy: null,
  }));
  return doubled.sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  const [cardCount, setCardCount] = useState(6);
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [winner, setWinner] = useState(null);

  const [isFlipping, setIsFlipping] = useState(false);
  const [showCoin, setShowCoin] = useState(false);
  const [coinFace, setCoinFace] = useState(null);

  useEffect(() => {
    startNewGame();
  }, [cardCount]);

  const startNewGame = () => {
    setShowCoin(true);
    setIsFlipping(true);
    setDisabled(true);
    setWinner(null);

    const randomPlayer = Math.random() < 0.5 ? 1 : 2;
    setCoinFace(randomPlayer);

    setTimeout(() => {
      setCurrentPlayer(randomPlayer);
      setCards(shuffleCards(cardCount));
      setScores({ 1: 0, 2: 0 });
      resetTurn();
      setIsFlipping(false);
      setShowCoin(false);
    }, 2000);
  };

  const handleCardClick = (card) => {
    if (disabled || isFlipping) return;
    if (firstCard && card.id === firstCard.id) return;

    if (!firstCard) {
      setFirstCard(card);
    } else if (!secondCard) {
      setSecondCard(card);
    }
  };

  useEffect(() => {
    if (firstCard && secondCard) {
      setDisabled(true);
      if (firstCard.emoji === secondCard.emoji) {
        setCards((prev) =>
          prev.map((card) =>
            card.emoji === firstCard.emoji
              ? { ...card, matched: true, matchedBy: currentPlayer }
              : card
          )
        );
        setScores((prev) => ({
          ...prev,
          [currentPlayer]: prev[currentPlayer] + 1,
        }));
        setTimeout(() => resetTurn(true), 500);
      } else {
        setTimeout(() => resetTurn(false), 1000);
      }
    }
  }, [firstCard, secondCard]);

  const resetTurn = (matched) => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
    if (!matched) {
      setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
    }
  };

  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every(card => card.matched);
    if (allMatched) {
      if (scores[1] > scores[2]) setWinner(1);
      else if (scores[2] > scores[1]) setWinner(2);
      else setWinner('draw');
      setDisabled(true);
    }
  }, [cards, scores]);

  const restartGame = () => {
    startNewGame();
  };

  return (
    <div className='full-game'>
      <h1>Memory Game</h1>

      <div className='scoreboard'>
        {currentPlayer && <p><strong>Current Turn:</strong> Player {currentPlayer}</p>}
        <p>Player 1: {scores[1]} &nbsp;&nbsp; Player 2: {scores[2]}</p>
      </div>

      <div className="controls">
        <label htmlFor="card-count">Card Pairs: </label>
        <select
          id="card-count"
          value={cardCount}
          onChange={(e) => setCardCount(Number(e.target.value))}
          disabled={disabled || isFlipping}
        >
          {[6, 8, 10, 12].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <button onClick={restartGame} disabled={isFlipping}>Restart</button>
      </div>

      {showCoin && (
        <div className="coin-container">
          <div className="coin">{coinFace === 1 ? "1️⃣" : "2️⃣"}</div>
          <p>Flipping coin to decide who starts...</p>
        </div>
      )}

      {winner !== null && (
        <div className="winner-banner">
          {winner === 'draw' ? (
            <h2>It's a draw! 🤝</h2>
          ) : (
            <h2>🎉 Player {winner} wins! 🎉</h2>
          )}
        </div>
      )}

      <div className="grid">
        {cards.map((card) => {
          const isFlipped = card === firstCard || card === secondCard || card.matched;
          const matchedByClass = card.matched
            ? card.matchedBy === 1
              ? 'matched-p1'
              : 'matched-p2'
            : "";
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`card-flip-container ${isFlipped ? 'flipped' : ''} ${matchedByClass}`}
            >
              <div className="card-flip-inner">
                <div className="card-face card-front">
                  <img src="../question.png" alt="?" className="question-img" />
                </div>
                <div className="card-face card-back">{card.emoji}</div>
              </div>
            </div>
          );
        })}
      </div>
     
    </div>
  );
}