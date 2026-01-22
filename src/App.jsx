import { useEffect, useState } from "react";

const GAME_TIME = 30; // seconds

export default function App() {
  const [score, setScore] = useState(0);
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

  // End game when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      setIsPlaying(false);
      setActiveSpot(null);
    }
  }, [timeLeft]);

  const handleClick = (index) => {
    if (!isPlaying) return;

    if (index === activeSpot) {
      setScore((prev) => prev + 1);
      setActiveSpot(null);
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setActiveSpot(null);
    setIsPlaying(true);
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setActiveSpot(null);
    setIsPlaying(false);
  };

  return (
    <div style={styles.container}>
      <h1>Corgi Pop! 🐶</h1>

      <h2>Score: {score}</h2>
      <h2>Time Left: {timeLeft}s</h2>

      <div style={styles.grid}>
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            style={styles.cell}
            onClick={() => handleClick(index)}
          >
            {activeSpot === index && isPlaying ? "🐶" : ""}
          </div>
        ))}
      </div>

      <button
        style={styles.button}
        onClick={isPlaying ? resetGame : startGame}
      >
        {isPlaying ? "Restart Game" : "Start Game"}
      </button>

      {!isPlaying && timeLeft === 0 && <h2>Game Over!</h2>}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 100px)",
    gap: "15px",
    justifyContent: "center",
    marginTop: "20px",
  },
  cell: {
    width: "100px",
    height: "100px",
    backgroundColor: "#ffe0b2",
    borderRadius: "12px",
    fontSize: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};
