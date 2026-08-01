/**
 * Aftershock brand marks, drawn inline as SVG.
 * Wave: flat baseline, one hard downward spike, then a decaying oscillation
 * that settles back to flat. Reads as a seismograph trace and as a market
 * repricing that settles.
 */
const WAVE_PATH =
  "M0 16 H30 L37 29 L44 4 L51 25 L58 9.5 L64 20.5 L70 13 L76 18 L82 15 L88 16.8 L94 15.9 H140";

export function SeismicWave({
  width = 140,
  className = "",
}: {
  width?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={(width / 140) * 32}
      viewBox="0 0 140 32"
      fill="none"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      <path
        d={WAVE_PATH}
        stroke="#3FA9F5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={37} cy={29} r={2.6} fill="#3FA9F5" />
    </svg>
  );
}

export function RingMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className="shrink-0">
      <rect width="64" height="64" fill="#050A18" />
      <circle cx="32" cy="32" r="5.5" fill="#3FA9F5" />
      <circle cx="32" cy="32" r="13" stroke="#3FA9F5" strokeWidth="3" opacity="1" fill="none" />
      <circle cx="32" cy="32" r="20" stroke="#3FA9F5" strokeWidth="2.2" opacity="0.75" fill="none" />
      <circle cx="32" cy="32" r="27.5" stroke="#3FA9F5" strokeWidth="1.6" opacity="0.45" fill="none" />
    </svg>
  );
}

/** Compact wordmark for the navigation bar. Wave plus word, no tagline. */
export function WordmarkCompact() {
  return (
    <span className="flex items-center gap-3">
      <SeismicWave width={104} />
      <span className="display text-[19px] font-medium uppercase tracking-[0.20em] text-bone">
        Aftershock
      </span>
    </span>
  );
}

/** Full wordmark with tagline, used in the footer. */
export function WordmarkFull() {
  return (
    <span className="inline-flex flex-col gap-1">
      <span className="flex items-center gap-3">
        <SeismicWave width={124} />
        <span className="display text-[21px] font-medium uppercase tracking-[0.22em] text-bone">
          Aftershock
        </span>
      </span>
      <span className="mono text-[10px] uppercase tracking-[0.3em] text-ash">
        Geopolitical Market Intelligence
      </span>
    </span>
  );
}