"use client";

import {
  ArrowRight, Circle, Cone, Download, Eraser, MousePointer2, MoveUpRight, Redo2, Save, Square, Trash2, Type, Undo2, Waves,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { call } from "@/lib/client";
import type { BoardItem, BoardState, PitchKind, Plan } from "@/lib/types";
import { Button, Card, Field, Input } from "../ui";
import { FORMATIONS, formation, svgToPng, uid, wavy } from "./geometry";
import { Pitch, VIEWBOX } from "./pitch";

type Tool = "select" | "home" | "away" | "neutral" | "ball" | "cone" | "goal" | "run" | "pass" | "dribble" | "zone" | "text" | "erase";
const TEAM_COLOR = { home: "#2563eb", away: "#dc2626", neutral: "#f59e0b" } as const;
const PITCHES: PitchKind[] = ["full", "half", "box", "blank"];
const EMPTY: BoardState = { pitch: "full", items: [] };

export function TacticsBoard({ plan }: { plan?: Plan }) {
  const t = useTranslations("tactics");
  const svgRef = useRef<SVGSVGElement>(null);
  const [board, setBoard] = useState<BoardState>({ ...EMPTY, ...plan?.board, items: plan?.board?.items ?? [] });
  const [past, setPast] = useState<BoardState[]>([]);
  const [future, setFuture] = useState<BoardState[]>([]);
  const [tool, setTool] = useState<Tool>("select");
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<BoardItem | null>(null);
  const drag = useRef<{ id: string; dx: number; dy: number; before: BoardState } | null>(null);
  const [planId, setPlanId] = useState<number | undefined>(plan?.id);
  const [title, setTitle] = useState(plan?.title ?? "");
  const [comment, setComment] = useState(plan?.comment ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [fname, setFname] = useState("4-4-2");

  const commit = (next: BoardState, before: BoardState = board) => {
    setPast((p) => [...p.slice(-49), before]);
    setFuture([]);
    setBoard(next);
    setStatus("idle");
  };

  const undo = () => {
    setPast((p) => {
      if (!p.length) return p;
      setFuture((f) => [board, ...f]);
      setBoard(p[p.length - 1]);
      return p.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture((f) => {
      if (!f.length) return f;
      setPast((p) => [...p, board]);
      setBoard(f[0]);
      return f.slice(1);
    });
  };

  const removeSelected = () => {
    if (!selected) return;
    commit({ ...board, items: board.items.filter((i) => i.id !== selected) });
    setSelected(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") { e.preventDefault(); redo(); }
      else if (e.key === "Delete" || e.key === "Backspace") removeSelected();
      else if (e.key === "Escape") { setSelected(null); setTool("select"); setDraft(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const point = (e: React.PointerEvent): [number, number] => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return [Math.round(p.x), Math.round(p.y)];
  };

  const countTeam = (team: string) => board.items.filter((i) => i.kind === "player" && i.team === team).length;

  function onBackgroundDown(e: React.PointerEvent) {
    const [x, y] = point(e);
    setSelected(null);
    if (tool === "home" || tool === "away" || tool === "neutral") {
      commit({ ...board, items: [...board.items, { id: uid(), kind: "player", team: tool, label: String(Math.min(99, countTeam(tool) + 1)), x, y }] });
    } else if (tool === "ball" || tool === "cone" || tool === "goal") {
      commit({ ...board, items: [...board.items, { id: uid(), kind: tool, x, y }] });
    } else if (tool === "text") {
      const text = window.prompt(t("textPrompt"));
      if (text) commit({ ...board, items: [...board.items, { id: uid(), kind: "text", x, y, text }] });
    } else if (tool === "run" || tool === "pass" || tool === "dribble") {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      setDraft({ id: uid(), kind: "arrow", style: tool, points: [[x, y], [x, y]] });
    } else if (tool === "zone") {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      setDraft({ id: uid(), kind: "zone", x, y, w: 0, h: 0 });
    }
  }

  function onItemDown(e: React.PointerEvent, item: BoardItem) {
    e.stopPropagation();
    if (tool === "erase") { commit({ ...board, items: board.items.filter((i) => i.id !== item.id) }); return; }
    setSelected(item.id);
    if (item.kind === "arrow") return;
    const [x, y] = point(e);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    drag.current = { id: item.id, dx: item.x - x, dy: item.y - y, before: board };
  }

  function onMove(e: React.PointerEvent) {
    const [x, y] = point(e);
    if (drag.current) {
      const { id, dx, dy } = drag.current;
      setBoard((b) => ({ ...b, items: b.items.map((i) => (i.id === id && i.kind !== "arrow" ? { ...i, x: x + dx, y: y + dy } : i)) }));
    } else if (draft?.kind === "arrow") {
      setDraft({ ...draft, points: [draft.points[0], [x, y]] });
    } else if (draft?.kind === "zone") {
      setDraft({ ...draft, w: x - draft.x, h: y - draft.y });
    }
  }

  function onUp() {
    if (drag.current) {
      const { before } = drag.current;
      drag.current = null;
      setPast((p) => [...p.slice(-49), before]);
      setFuture([]);
      setStatus("idle");
    } else if (draft) {
      const ok = draft.kind === "arrow"
        ? Math.hypot(draft.points[1][0] - draft.points[0][0], draft.points[1][1] - draft.points[0][1]) > 14
        : draft.kind === "zone" && Math.abs(draft.w) > 14 && Math.abs(draft.h) > 14;
      if (ok) {
        const item = draft.kind === "zone"
          ? { ...draft, x: Math.min(draft.x, draft.x + draft.w), y: Math.min(draft.y, draft.y + draft.h), w: Math.abs(draft.w), h: Math.abs(draft.h) }
          : draft;
        commit({ ...board, items: [...board.items, item] });
      }
      setDraft(null);
    }
  }

  function editLabel(item: BoardItem) {
    if (item.kind === "player") {
      const v = window.prompt(t("labelPrompt"), item.label);
      if (v !== null) commit({ ...board, items: board.items.map((i) => (i.id === item.id ? { ...item, label: v.slice(0, 3) } : i)) });
    } else if (item.kind === "text") {
      const v = window.prompt(t("textPrompt"), item.text);
      if (v) commit({ ...board, items: board.items.map((i) => (i.id === item.id ? { ...item, text: v } : i)) });
    }
  }

  async function exportPng() {
    const blob = await svgToPng(svgRef.current!);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title || "tactic"}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function save() {
    setStatus("saving");
    try {
      setSelected(null);
      await new Promise((r) => requestAnimationFrame(r));
      const blob = await svgToPng(svgRef.current!);
      const fd = new FormData();
      fd.set("image", blob, "tactic.png");
      fd.set("title", title);
      fd.set("comment", comment || title || t("untitled"));
      fd.set("board", JSON.stringify(board));
      const saved = await call<Plan>(planId ? `/plans/${planId}/` : "/plans/", { method: planId ? "PATCH" : "POST", body: fd });
      setPlanId(saved.id);
      window.history.replaceState(null, "", `?plan=${saved.id}`);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  const tools: { id: Tool; label: string; icon: React.ReactNode }[] = useMemo(() => [
    { id: "select", label: t("tools.select"), icon: <MousePointer2 size={18} /> },
    { id: "home", label: t("tools.home"), icon: <Circle size={18} fill={TEAM_COLOR.home} stroke="none" /> },
    { id: "away", label: t("tools.away"), icon: <Circle size={18} fill={TEAM_COLOR.away} stroke="none" /> },
    { id: "neutral", label: t("tools.neutral"), icon: <Circle size={18} fill={TEAM_COLOR.neutral} stroke="none" /> },
    { id: "ball", label: t("tools.ball"), icon: <Circle size={18} /> },
    { id: "cone", label: t("tools.cone"), icon: <Cone size={18} /> },
    { id: "goal", label: t("tools.goal"), icon: <Square size={18} /> },
    { id: "run", label: t("tools.run"), icon: <MoveUpRight size={18} strokeDasharray="3 2" /> },
    { id: "pass", label: t("tools.pass"), icon: <ArrowRight size={18} /> },
    { id: "dribble", label: t("tools.dribble"), icon: <Waves size={18} /> },
    { id: "zone", label: t("tools.zone"), icon: <Square size={18} strokeDasharray="3 2" /> },
    { id: "text", label: t("tools.text"), icon: <Type size={18} /> },
    { id: "erase", label: t("tools.erase"), icon: <Eraser size={18} /> },
  ], [t]);

  const [vx, vy, vw, vh] = VIEWBOX[board.pitch];
  const all = draft ? [...board.items, draft] : board.items;

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
      <div className="min-w-0 space-y-3">
        {/* Toolbar */}
        <Card className="flex items-center gap-1 overflow-x-auto p-2" role="toolbar" aria-label={t("toolbar")}>
          {tools.map((x) => (
            <button
              key={x.id} type="button" title={x.label} aria-label={x.label} aria-pressed={tool === x.id}
              onClick={() => setTool(x.id)}
              className={`grid size-10 shrink-0 place-items-center rounded-lg transition-colors ${tool === x.id ? "bg-accent text-accent-fg" : "text-fg hover:bg-surface-2"}`}
            >{x.icon}</button>
          ))}
          <span className="mx-1 h-6 w-px shrink-0 bg-line" />
          <button type="button" aria-label={t("undo")} title={t("undo")} disabled={!past.length} onClick={undo} className="grid size-10 shrink-0 place-items-center rounded-lg hover:bg-surface-2 disabled:opacity-40"><Undo2 size={18} /></button>
          <button type="button" aria-label={t("redo")} title={t("redo")} disabled={!future.length} onClick={redo} className="grid size-10 shrink-0 place-items-center rounded-lg hover:bg-surface-2 disabled:opacity-40"><Redo2 size={18} /></button>
          <button type="button" aria-label={t("deleteSelected")} title={t("deleteSelected")} disabled={!selected} onClick={removeSelected} className="grid size-10 shrink-0 place-items-center rounded-lg text-danger hover:bg-danger/10 disabled:opacity-40"><Trash2 size={18} /></button>
        </Card>

        {/* Board */}
        <div className="overflow-hidden rounded-2xl border border-line bg-[#2f7d3a] shadow-sm">
          <svg
            ref={svgRef}
            viewBox={`${vx} ${vy} ${vw} ${vh}`}
            className={`block w-full touch-none select-none ${tool === "select" ? "cursor-default" : "cursor-crosshair"}`}
            role="img" aria-label={t("boardLabel")}
            onPointerDown={onBackgroundDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
          >
            <defs>
              {["#ffffff", "#fde047"].map((c) => (
                <marker key={c} id={`ah${c.slice(1)}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill={c} />
                </marker>
              ))}
            </defs>
            <Pitch kind={board.pitch} />
            {all.map((item) => (
              <g key={item.id} onPointerDown={(e) => onItemDown(e, item)} onDoubleClick={() => editLabel(item)} className={tool === "erase" ? "cursor-pointer" : "cursor-grab"}>
                <Item item={item} />
                {selected === item.id && <Selection item={item} />}
              </g>
            ))}
          </svg>
        </div>
        <p className="text-xs text-muted">{t("hint")}</p>
      </div>

      {/* Side panel */}
      <div className="space-y-4">
        <Card className="space-y-4 p-4">
          <h2 className="font-semibold">{t("pitch")}</h2>
          <div className="grid grid-cols-4 gap-1.5" role="radiogroup" aria-label={t("pitch")}>
            {PITCHES.map((p) => (
              <button
                key={p} type="button" role="radio" aria-checked={board.pitch === p}
                onClick={() => commit({ ...board, pitch: p })}
                className={`h-9 rounded-lg border px-1 text-xs font-medium ${board.pitch === p ? "border-accent bg-accent-soft text-accent" : "border-line hover:bg-surface-2"}`}
              >{t(`pitches.${p}`)}</button>
            ))}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="formation">{t("formation")}</label>
            <div className="flex gap-2">
              <select id="formation" value={fname} onChange={(e) => setFname(e.target.value)} className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-surface px-2 text-sm">
                {Object.keys(FORMATIONS).map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["home", "away"] as const).map((team) => (
                <Button
                  key={team} variant="secondary" className="h-9 px-2 text-xs" disabled={board.pitch !== "full"}
                  onClick={() => commit({ ...board, items: [...board.items.filter((i) => !(i.kind === "player" && i.team === team)), ...formation(fname, team)] })}
                >{t(`place.${team}`)}</Button>
              ))}
            </div>
          </div>
          <Button variant="ghost" className="w-full" onClick={() => { commit({ ...board, items: [] }); setSelected(null); }} disabled={!board.items.length}>{t("clear")}</Button>
        </Card>

        <Card className="space-y-3 p-4">
          <h2 className="font-semibold">{t("savePlan")}</h2>
          <Field label={t("titleLabel")}><Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} /></Field>
          <Field label={t("commentLabel")}><Input value={comment} onChange={(e) => setComment(e.target.value)} maxLength={255} /></Field>
          <div className="flex gap-2">
            <Button onClick={save} disabled={status === "saving"} className="flex-1"><Save size={16} aria-hidden /> {status === "saving" ? t("saving") : planId ? t("update") : t("save")}</Button>
            <Button variant="secondary" onClick={exportPng} aria-label={t("exportPng")} title={t("exportPng")}><Download size={16} /></Button>
          </div>
          <p role="status" className="min-h-5 text-sm">
            {status === "saved" && <span className="text-accent">{t("saved")}</span>}
            {status === "error" && <span className="text-danger">{t("saveError")}</span>}
          </p>
        </Card>
      </div>
    </div>
  );
}

function Item({ item }: { item: BoardItem }) {
  switch (item.kind) {
    case "player":
      return (
        <g>
          <circle cx={item.x} cy={item.y} r={19} fill={TEAM_COLOR[item.team]} stroke="#fff" strokeWidth={3} />
          <text x={item.x} y={item.y} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={item.label.length > 2 ? 13 : 17} fontWeight={700} fontFamily="Arial, sans-serif">{item.label}</text>
        </g>
      );
    case "ball":
      return (
        <g>
          <circle cx={item.x} cy={item.y} r={11} fill="#fff" stroke="#111" strokeWidth={2} />
          <path d={`M ${item.x} ${item.y - 5} l 5 4 l -2 6 h -6 l -2 -6 z`} fill="#111" />
        </g>
      );
    case "cone":
      return <path d={`M ${item.x} ${item.y - 14} L ${item.x + 12} ${item.y + 11} H ${item.x - 12} Z`} fill="#f97316" stroke="#fff" strokeWidth={2} strokeLinejoin="round" />;
    case "goal":
      return (
        <g stroke="#fff" strokeWidth={3} fill="rgba(255,255,255,.15)">
          <rect x={item.x - 40} y={item.y - 14} width={80} height={28} rx={2} />
          <path d={`M ${item.x - 20} ${item.y - 14} v 28 M ${item.x} ${item.y - 14} v 28 M ${item.x + 20} ${item.y - 14} v 28`} strokeWidth={1.5} />
        </g>
      );
    case "zone":
      return <rect x={item.x} y={item.y} width={Math.abs(item.w)} height={Math.abs(item.h)} fill="rgba(253,224,71,.18)" stroke="#fde047" strokeWidth={3} strokeDasharray="10 8" rx={4} />;
    case "text":
      return <text x={item.x} y={item.y} fill="#fff" stroke="rgba(0,0,0,.55)" strokeWidth={4} paintOrder="stroke" fontSize={24} fontWeight={700} fontFamily="Arial, sans-serif">{item.text}</text>;
    case "arrow": {
      const [a, b] = item.points;
      const color = item.style === "pass" ? "#ffffff" : "#fde047";
      const common = { fill: "none", stroke: color, strokeWidth: 4, strokeLinecap: "round" as const, markerEnd: `url(#ah${color.slice(1)})` };
      return (
        <g>
          {/* wide invisible hit area so thin lines are easy to select/erase */}
          <path d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke="transparent" strokeWidth={22} fill="none" />
          {item.style === "dribble" ? <path d={wavy(a, b)} {...common} /> : <path d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} {...common} strokeDasharray={item.style === "run" ? "12 9" : undefined} />}
        </g>
      );
    }
  }
}

function Selection({ item }: { item: BoardItem }) {
  const props = { "data-ui": true, fill: "none", stroke: "#38bdf8", strokeWidth: 3, strokeDasharray: "5 4", pointerEvents: "none" as const };
  if (item.kind === "arrow") {
    const [a, b] = item.points;
    return <path d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} {...props} strokeWidth={10} strokeOpacity={0.35} strokeDasharray="none" />;
  }
  if (item.kind === "zone") return <rect x={item.x - 4} y={item.y - 4} width={item.w + 8} height={item.h + 8} {...props} />;
  if (item.kind === "text") return <rect x={item.x - 4} y={item.y - 24} width={item.text.length * 14 + 8} height={32} {...props} />;
  return <circle cx={item.x} cy={item.y} r={28} {...props} />;
}

