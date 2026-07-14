import { useEffect, useRef, useState } from "react";
import Snake from "./Snake";
import Food from "./Food";
import GameOverModal from "./GameOverModal";
import { GRID_SIZE } from "./constants";

/**
 * Renders the play field, snake, food, and swipe layer.
 * Sizes itself responsively while keeping a square aspect ratio.
 */
export default function GameBoard({
  snake,
  food,
  isGameOver,
  isPaused,
  score,
  highScore,
  onRestart,
  onSwipe,
}) {
  const wrapRef = useRef(null);
  const [cellSize, setCellSize] = useState(18);

  // Track container size to scale cells responsively
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setCellSize(Math.floor(w / GRID_SIZE));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Swipe gesture detection
  const touchStart = useRef(null);
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) < 20) return;
    if (absX > absY) onSwipe(dx > 0 ? "RIGHT" : "LEFT");
    else onSwipe(dy > 0 ? "DOWN" : "UP");
    touchStart.current = null;
  };

  const boardPx = cellSize * GRID_SIZE;

  return (
    <div
      ref={wrapRef}
      className="relative w-full max-w-[520px] aspect-square rounded-2xl border border-white/10 bg-slate-950/60 p-2 shadow-[0_0_60px_-10px_rgba(16,185,129,0.35)] backdrop-blur-md"
    >
      <div
        className="relative mx-auto overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_60%)]"
        style={{
          width: boardPx,
          height: boardPx,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Snake segments={snake} cellSize={cellSize} />
        <Food position={food} cellSize={cellSize} />

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="text-2xl font-black tracking-widest text-white/90">PAUSED</span>
          </div>
        )}

        {isGameOver && (
          <GameOverModal score={score} highScore={highScore} onRestart={onRestart} />
        )}
      </div>
    </div>
  );
}
