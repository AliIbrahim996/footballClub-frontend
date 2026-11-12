import type { BoardItem, BoardStep } from "@/lib/types";
import { PITCH_H, PITCH_W } from "./pitch";

export const uid = () => Math.random().toString(36).slice(2, 9);

export const FORMATIONS: Record<string, number[]> = {
  "4-4-2": [4, 4, 2],
  "4-3-3": [4, 3, 3],
  "3-5-2": [3, 5, 2],
  "4-2-3-1": [4, 2, 3, 1],
  "5-3-2": [5, 3, 2],
};

/** Build 11 players for a formation. Home attacks right; away is mirrored. */
export function formation(name: string, team: "home" | "away"): BoardItem[] {
  const lines = FORMATIONS[name];
  const cols = lines.length + 1;
  const xs = Array.from({ length: cols }, (_, i) => 90 + (i * (470 - 90)) / (cols - 1));
  const items: BoardItem[] = [];
  const mirror = (x: number) => (team === "home" ? x : PITCH_W - x);
  let n = 1;
  items.push({ id: uid(), kind: "player", team, label: String(n++), x: mirror(xs[0]), y: PITCH_H / 2 });
  lines.forEach((count, li) => {
    for (let i = 0; i < count; i++) {
      items.push({
        id: uid(), kind: "player", team, label: String(n++),
        x: mirror(xs[li + 1]), y: (PITCH_H * (i + 1)) / (count + 1),
      });
    }
  });
  return items;
}

// Formations need a full-size 11-a-side field; portrait fields are the landscape layout rotated 90 degrees.
const LANDSCAPE_11 = new Set(["full", "blank", "grey", "white"]);
const PORTRAIT_11 = new Set(["fullPortrait", "whitePortrait"]);
export const formationFits = (pitch: string) => LANDSCAPE_11.has(pitch) || PORTRAIT_11.has(pitch);

/**
 * Put one team into a formation. Players already on the board keep their identity (so simulation steps that move
 * them still apply) and are reordered by shirt number; missing players are added, surplus players removed.
 */
export function arrangeFormation(items: BoardItem[], name: string, team: "home" | "away", pitch: string): BoardItem[] {
  const portrait = PORTRAIT_11.has(pitch);
  const spots = formation(name, team).map((p) => (portrait && p.kind === "player" ? { ...p, x: PITCH_H - p.y, y: p.x } : p));
  const isTeam = (i: BoardItem) => i.kind === "player" && i.team === team;
  const existing = items.filter(isTeam).sort((a, b) => num(a) - num(b));
  const placed = spots.map((s, i) => {
    const old = existing[i];
    return old && old.kind === "player" && s.kind === "player" ? { ...old, x: s.x, y: s.y, label: s.label } : s;
  });
  return [...items.filter((i) => !isTeam(i)), ...placed];
}
const num = (i: BoardItem) => (i.kind === "player" ? Number(i.label) || 99 : 99);

/** A zig-zag path between two points, used for dribbles. */
export function wavy([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const steps = Math.max(2, Math.round(len / 14));
  const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
  let d = `M ${x1} ${y1}`;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const off = i === steps ? 0 : (i % 2 ? 1 : -1) * 6;
    d += ` L ${x1 + (x2 - x1) * t + nx * off} ${y1 + (y2 - y1) * t + ny * off}`;
  }
  return d;
}

export async function svgToPng(svg: SVGSVGElement, scale = 2): Promise<Blob> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.querySelectorAll("[data-ui]").forEach((n) => n.remove());
  const vb = svg.viewBox.baseVal;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(vb.width * scale));
  clone.setAttribute("height", String(vb.height * scale));
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    await new Promise<void>((ok, fail) => { img.onload = () => ok(); img.onerror = () => fail(new Error("render")); img.src = url; });
    const canvas = document.createElement("canvas");
    canvas.width = vb.width * scale;
    canvas.height = vb.height * scale;
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((ok, fail) => canvas.toBlob((b) => (b ? ok(b) : fail(new Error("png"))), "image/png"));
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * CSS-equivalent cubic-bezier easing for JavaScript animation (Newton-Raphson with a bisection fallback).
 * The board playback uses the same strong ease-in-out curve as the CSS token --ease-in-out.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-6) return sampleY(t);
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    let lo = 0, hi = 1;
    t = x;
    while (hi - lo > 1e-6) {
      if (sampleX(t) < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return sampleY(t);
  };
}
export const easeInOut = cubicBezier(0.77, 0, 0.175, 1);

export type Positions = Record<string, [number, number]>;

/** Absolute positions of every movable item at each step (index 0 = the board as drawn). */
export function stepPositions(items: BoardItem[], steps: BoardStep[] = []): Positions[] {
  const base: Positions = {};
  for (const it of items) if (it.kind !== "arrow") base[it.id] = [it.x, it.y];
  const out = [base];
  for (const s of steps) {
    const prev = out[out.length - 1];
    const next: Positions = { ...prev };
    for (const [id, p] of Object.entries(s.pos)) if (id in prev) next[id] = p;
    out.push(next);
  }
  return out;
}
