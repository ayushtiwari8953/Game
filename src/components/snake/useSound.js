import { useCallback, useRef } from "react";

/**
 * Lightweight WebAudio sound effects — no external assets required.
 */
export function useSound(enabled) {
  const ctxRef = useRef(null);

  const getCtx = () => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      ctxRef.current = new Ctx();
    }
    return ctxRef.current;
  };

  const beep = useCallback(
    (freq = 440, duration = 0.08, type = "square", gain = 0.05) => {
      if (!enabled) return;
      const ctx = getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.value = gain;
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.stop(ctx.currentTime + duration);
    },
    [enabled],
  );

  return {
    playEat: () => beep(660, 0.09, "square", 0.06),
    playGameOver: () => {
      beep(220, 0.15, "sawtooth", 0.07);
      setTimeout(() => beep(160, 0.25, "sawtooth", 0.07), 120);
    },
    playMove: () => beep(880, 0.02, "sine", 0.01),
  };
}
