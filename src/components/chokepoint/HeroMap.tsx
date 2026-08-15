import { useEffect, useState } from "react";
import type { EventLocation } from "@/lib/aftershock-api";
import { useIsMobile } from "@/hooks/use-mobile";

const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * The full-viewport intelligence map behind the hero.
 *
 * Assembles once on mount:
 *   0.0s  graticule fades in
 *   0.4s  landmasses resolve (stroke-draw + fade)
 *   0.6s  radar sweeps once, ~2.4s
 *   1.6s+ event markers ignite, staggered ~80ms apart, then ambient-pulse
 */
export function HeroMap({ markers }: { markers: EventLocation[] }) {
  const [Mod, setMod] = useState<any>(null);
  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0); // 0 blank, 1 graticule, 2 land, 3 markers
  const isMobile = useIsMobile();
  const shown = isMobile ? markers.slice(0, 6) : markers;

  useEffect(() => {
    const m = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (m?.matches) {
      setReduced(true);
      setPhase(3);
    }
    import("react-simple-maps").then((mod) => setMod(mod)).catch(() => setMod(null));
  }, []);

  useEffect(() => {
    if (reduced) return;
    const t1 = setTimeout(() => setPhase(1), 150);
    const t2 = setTimeout(() => setPhase(2), 500);
    const t3 = setTimeout(() => setPhase(3), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reduced]);

  if (!Mod) {
    return (
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-abyss" />
      </div>
    );
  }
  const { ComposableMap, Geographies, Geography, Graticule, Marker } = Mod;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Base water */}
      <div className="absolute inset-0 bg-abyss" />

      {/* Radar sweep: single revolution, then gone */}
      {!reduced && !isMobile && phase >= 2 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="animate-radar h-[160vmax] w-[160vmax] rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(63,169,245,0) 0deg, rgba(63,169,245,0) 300deg, rgba(63,169,245,0.35) 350deg, rgba(143,211,255,0.6) 358deg, rgba(63,169,245,0) 360deg)",
              maskImage: "radial-gradient(circle at center, black 40%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 75%)",
            }}
          />
        </div>
      )}

      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: phase >= 1 ? 1 : 0 }}
      >
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 200, center: [15, 15] }}
          width={1200}
          height={620}
          style={{ width: "100%", height: "100%" }}
        >
          <Graticule stroke="#1B2C47" strokeWidth={0.4} strokeOpacity={0.35} />

          <g
            style={{
              opacity: phase >= 2 ? 1 : 0,
              transition: "opacity 900ms ease-out",
            }}
          >
            <Geographies geography={TOPO_URL}>
              {({ geographies }: any) =>
                geographies.map((geo: any) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#12203A"
                    stroke="#2A4370"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
          </g>

          {/* Event markers ignite one by one */}
          {phase >= 3 &&
            shown.map((m, i) => (
              <Marker key={m.id} coordinates={m.coords}>
                <g
                  className={reduced ? "" : "animate-ignite"}
                  style={{
                    animationDelay: reduced ? "0s" : `${i * 80}ms`,
                  }}
                >
                  <circle r={7} fill="#3FA9F5" fillOpacity={0.08} />
                  <circle r={3.5} fill="#3FA9F5" fillOpacity={0.35} />
                  <circle
                    r={1.6}
                    fill="#8FD3FF"
                    className={reduced ? "" : "animate-ambient"}
                    style={{ transformOrigin: "center", animationDelay: `${1600 + i * 80}ms` }}
                  />
                </g>
              </Marker>
            ))}
        </ComposableMap>
      </div>

      {/* Vignette to dissolve edges into the page */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(5,10,24,0.7) 85%, #050A18 100%)",
        }}
      />
      {/* Bottom fade so hero copy sits on darker ground */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
        style={{ background: "linear-gradient(to bottom, transparent, #050A18)" }}
      />
    </div>
  );
}
