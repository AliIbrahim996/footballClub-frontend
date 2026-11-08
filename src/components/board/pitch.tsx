import type { PitchKind } from "@/lib/types";

/** Logical pitch size. All board coordinates live in this space (home attacks to the right). */
export const PITCH_W = 1050;
export const PITCH_H = 680;

export const VIEWBOX: Record<PitchKind, [number, number, number, number]> = {
  full: [0, 0, PITCH_W, PITCH_H],
  half: [525, 0, 525, PITCH_H],
  box: [690, 110, 360, 460],
  blank: [0, 0, PITCH_W, PITCH_H],
};

const L = 20, T = 20, R = 1030, B = 660; // touchline rectangle
const CY = (T + B) / 2, CX = (L + R) / 2;
const M = (R - L) / 105; // pixels per metre

function Goalmouth({ side }: { side: "left" | "right" }) {
  const dir = side === "left" ? 1 : -1;
  const x0 = side === "left" ? L : R;
  const pa = 16.5 * M, pw = 40.32 * M, ga = 5.5 * M, gw = 18.32 * M, spot = 11 * M, r = 9.15 * M;
  const arcDy = Math.sqrt(r * r - (pa - spot) ** 2);
  return (
    <g>
      <rect x={Math.min(x0, x0 + dir * pa)} y={CY - pw / 2} width={pa} height={pw} />
      <rect x={Math.min(x0, x0 + dir * ga)} y={CY - gw / 2} width={ga} height={gw} />
      <circle cx={x0 + dir * spot} cy={CY} r={3} fill="#fff" stroke="none" />
      <path d={`M ${x0 + dir * pa} ${CY - arcDy} A ${r} ${r} 0 0 ${side === "left" ? 1 : 0} ${x0 + dir * pa} ${CY + arcDy}`} />
    </g>
  );
}

export function Pitch({ kind }: { kind: PitchKind }) {
  const stripes = Array.from({ length: 14 }, (_, i) => i);
  return (
    <g>
      <rect x={0} y={0} width={PITCH_W} height={PITCH_H} fill="#2f7d3a" />
      {kind !== "blank" && stripes.map((i) => (
        <rect key={i} x={(PITCH_W / 14) * i} y={0} width={PITCH_W / 14} height={PITCH_H} fill={i % 2 ? "#33853f" : "#2f7d3a"} />
      ))}
      {kind !== "blank" && (
        <g fill="none" stroke="#ffffff" strokeOpacity={0.85} strokeWidth={3}>
          <rect x={L} y={T} width={R - L} height={B - T} />
          <path d={`M ${CX} ${T} V ${B}`} />
          <circle cx={CX} cy={CY} r={9.15 * M} />
          <circle cx={CX} cy={CY} r={3} fill="#fff" stroke="none" />
          <Goalmouth side="left" />
          <Goalmouth side="right" />
        </g>
      )}
    </g>
  );
}
