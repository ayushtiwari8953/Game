// Game over overlay with restart action
export default function GameOverModal({ score, highScore, onRestart }) {
  const isNewHigh = score > 0 && score >= highScore;
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-[85%] max-w-sm rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-center shadow-2xl">
        <h2 className="text-3xl font-black tracking-tight text-red-400">Game Over</h2>
        {isNewHigh && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
            New High Score!
          </p>
        )}
        <div className="mt-4 flex justify-center gap-6 text-white">
          <div>
            <div className="text-xs text-white/50">Score</div>
            <div className="text-2xl font-bold">{score}</div>
          </div>
          <div>
            <div className="text-xs text-white/50">Best</div>
            <div className="text-2xl font-bold text-amber-400">{highScore}</div>
          </div>
        </div>
        <button
          onClick={onRestart}
          className="mt-6 w-full cursor-pointer rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-400 active:scale-[0.97]"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
