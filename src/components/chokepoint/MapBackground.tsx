import { useEffect, useState } from "react";

type Region = "gulf" | "taiwan" | "redsea" | "eastern-europe" | "saudi" | "generic";

// Simplified line-art outlines. Coordinates hand-tuned in 0..400 x 0..200 space.
const PATHS: Record<Region, string[]> = {
  gulf: [
    // Arabian peninsula (rough)
    "M60,150 L120,175 L180,180 L230,170 L260,150 L275,120 L265,90 L235,75 L200,80 L160,95 L120,110 L90,125 Z",
    // Iran coastline
    "M180,60 L230,55 L290,55 L340,70 L360,90 L355,110 L320,120 L280,115 L240,105 L210,90 Z",
    // Strait of Hormuz marker line
    "M260,110 L285,120",
  ],
  saudi: [
    "M80,60 L170,55 L250,70 L300,95 L315,140 L280,170 L210,180 L140,170 L90,140 L70,100 Z",
  ],
  taiwan: [
    // Taiwan
    "M260,70 L280,60 L295,80 L300,120 L285,155 L268,170 L255,160 L250,120 Z",
    // China coast
    "M40,40 L120,35 L180,50 L220,70 L235,95 L225,125 L200,150 L160,170 L110,180 L60,175 L30,150 Z",
  ],
  redsea: [
    // Arabian side
    "M240,30 L290,50 L310,90 L305,130 L280,165 L240,180 L210,160 L200,120 L215,80 Z",
    // African side
    "M120,20 L170,30 L200,60 L205,105 L190,150 L160,175 L120,180 L90,150 L80,110 L95,60 Z",
    // Strait marker
    "M195,155 L215,160",
  ],
  "eastern-europe": [
    "M40,30 L150,25 L260,40 L330,70 L360,120 L330,170 L250,185 L150,180 L70,160 L30,120 Z",
  ],
  generic: [
    "M50,50 L350,50 L350,150 L50,150 Z",
  ],
};

export function MapBackground({ region }: { region: Region }) {
  const paths = PATHS[region] ?? PATHS.generic;
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Fully visible above 60px, fully faded by 400px.
      const o = Math.max(0, Math.min(1, 1 - (y - 60) / 340));
      setOpacity(o);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full transition-opacity"
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="cp-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EF9F27" stopOpacity="0.16" />
          <stop offset="1" stopColor="#EF9F27" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#cp-fade)" strokeWidth="1.1" strokeLinejoin="round">
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}