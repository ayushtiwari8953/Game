// Renders each snake segment; head is red, body is green with a soft glow
export default function Snake({ segments, cellSize }) {
  return (
    <>
      {segments.map((seg, i) => {
        const isHead = i === 0;
        return (
          <div
            key={i}
            className={
              "absolute rounded-md transition-transform duration-75 " +
              (isHead
                ? "bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.8)]"
                : "bg-emerald-500 shadow-[0_0_8px_1px_rgba(16,185,129,0.55)]")
            }
            style={{
              width: cellSize - 2,
              height: cellSize - 2,
              transform: `translate(${seg.x * cellSize + 1}px, ${seg.y * cellSize + 1}px)`,
            }}
          />
        );
      })}
    </>
  );
}
