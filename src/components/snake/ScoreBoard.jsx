// Score and high-score display
export default function ScoreBoard({ score, highScore, speed }) {
  return (
    <div className="flex gap-3 w-full">
      <Stat label="Score" value={score} accent="text-emerald-400" />
      <Stat label="High" value={highScore} accent="text-amber-400" />
      <Stat label="Speed" value={`${Math.round(1000 / speed)}/s`} accent="text-sky-400" />
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="flex-1 rounded-xl border border-slate-200 bg-white shadow-sm px-3 py-2 text-center transition-all duration-200 hover:shadow-md">
      <div className="text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className={"text-lg font-bold tabular-nums " + accent}>{value}</div>
    </div>
  );
}
