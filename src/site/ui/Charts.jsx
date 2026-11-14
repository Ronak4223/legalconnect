import { useId } from "react";
import { money } from "../utils/format.js";

const W = 640;
/** Smooth area/line chart from [{label, value}]. Pure SVG, scales to its container. */
export function AreaChart({ data, height = 220, fmt = money, color = "var(--c1)" }) {
  const gid = useId();
  const pad = { l: 8, r: 8, t: 14, b: 26 }, h = height;
  const max = Math.max(...data.map((d) => d.value), 1) * 1.12;
  const x = (i) => pad.l + (i * (W - pad.l - pad.r)) / Math.max(1, data.length - 1);
  const y = (v) => pad.t + (1 - v / max) * (h - pad.t - pad.b);
  const pts = data.map((d, i) => [x(i), y(d.value)]);
  const path = pts.reduce((a, p, i, arr) => { if (!i) return `M${p[0]},${p[1]}`; const q = arr[i - 1], cx = (q[0] + p[0]) / 2; return `${a} C${cx},${q[1]} ${cx},${p[1]} ${p[0]},${p[1]}`; }, "");
  return (
    <svg viewBox={`0 0 ${W} ${h}`} className="chart" role="img" aria-label={`Chart: ${data.map((d) => `${d.label} ${fmt(d.value)}`).join(", ")}`}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".28" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {[0.25, 0.5, 0.75, 1].map((g) => <line key={g} x1={pad.l} x2={W - pad.r} y1={pad.t + (1 - g / 1.12) * (h - pad.t - pad.b)} y2={pad.t + (1 - g / 1.12) * (h - pad.t - pad.b)} className="grid-l" />)}
      <path d={`${path} L${x(data.length - 1)},${h - pad.b} L${x(0)},${h - pad.b} Z`} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      {pts.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r="3.4" fill="var(--surface)" stroke={color} strokeWidth="2"><title>{`${data[i].label}: ${fmt(data[i].value)}`}</title></circle></g>)}
      {data.map((d, i) => (i % Math.ceil(data.length / 8) === 0 || i === data.length - 1) && <text key={i} x={x(i)} y={h - 7} textAnchor="middle" className="ax">{d.label}</text>)}
    </svg>
  );
}
export function BarChart({ data, height = 180, fmt = (v) => v, color = "var(--c1)" }) {
  const pad = { l: 8, r: 8, t: 10, b: 26 }, h = height, max = Math.max(...data.map((d) => d.value), 1) * 1.15;
  const bw = (W - pad.l - pad.r) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${h}`} className="chart" role="img" aria-label={`Bar chart: ${data.map((d) => `${d.label} ${fmt(d.value)}`).join(", ")}`}>
      {[0.5, 1].map((g) => <line key={g} x1={pad.l} x2={W - pad.r} y1={pad.t + (1 - g / 1.15) * (h - pad.t - pad.b)} y2={pad.t + (1 - g / 1.15) * (h - pad.t - pad.b)} className="grid-l" />)}
      {data.map((d, i) => { const bh = (d.value / max) * (h - pad.t - pad.b); return (
        <g key={i}><rect x={pad.l + i * bw + bw * 0.22} y={h - pad.b - bh} width={bw * 0.56} height={bh} rx="3" fill={d.accent ? "var(--gold)" : color}><title>{`${d.label}: ${fmt(d.value)}`}</title></rect>
          <text x={pad.l + i * bw + bw / 2} y={h - 8} textAnchor="middle" className="ax">{d.label}</text></g>); })}
    </svg>
  );
}
export function Donut({ segments, size = 150, center, sub }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1, r = 52, c = 2 * Math.PI * r; let off = 0;
  return (
    <div className="donut" style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140" role="img" aria-label={`Breakdown: ${segments.map((s) => `${s.label} ${s.value}`).join(", ")}`}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--line)" strokeWidth="14" />
        {segments.map((s) => { const len = (s.value / total) * c; const el = <circle key={s.label} cx="70" cy="70" r={r} fill="none" stroke={s.color} strokeWidth="14" strokeDasharray={`${Math.max(0, len - 2)} ${c}`} strokeDashoffset={-off} transform="rotate(-90 70 70)"><title>{`${s.label}: ${s.value}`}</title></circle>; off += len; return el; })}
      </svg>
      <div className="donut-c"><b>{center}</b><small>{sub}</small></div>
    </div>
  );
}
export function Spark({ data, w = 110, h = 30, color = "currentColor" }) {
  const max = Math.max(...data), min = Math.min(...data), n = data.length;
  const p = data.map((v, i) => `${(i * (w - 2)) / (n - 1) + 1},${h - 3 - ((v - min) / Math.max(1, max - min)) * (h - 6)}`).join(" ");
  return <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="spark" aria-hidden="true"><polyline points={p} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
