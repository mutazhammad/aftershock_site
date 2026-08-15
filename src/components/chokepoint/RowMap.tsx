import { useEffect, useRef, useState } from "react";

const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * Faint regional map that lives behind a feed row. Lazy-mounted on scroll
 * so the feed stays snappy even with many rows. Fades out on the left so
 * the row text stays fully legible.
 */
export function RowMap({
  center,
  zoom,
  hovered,
}: {
  center?: [number, number];
  zoom?: number;
  hovered: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [Mod, setMod] = useState<any>(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || Mod) return;
    import("react-simple-maps").then((m) => setMod(m)).catch(() => setMod(null));
  }, [visible, Mod]);

  const c = center ?? [0, 20];
  const scale = (zoom ?? 3) * 130;
  const glowX = ((c[0] + 180) / 360) * 100;
  const glowY = (1 - (c[1] + 90) / 180) * 100;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ opacity: narrow ? 0.04 : hovered ? 0.12 : 0.07 }}
      >
        {Mod &&
          (() => {
            const { ComposableMap, Geographies, Geography } = Mod;
            return (
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ center: c, scale }}
                width={900}
                height={200}
                style={{ width: "100%", height: "100%" }}
              >
                <Geographies geography={TOPO_URL}>
                  {({ geographies }: any) =>
                    geographies.map((geo: any) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#1B2C47"
                        stroke="#2A4370"
                        strokeWidth={0.3}
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
            );
          })()}
      </div>
      {hovered && center && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(63,169,245,0.45), transparent 25%)`,
          }}
        />
      )}
      {/* Left-to-right fade so text stays fully legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, #050A18 0%, rgba(5,10,24,0.9) 20%, rgba(5,10,24,0.4) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}