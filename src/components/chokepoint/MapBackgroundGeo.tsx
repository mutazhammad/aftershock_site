import { useEffect, useState } from "react";

const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * Regional map background for the report header.
 * Textured landmass, faint graticule, radial signal glow at the event
 * coordinates, vignette, and a scroll-driven fade to zero so the map never
 * competes with the data.
 */
export function MapBackgroundGeo({
  center,
  zoom,
}: {
  center?: [number, number];
  zoom?: number;
}) {
  const [Mod, setMod] = useState<any>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    import("react-simple-maps").then((m) => setMod(m)).catch(() => setMod(null));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const o = Math.max(0, Math.min(1, 1 - (y - 30) / 260));
      setOpacity(o);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!Mod) return null;
  const { ComposableMap, Geographies, Geography, Graticule } = Mod;
  const c = center ?? [0, 20];
  const scale = (zoom ?? 3) * 130;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden transition-opacity duration-300"
      style={{ opacity }}
    >
      {/* Signal-blue radial glow anchored on the event coordinate. */}
      <div
        className="absolute inset-0 animate-ambient"
        style={{
          background: `radial-gradient(ellipse at ${((c[0] + 180) / 360) * 100}% ${(1 - (c[1] + 90) / 180) * 100}%, rgba(63,169,245,0.28), rgba(63,169,245,0.08) 25%, transparent 55%)`,
        }}
      />
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: c, scale }}
        width={900}
        height={340}
        style={{ width: "100%", height: "100%" }}
      >
        <Graticule stroke="#1B2C47" strokeWidth={0.4} strokeOpacity={0.35} />
        <Geographies geography={TOPO_URL}>
          {({ geographies }: any) =>
            geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#0F1D36"
                stroke="#2A4370"
                strokeWidth={0.35}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
      {/* Scanlines on the map only */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(143,211,255,0.06) 0px, rgba(143,211,255,0.06) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* Vignette so the map dissolves into the panel */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,10,24,0.35) 0%, rgba(5,10,24,0.55) 60%, #0C1628 100%)",
        }}
      />
    </div>
  );
}
