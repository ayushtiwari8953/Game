// Top bar controls: difficulty, pause/resume, sound, restart
export default function Controls({
  difficulty,
  onDifficultyChange,
  isPaused,
  isRunning,
  onTogglePause,
  soundOn,
  onToggleSound,
  onRestart,
}) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {["Easy", "Medium", "Hard"].map((d) => (
          <button
            key={d}
            onClick={() => onDifficultyChange(d)}
            className={
              "cursor-pointer px-3 py-2 text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 " +
              (difficulty === d
                ? "bg-emerald-500 text-white shadow-inner"
                : "text-slate-600 hover:bg-slate-100")
            }
          >
            {d}
          </button>
        ))}
      </div>

      <button
        onClick={onTogglePause}
        disabled={!isRunning}
        className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        {isPaused ? "Resume" : "Pause"}
      </button>

      <button
        onClick={onToggleSound}
        className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-50 active:scale-95"
        aria-label="Toggle sound"
      >
        {soundOn ? "🔊" : "🔇"}
      </button>

      <button
        onClick={onRestart}
        className="ml-auto cursor-pointer rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-red-600 active:scale-95"
      >
        Restart
      </button>
    </div>
  );
}

// D-pad style touch controls for mobile
export function TouchPad({ onDirection }) {
  const btn =
    "cursor-pointer flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-2xl text-slate-700 shadow-sm transition-all duration-150 hover:scale-105 hover:bg-slate-50 active:scale-90 active:bg-emerald-100 select-none";
  return (
    <div className="mt-4 grid w-44 grid-cols-3 grid-rows-3 gap-2 md:hidden">
      <div />
      <button className={btn} onTouchStart={() => onDirection("UP")} onClick={() => onDirection("UP")}>▲</button>
      <div />
      <button className={btn} onTouchStart={() => onDirection("LEFT")} onClick={() => onDirection("LEFT")}>◀</button>
      <div />
      <button className={btn} onTouchStart={() => onDirection("RIGHT")} onClick={() => onDirection("RIGHT")}>▶</button>
      <div />
      <button className={btn} onTouchStart={() => onDirection("DOWN")} onClick={() => onDirection("DOWN")}>▼</button>
      <div />
    </div>
  );
}
