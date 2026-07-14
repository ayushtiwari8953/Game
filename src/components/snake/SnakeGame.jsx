import { useCallback, useEffect, useRef, useState } from "react";
import GameBoard from "./GameBoard";
import ScoreBoard from "./ScoreBoard";
import Controls, { TouchPad } from "./Controls";
import { useSound } from "./useSound";
import { DIFFICULTY, DIRECTIONS, GRID_SIZE, INITIAL_SNAKE } from "./constants";

const HIGH_SCORE_KEY = "snake:highScore";

// Opposite-direction guard so the snake can't reverse into itself
const isOpposite = (a, b) => a.x + b.x === 0 && a.y + b.y === 0;

function randomFood(snake) {
  while (true) {
    const pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((s) => s.x === pos.x && s.y === pos.y)) return pos;
  }
}

export default function SnakeGame() {
  const [difficulty, setDifficulty] = useState("Medium");
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(() => randomFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [speed, setSpeed] = useState(DIFFICULTY.Medium.initialSpeed);
  const [soundOn, setSoundOn] = useState(true);

  // Refs give the tick loop stable access without re-subscribing
  const directionRef = useRef(direction);
  const queuedDirRef = useRef(null);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);

  const sound = useSound(soundOn);

  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);

  // Load high score once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
    setHighScore(stored);
  }, []);

  // Reset game state to defaults for the current difficulty
  const resetGame = useCallback(() => {
    const fresh = INITIAL_SNAKE;
    setSnake(fresh);
    setFood(randomFood(fresh));
    setDirection(DIRECTIONS.RIGHT);
    directionRef.current = DIRECTIONS.RIGHT;
    queuedDirRef.current = null;
    setScore(0);
    setSpeed(DIFFICULTY[difficulty].initialSpeed);
    setIsGameOver(false);
    setIsPaused(false);
    setHasStarted(false);
  }, [difficulty]);

  // Restart when difficulty changes
  useEffect(() => { resetGame(); }, [difficulty, resetGame]);

  // Change direction with reversal guard + one-step queue for fast inputs
  const changeDirection = useCallback((name) => {
    const next = DIRECTIONS[name];
    if (!next) return;
    if (isOpposite(next, directionRef.current)) return;
    if (next.x === directionRef.current.x && next.y === directionRef.current.y) return;
    queuedDirRef.current = next;
    setHasStarted(true);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      const map = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
        W: "UP", S: "DOWN", A: "LEFT", D: "RIGHT",
      };
      if (e.key === " ") {
        e.preventDefault();
        if (!isGameOver) setIsPaused((p) => !p);
        return;
      }
      if (map[e.key]) {
        e.preventDefault();
        changeDirection(map[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [changeDirection, isGameOver]);

  // Main game tick
  useEffect(() => {
    if (isGameOver || isPaused || !hasStarted) return;

    const id = setInterval(() => {
      // Apply queued direction change at tick boundary for responsiveness
      if (queuedDirRef.current) {
        directionRef.current = queuedDirRef.current;
        setDirection(queuedDirRef.current);
        queuedDirRef.current = null;
      }

      const dir = directionRef.current;
      const current = snakeRef.current;
      const head = current[0];
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };

      // Wall collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        sound.playGameOver();
        return;
      }

      // Self collision (ignore last tail because it would move away)
      const bodyToCheck = current.slice(0, -1);
      if (bodyToCheck.some((s) => s.x === newHead.x && s.y === newHead.y)) {
        setIsGameOver(true);
        sound.playGameOver();
        return;
      }

      const ate =
        newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;

      const nextSnake = ate ? [newHead, ...current] : [newHead, ...current.slice(0, -1)];
      setSnake(nextSnake);

      if (ate) {
        sound.playEat();
        setFood(randomFood(nextSnake));
        setScore((s) => {
          const ns = s + 10;
          setHighScore((hs) => {
            if (ns > hs) {
              localStorage.setItem(HIGH_SCORE_KEY, String(ns));
              return ns;
            }
            return hs;
          });
          return ns;
        });
        // Speed up progressively, clamped by difficulty
        setSpeed((sp) => {
          const cfg = DIFFICULTY[difficulty];
          return Math.max(cfg.minSpeed, sp - cfg.step);
        });
      }
    }, speed);

    return () => clearInterval(id);
  }, [isPaused, isGameOver, hasStarted, speed, difficulty, sound]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 bg-white bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_60%)] px-4 py-6 text-slate-900">
      <header className="w-full max-w-[520px] text-center">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          {/* <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 bg-clip-text text-transparent">
            Snake
          </span> */}
          {" "}
          <span className="text-slate-800"> Snake Game</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {/* Arrow keys / WASD · Space to pause · Swipe on mobile */}
        </p>
      </header>

      <div className="w-full max-w-[520px] space-y-3">
        <ScoreBoard score={score} highScore={highScore} speed={speed} />
        <Controls
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          isPaused={isPaused}
          isRunning={hasStarted && !isGameOver}
          onTogglePause={() => setIsPaused((p) => !p)}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((s) => !s)}
          onRestart={resetGame}
        />
      </div>

      <GameBoard
        snake={snake}
        food={food}
        isGameOver={isGameOver}
        isPaused={isPaused}
        score={score}
        highScore={highScore}
        onRestart={resetGame}
        onSwipe={changeDirection}
      />

      {!hasStarted && !isGameOver && (
        <p className="text-sm text-slate-500 animate-pulse">
          {/* Press an arrow key or swipe to start */}
        </p>
      )}

      <TouchPad onDirection={changeDirection} />
    </div>
  );
}
