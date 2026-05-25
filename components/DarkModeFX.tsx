/* Off-screen rigging the dark-mode choreography hooks into:
   - the arrow that flies from left → right
   - the container for spawned glass shards
   - the radial impact flash */
export default function DarkModeFX() {
  return (
    <>
      <div className="dm-arrow" id="dm-arrow" aria-hidden="true">
        <svg viewBox="0 0 280 28">
          {/* fletching (left end) */}
          <polygon points="2,14 28,4 24,14 28,24" fill="#1a1a1a" />
          <polygon points="18,14 40,7 36,14 40,21" fill="#5a5550" />
          <polygon points="32,14 52,9 48,14 52,19" fill="#8a8580" />
          {/* shaft */}
          <rect x={33} y={13} width={225} height={2} fill="#1a1a1a" />
          {/* arrowhead (right, pointing toward bulb) */}
          <polygon points="280,14 252,5 258,14 252,23" fill="#c2410c" />
          {/* motion lines */}
          <line
            x1={0}
            y1={14}
            x2={60}
            y2={14}
            stroke="#1a1a1a"
            strokeWidth={0.5}
            opacity={0.4}
          />
        </svg>
      </div>

      <div className="dm-shards" id="dm-shards" aria-hidden="true" />
      <div className="dm-flash" id="dm-flash" aria-hidden="true" />
    </>
  );
}
