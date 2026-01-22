import { useEffect, useState } from "react";
import "./App.css";

const GAME_TIME = 30; // seconds

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => Number(localStorage.getItem("corgiHighScore")) || 0
  );
  const [activeSpot, setActiveSpot] = useState(null);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [isPlaying, setIsPlaying] = useState(false);

  // Corgi popping logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const randomSpot = Math.floor(Math.random() * 9);
      setActiveSpot(randomSpot);
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Countdown timer
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying]);

  // End game + high score check
  useEffect(() => {
    if (timeLeft === 0) {
      setIsPlaying(false);
      setActiveSpot(null);

      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("corgiHighScore", score);
      }
    }
  }, [timeLeft]);

  const handleClick = (index) => {
    if (!isPlaying) return;

    if (index === activeSpot) {
      setScore((prev) => prev + 1);
      setActiveSpot(null);
    }
  };

  const startOrResetGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setActiveSpot(null);
    setIsPlaying(true);
  };

  return (
    <div className="app">
      <div className="game-container">
        <h1 className="title">
          <span className="title-text">Corgi Pop!</span>{" "}
          <span className="title-emoji">🐶</span>
        </h1>

        <div className="stats">
          <div>Score <span>{score}</span></div>
          <div>High <span>{highScore}</span></div>
          <div>Time <span>{timeLeft}s</span></div>
        </div>

        <div className="grid">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className={`cell ${activeSpot === index && isPlaying ? "active" : ""}`}
              onClick={() => handleClick(index)}
            >
              {activeSpot === index && isPlaying ? "🐶" : ""}
            </div>
          ))}
        </div>

        <button
          className="primary-btn"
          onClick={startOrResetGame}
        >
          {isPlaying ? "Restart Game" : "Start Game"}
        </button>

        {!isPlaying && timeLeft === 0 && (
          <p className="game-over">Game Over!</p>
        )}
      </div>
    </div>
  );
}
