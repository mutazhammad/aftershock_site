import { useEffect, useState } from "react";

const TOPO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function MapBackgroundGeo({
  center,
  zoom,
}: {
  center?: [number, number];
  zoom?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [Mod, setMod] = useState<any>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    setMounted(true);
    import("react-simple-maps").then((m) => setMod(m)).catch(() => setMod(null));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const o = Math.max(0, Math.min(1, 1 - (y - 40) / 320));
      setOpacity(o);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mounted || !Mod) return null;
  const { ComposableMap, Geographies, Geography } = Mod;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full transition-opacity"
      style={{ opacity: opacity * 0.55 }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: center ?? [0, 20],
          scale: (zoom ?? 3) * 130,
        }}
        width={800}
        height={320}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={TOPO_URL}>
          {({ geographies }: any) =>
            geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="transparent"
                stroke="#EF9F27"
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
    </div>
  );
}