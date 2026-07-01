import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TimeSeries } from "@/lib/chokepoint-types";

const COLORS = ["#EF9F27", "#1D9E75", "#E24B4A", "#9E9B90", "#7EB6FF"];

export function TimeseriesChart({ ts }: { ts: TimeSeries }) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const data = ts.days.map((d, i) => {
    const row: Record<string, number> = { day: d };
    ts.series.forEach((s) => {
      row[s.sector] = s.values[i];
    });
    return row;
  });

  const toggle = (name: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="border border-hairline bg-panel p-3">
      {/* Clickable legend */}
      <div className="mb-2 flex flex-wrap gap-2">
        {ts.series.map((s, i) => {
          const off = hidden.has(s.sector);
          const color = COLORS[i % COLORS.length];
          return (
            <button
              key={s.sector}
              type="button"
              onClick={() => toggle(s.sector)}
              className={`mono flex items-center gap-1.5 border px-2 py-0.5 text-[10.5px] transition-colors ${
                off ? "border-hairline text-text-muted opacity-60" : "border-hairline text-text-primary"
              }`}
            >
              <span className="h-0.5 w-4" style={{ background: color }} />
              {s.sector}
            </button>
          );
        })}
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 20 }}>
            <CartesianGrid stroke="#312F28" strokeDasharray="2 4" />
            <XAxis
              dataKey="day"
              stroke="#6F6C63"
              tick={{ fill: "#9E9B90", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}
              label={{ value: "Trading days from event (0 = event day)", position: "insideBottom", offset: -8, fill: "#9E9B90", fontSize: 10 }}
            />
            <YAxis
              stroke="#6F6C63"
              tick={{ fill: "#9E9B90", fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}
              tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
              label={{ value: "Move beyond the market (%)", angle: -90, position: "insideLeft", fill: "#9E9B90", fontSize: 10, offset: 12 }}
            />
            <Tooltip
              contentStyle={{
                background: "#1F1E18",
                border: "1px solid #312F28",
                fontSize: 11,
                fontFamily: "JetBrains Mono, monospace",
                color: "#ECEAE3",
              }}
              labelFormatter={(l) => `Day ${l}`}
              formatter={(v: number, name: string) => [`${v > 0 ? "+" : ""}${v}%`, name]}
            />
            <ReferenceLine y={0} stroke="#6F6C63" strokeWidth={1} />
            {ts.markers.map((m) => (
              <ReferenceLine
                key={`${m.day}-${m.label}`}
                x={m.day}
                stroke="#EF9F27"
                strokeDasharray="3 3"
                strokeOpacity={0.6}
                label={{ value: m.label, fill: "#EF9F27", fontSize: 9, position: "top" }}
              />
            ))}
            {ts.series.map((s, i) => (
              <Line
                key={s.sector}
                type="monotone"
                dataKey={s.sector}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={false}
                hide={hidden.has(s.sector)}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}