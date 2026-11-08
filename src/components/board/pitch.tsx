import type { PitchKind } from "@/lib/types";

/** Logical landscape pitch size. All board coordinates live in this space (home attacks to the right). */
export const PITCH_W = 1050;
export const PITCH_H = 680;

type Spec = {
  vb: [number, number, number, number];
  portrait: boolean;
  theme: "green" | "plain" | "grey" | "white" | "blue";
  lines: "football" | "futsal" | "none";
};

/** Every selectable playing field. Portrait fields are the landscape drawing rotated 90°. */
export const PITCHES: Record<PitchKind, Spec> = {
  full: { vb: [0, 0, PITCH_W, PITCH_H], portrait: false, theme: "green", lines: "football" },
  half: { vb: [525, 0, 525, PITCH_H], portrait: false, theme: "green", lines: "football" },
  box: { vb: [690, 110, 360, 460], portrait: false, theme: "green", lines: "football" },
  fullPortrait: { vb: [0, 0, PITCH_H, PITCH_W], portrait: true, theme: "green", lines: "football" },
  halfPortrait: { vb: [0, 525, PITCH_H, 525], portrait: true, theme: "green", lines: "football" },
  blank: { vb: [0, 0, PITCH_W, PITCH_H], portrait: false, theme: "plain", lines: "none" },
  grey: { vb: [0, 0, PITCH_W, PITCH_H], portrait: false, theme: "grey", lines: "football" },
  white: { vb: [0, 0, PITCH_W, PITCH_H], portrait: false, theme: "white", lines: "none" },
  whitePortrait: { vb: [0, 0, PITCH_H, PITCH_W], portrait: true, theme: "white", lines: "none" },
  futsal: { vb: [0, 0, PITCH_W, PITCH_H], portrait: false, theme: "blue", lines: "futsal" },
  futsalPortrait: { vb: [0, 0, PITCH_H, PITCH_W], portrait: true, theme: "blue", lines: "futsal" },
};
export const PITCH_KINDS = Object.keys(PITCHES) as PitchKind[];
export const VIEWBOX = Object.fromEntries(PITCH_KINDS.map((k) => [k, PITCHES[k].vb])) as Record<PitchKind, Spec["vb"]>;

const THEMES = {
  green: { a: "#2f7d3a", b: "#33853f", line: "#ffffff", stripes: true },
  plain: { a: "#2f7d3a", b: "#2f7d3a", line: "#ffffff", stripes: false },
  grey: { a: "#e5e7eb", b: "#d9dce1", line: "#6b7280", stripes: true },
  white: { a: "#ffffff", b: "#ffffff", line: "#9ca3af", stripes: false },
  blue: { a: "#7aa0d8", b: "#7aa0d8", line: "#ffffff", stripes: false },
} as const;

const L = 20, T = 20, R = 1030, B = 660; // touchline rectangle (football)
const CY = (T + B) / 2, CX = (L + R) / 2;
const M = (R - L) / 105; // pixels per metre

function FootballLines() {
  const pa = 16.5 * M, pw = 40.32 * M, ga = 5.5 * M, gw = 18.32 * M, spot = 11 * M, r = 9.15 * M;
  const arcDy = Math.sqrt(r * r - (pa - spot) ** 2);
  const side = (s: 1 | -1) => {
    const x0 = s === 1 ? L : R;
    return (
      <g>
        <rect x={Math.min(x0, x0 + s * pa)} y={CY - pw / 2} width={pa} height={pw} />
        <rect x={Math.min(x0, x0 + s * ga)} y={CY - gw / 2} width={ga} height={gw} />
        <circle cx={x0 + s * spot} cy={CY} r={3} fill="currentColor" stroke="none" />
        <path d={`M ${x0 + s * pa} ${CY - arcDy} A ${r} ${r} 0 0 ${s === 1 ? 1 : 0} ${x0 + s * pa} ${CY + arcDy}`} />
      </g>
    );
  };
  return (
    <g>
      <rect x={L} y={T} width={R - L} height={B - T} />
      <path d={`M ${CX} ${T} V ${B}`} />
      <circle cx={CX} cy={CY} r={r} />
      <circle cx={CX} cy={CY} r={3} fill="currentColor" stroke="none" />
      {side(1)}
      {side(-1)}
    </g>
  );
}

/** Futsal / handball style court: 40 x 20 m with 6 m goal-area arcs. */
function FutsalLines() {
  const m = 24, x1 = 45, x2 = 1005, y1 = 100, y2 = 580, cy = 340, cx = 525;
  const post = 1.5 * m, rad = 6 * m;
  const side = (s: 1 | -1) => {
    const x0 = s === 1 ? x1 : x2;
    const sw = s === 1 ? 1 : 0;
    return (
      <g>
        <path d={`M ${x0} ${cy - post - rad} A ${rad} ${rad} 0 0 ${sw} ${x0 + s * rad} ${cy - post} V ${cy + post} A ${rad} ${rad} 0 0 ${sw} ${x0} ${cy + post + rad}`} />
        <circle cx={x0 + s * 6 * m} cy={cy} r={3} fill="currentColor" stroke="none" />
        <circle cx={x0 + s * 10 * m} cy={cy} r={3} fill="currentColor" stroke="none" />
      </g>
    );
  };
  return (
    <g>
      <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} />
      <path d={`M ${cx} ${y1} V ${y2}`} />
      <circle cx={cx} cy={cy} r={3 * m} />
      {side(1)}
      {side(-1)}
    </g>
  );
}

export function Pitch({ kind }: { kind: PitchKind }) {
  const spec = PITCHES[kind];
  const th = THEMES[spec.theme];
  const stripes = Array.from({ length: 14 }, (_, i) => i);
  const drawing = (
    <g>
      <rect x={0} y={0} width={PITCH_W} height={PITCH_H} fill={th.a} />
      {th.stripes && stripes.map((i) => (
        <rect key={i} x={(PITCH_W / 14) * i} y={0} width={PITCH_W / 14} height={PITCH_H} fill={i % 2 ? th.b : th.a} />
      ))}
      {spec.lines !== "none" && (
        <g fill="none" stroke={th.line} strokeOpacity={0.9} strokeWidth={3} color={th.line}>
          {spec.lines === "futsal" ? <FutsalLines /> : <FootballLines />}
        </g>
      )}
    </g>
  );
  // (x, y) in landscape -> (PITCH_H - y, x) in portrait.
  return spec.portrait ? <g transform={`translate(${PITCH_H} 0) rotate(90)`}>{drawing}</g> : drawing;
}
