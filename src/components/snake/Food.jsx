// Renders the food cell with a pulsing glow
export default function Food({ position, cellSize }) {
  return (
    <div
      className="absolute rounded-full bg-amber-400 shadow-[0_0_12px_4px_rgba(251,191,36,0.7)] animate-pulse"
      style={{
        width: cellSize,
        height: cellSize,
        transform: `translate(${position.x * cellSize}px, ${position.y * cellSize}px)`,
      }}
    />
  );
}
