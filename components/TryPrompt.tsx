export default function TryPrompt() {
  return (
    <div className="try-prompt" id="try-prompt" aria-hidden="true">
      <div className="try-text">
        try clicking me!
        <span className="underline">
          <svg viewBox="0 0 200 8" preserveAspectRatio="none">
            <defs>
              <filter
                id="roughen-underline"
                x="-2%"
                y="-30%"
                width="104%"
                height="160%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.06"
                  numOctaves={2}
                  seed={7}
                />
                <feDisplacementMap in="SourceGraphic" scale={2.5} />
              </filter>
            </defs>
            <path
              d="M 4 4 Q 50 2 100 5 Q 150 7 196 3"
              filter="url(#roughen-underline)"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
      <svg className="try-arrow" viewBox="0 0 200 80">
        <defs>
          <filter
            id="roughen-arrow"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves={2}
              seed={4}
            />
            <feDisplacementMap in="SourceGraphic" scale={2.5} />
          </filter>
        </defs>
        <g filter="url(#roughen-arrow)">
          <path className="a-body" d="M 60 6 Q 32 22 8 38 Q -10 48 -28 56" />
          <g className="a-head">
            <path className="h1" d="M -28 56 L -6 42" />
            <path className="h2" d="M -28 56 L -10 70" />
          </g>
        </g>
      </svg>
    </div>
  );
}
