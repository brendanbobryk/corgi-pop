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
  const [countdown, setCountdown] = useState(null);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [missIndex, setMissIndex] = useState(null);

  // Corgi popping logic (no consecutive repeats)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveSpot((prev) => {
        let next;
        do {
          next = Math.floor(Math.random() * 9);
        } while (next === prev);
        return next;
      });
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
  }, [timeLeft, score, highScore]);

  // Pre-game countdown
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      setIsPlaying(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleClick = (index) => {
    if (!isPlaying) return;

    if (index === activeSpot) {
      setScore((prev) => prev + 1);
      setActiveSpot(null);
    } else {
      setMissIndex(index);
      setTimeout(() => setMissIndex(null), 200);
    }
  };

  const startOrResetGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setActiveSpot(null);
    setShowRestartConfirm(false);
    setCountdown(3);
  };

  return (
    <div className="app">
      <div className="game-container">
        <h1 className="title">
          <span className="title-text">Corgi Pop!</span>{" "}
          <span className="title-emoji">🐶</span>
        </h1>

        <div className="stats">
          <div>
            Score <span>{score}</span>
          </div>
          <div>
            High <span>{highScore}</span>
          </div>
          <div className={timeLeft <= 5 ? "warning" : ""}>
            Time <span>{timeLeft}s</span>
          </div>
        </div>

        <div className="grid">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className={`cell
                ${activeSpot === index && isPlaying ? "active" : ""}
                ${missIndex === index ? "miss" : ""}
                ${!isPlaying ? "disabled" : ""}
              `}
              onClick={() => handleClick(index)}
            >
              {activeSpot === index && isPlaying ? "🐶" : ""}
            </div>
          ))}
        </div>

        <button
          className="primary-btn"
          disabled={countdown !== null}
          onClick={() => {
            if (isPlaying) {
              setShowRestartConfirm(true);
            } else {
              startOrResetGame();
            }
          }}
        >
          {isPlaying ? "Restart Game" : "Start Game"}
        </button>

        {showRestartConfirm && (
          <div className="confirm">
            <p>Restart the game?</p>
            <div className="confirm-buttons">
              <button onClick={startOrResetGame}>Yes</button>
              <button onClick={() => setShowRestartConfirm(false)}>No</button>
            </div>
          </div>
        )}

        {countdown !== null && (
          <div className="countdown">
            {countdown === 0 ? "GO!" : countdown}
          </div>
        )}

        {!isPlaying && timeLeft === 0 && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>
              Final Score: <strong>{score}</strong>
            </p>
            {score === highScore && score > 0 && (
              <p className="new-high">🎉 New High Score!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
