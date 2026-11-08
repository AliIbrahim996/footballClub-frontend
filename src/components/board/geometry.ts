import type { BoardItem } from "@/lib/types";
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
