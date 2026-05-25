export default function DarkModeBulb() {
  return (
    <div className="dm-rig" id="dm-rig">
      <div className="dm-pendulum" id="dm-pendulum">
        <div className="dm-cord" />
        <button
          className="dm-bulb"
          id="dm-bulb-btn"
          data-cursor="link"
          aria-label="Toggle dark mode"
          aria-pressed="false"
        >
          <div className="dm-halo" />
          <svg viewBox="0 0 56 88" aria-hidden="true">
            {/* socket (metal base) */}
            <rect className="socket" x="19" y="0" width="18" height="14" />
            <line className="thread" x1="19" y1="3" x2="37" y2="3" />
            <line className="thread" x1="19" y1="7" x2="37" y2="7" />
            <line className="thread" x1="19" y1="11" x2="37" y2="11" />
            <rect className="socket-shade" x="19" y="0" width="3" height="14" />
            {/* glass envelope */}
            <path
              className="glass"
              d="M 19 14 C 8 18, 6 36, 6 50 C 6 72, 16 84, 28 84 C 40 84, 50 72, 50 50 C 50 36, 48 18, 37 14 Z"
            />
            {/* filament */}
            <path
              className="filament"
              d="M 22 30 L 22 46 Q 24 56 26 46 Q 28 56 30 46 Q 32 56 34 46 L 34 30"
            />
            <line className="filament" x1="22" y1="30" x2="20" y2="22" />
            <line className="filament" x1="34" y1="30" x2="36" y2="22" />
            {/* broken state (jagged remnant near socket) */}
            <path
              className="broken"
              d="M 19 14 L 18 22 L 22 18 L 24 26 L 28 20 L 32 28 L 34 20 L 38 26 L 37 14"
            />
          </svg>
        </button>
        <span className="dm-hint" id="dm-hint">
          click · break the light
        </span>
      </div>
    </div>
  );
}
