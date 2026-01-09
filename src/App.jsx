import { useEffect, useState } from "react";

export default function App() {
  const [score, setScore] = useState(0);
  const [activeSpot, setActiveSpot] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomSpot = Math.floor(Math.random() * 9);
      setActiveSpot(randomSpot);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (index) => {
    if (index === activeSpot) {
      setScore((prev) => prev + 1);
      setActiveSpot(null);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Corgi Pop! 🐶</h1>
      <h2>Score: {score}</h2>

      <div style={styles.grid}>
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            style={styles.cell}
            onClick={() => handleClick(index)}
          >
            {activeSpot === index ? "🐶" : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    marginTop: "30px",
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
};
