export function Sparkline({
  values,
  width = 60,
  height = 16,
  color = "#3FA9F5",
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  const clean = (values ?? []).filter((v) => typeof v === "number" && isFinite(v));
  if (clean.length < 2) return null;
  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const range = max - min || 1;
  const step = width / (clean.length - 1);
  const pts = clean
    .map(
      (v, i) =>
        `${(i * step).toFixed(1)},${(height - ((v - min) / range) * height).toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="inline-block align-middle"
      aria-hidden
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}