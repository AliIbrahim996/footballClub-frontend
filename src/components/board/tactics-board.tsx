"use client";

import {
  ArrowRight, Circle, Cone, Download, Eraser, Lock, MousePointer2, MoveUpRight, Pause, Play, Plus, Redo2, Repeat, Save, Square, Trash2,
  Type, Undo2, Waves, X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { call } from "@/lib/client";
import { SIGNUPS_OPEN } from "@/lib/flags";
import type { BoardItem, BoardState, Plan } from "@/lib/types";
import { Button, Card, Field, Input, LinkButton } from "../ui";
import { FORMATIONS, arrangeFormation, easeInOut, formationFits, stepPositions, svgToPng, uid, wavy } from "./geometry";
import { PITCH_KINDS, Pitch, VIEWBOX } from "./pitch";

type Tool = "select" | "home" | "away" | "neutral" | "ball" | "cone" | "goal" | "run" | "pass" | "dribble" | "zone" | "text" | "erase";
const TEAM_COLOR = { home: "#2563eb", away: "#dc2626", neutral: "#f59e0b" } as const;
const EMPTY: BoardState = { pitch: "full", items: [], steps: [] };
const MAX_STEPS = 12;
const STEP_MS = 1400; // one step of the play at 1x speed (explanatory motion, so longer than UI transitions)
const SPEEDS = [0.5, 1, 2] as const;
const TAG_PRESETS = ["attack", "defense", "set-piece", "counter", "pressing", "transition"] as const;

type BoardProps = {
  plan?: Plan;
  /** "public" = the free designer: no server saving, state kept in the browser by the caller, no simulation. */
  mode?: "account" | "public";
  initialBoard?: Partial<BoardState>;
  onBoardChange?: (board: BoardState) => void;
};

export function TacticsBoard({ plan, mode = "account", initialBoard, onBoardChange }: BoardProps) {
  const t = useTranslations("tactics");
  const svgRef = useRef<SVGSVGElement>(null);
  const start = initialBoard ?? plan?.board;
  const [board, setBoard] = useState<BoardState>({ ...EMPTY, ...start, items: start?.items ?? [], steps: start?.steps ?? [] });
  useEffect(() => { onBoardChange?.(board); }, [board, onBoardChange]);
  const [past, setPast] = useState<BoardState[]>([]);
  const [future, setFuture] = useState<BoardState[]>([]);
  const [tool, setTool] = useState<Tool>("select");
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<BoardItem | null>(null);
  const drag = useRef<{ id: string; dx: number; dy: number; before: BoardState } | null>(null);
  const [planId, setPlanId] = useState<number | undefined>(plan?.id);
  const [title, setTitle] = useState(plan?.title ?? "");
  const [comment, setComment] = useState(plan?.comment ?? "");
  const [tags, setTags] = useState<string[]>(plan?.tags ?? []);
  const [tagDraft, setTagDraft] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [fname, setFname] = useState("4-4-2");

  // --- simulation state -------------------------------------------------------
  const simulation = mode === "account";
  const [step, setStep] = useState(0);
  const [playhead, setPlayhead] = useState<number | null>(null); // fractional step while playing
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [loop, setLoop] = useState(false);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const steps = board.steps ?? [];
  const positions = useMemo(() => stepPositions(board.items, board.steps), [board.items, board.steps]);
  const last = positions.length - 1;
  const current = Math.min(step, last); // undo can remove the step you were on
  const playing = playhead !== null;

  /** Where an item is drawn right now: its position in the selected step, or interpolated while playing. */
  const placed = (item: BoardItem): BoardItem => {
    if (item.kind === "arrow" || !(item.id in positions[0])) return item;
    let p: [number, number];
    if (playhead !== null) {
      const i = Math.floor(playhead);
      const a = positions[i][item.id];
      const b = positions[Math.min(i + 1, last)][item.id];
      const e = reducedMotion() ? 0 : easeInOut(playhead - i);
      p = [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e];
    } else {
      p = positions[current][item.id];
    }
    return { ...item, x: p[0], y: p[1] };
  };

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
    if (!selected || playing) return;
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
    if (playing) return;
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
    // Only select/erase act on existing items; every other tool starts on the pitch beneath them.
    if (playing || (tool !== "select" && tool !== "erase")) return;
    e.stopPropagation();
    if (tool === "erase") { commit({ ...board, items: board.items.filter((i) => i.id !== item.id) }); return; }
    setSelected(item.id);
    const shown = placed(item);
    if (shown.kind === "arrow") return;
    const [x, y] = point(e);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    drag.current = { id: item.id, dx: shown.x - x, dy: shown.y - y, before: board };
  }

  function onMove(e: React.PointerEvent) {
    const [x, y] = point(e);
    if (drag.current) {
      const { id, dx, dy } = drag.current;
      const to: [number, number] = [x + dx, y + dy];
      setBoard((b) => current === 0
        // Step 1 is the drawing itself...
        ? { ...b, items: b.items.map((i) => (i.id === id && i.kind !== "arrow" ? { ...i, x: to[0], y: to[1] } : i)) }
        // ...later steps only record where things move to.
        : { ...b, steps: (b.steps ?? []).map((s, i) => (i === current - 1 ? { ...s, pos: { ...s.pos, [id]: to } } : s)) });
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
    if (playing) return;
    if (item.kind === "player") {
      const v = window.prompt(t("labelPrompt"), item.label);
      if (v !== null) commit({ ...board, items: board.items.map((i) => (i.id === item.id ? { ...item, label: v.slice(0, 3) } : i)) });
    } else if (item.kind === "text") {
      const v = window.prompt(t("textPrompt"), item.text);
      if (v) commit({ ...board, items: board.items.map((i) => (i.id === item.id ? { ...item, text: v } : i)) });
    }
  }

  // --- steps and playback ---------------------------------------------------------
  function addStep() {
    if (steps.length + 1 >= MAX_STEPS) return;
    // A new step starts where the selected step ends, so insert it right after the selection.
    const next = [...steps];
    next.splice(current, 0, { id: uid(), pos: {} });
    commit({ ...board, steps: next });
    setStep(current + 1);
  }
  function deleteStep() {
    if (current === 0) return;
    commit({ ...board, steps: steps.filter((_, i) => i !== current - 1) });
    setStep(current - 1);
  }
  function play() {
    if (last === 0) return;
    setSelected(null);
    setDraft(null);
    cancelAnimationFrame(raf.current); // never run two loops (e.g. a double click before the first frame)
    const per = STEP_MS / speed;
    let base = current >= last ? 0 : current;
    let t0 = performance.now();
    setPlayhead(base); // switch the controls to "Pause" right away, before the first frame
    const tick = (now: number) => {
      let ph = base + (now - t0) / per;
      if (ph >= last) {
        if (!loop) { setPlayhead(null); setStep(last); return; }
        base = 0; t0 = now; ph = 0;
      }
      setPlayhead(ph);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }
  function pause() {
    cancelAnimationFrame(raf.current);
    setStep(Math.min(last, Math.round(playhead ?? current)));
    setPlayhead(null);
  }

  async function exportPng() {
    const blob = await svgToPng(svgRef.current!);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title || "tactic"}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // Functional updates: two quick clicks must not overwrite each other with a stale list.
  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase().split(/\s+/).join("-").slice(0, 30);
    if (!tag) return;
    setTags((prev) => (prev.includes(tag) || prev.length >= 10 ? prev : [...prev, tag]));
    setStatus("idle");
  }
  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : prev.length >= 10 ? prev : [...prev, tag]));
    setStatus("idle");
  };
  const tagLabel = (tag: string) => ((TAG_PRESETS as readonly string[]).includes(tag) ? t(`tags.presets.${tag}`) : tag);

  async function save() {
    if (playing) pause();
    setStatus("saving");
    try {
      // Hide the selection outline before capturing the image. Synchronous on purpose: waiting for an animation frame
      // would stall the save in a background tab, where browsers pause frames.
      flushSync(() => setSelected(null));
      const blob = await svgToPng(svgRef.current!);
      const fd = new FormData();
      fd.set("image", blob, "tactic.png");
      fd.set("title", title);
      fd.set("comment", comment || title || t("untitled"));
      fd.set("board", JSON.stringify(board));
      fd.set("tags", JSON.stringify(tags));
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
  // Movement trails: where each item came from in the previous step (only while editing a later step).
  const trails = simulation && !playing && current > 0
    ? board.items.flatMap((it) => {
        const a = positions[current - 1][it.id], b = positions[current][it.id];
        return a && b && Math.hypot(b[0] - a[0], b[1] - a[1]) > 2 ? [{ id: it.id, a, b }] : [];
      })
    : [];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-3">
        {/* Toolbar */}
        <Card className="flex items-center gap-1 overflow-x-auto p-2" role="toolbar" aria-label={t("toolbar")}>
          {tools.map((x) => (
            <button
              key={x.id} type="button" title={x.label} aria-label={x.label} aria-pressed={tool === x.id} disabled={playing}
              onClick={() => setTool(x.id)}
              className={`grid size-10 shrink-0 place-items-center rounded-lg transition-colors disabled:opacity-40 ${tool === x.id ? "bg-accent text-accent-fg" : "text-fg hover:bg-surface-2"}`}
            >{x.icon}</button>
          ))}
          <span className="mx-1 h-6 w-px shrink-0 bg-line" />
          <button type="button" aria-label={t("undo")} title={t("undo")} disabled={!past.length || playing} onClick={undo} className="grid size-10 shrink-0 place-items-center rounded-lg hover:bg-surface-2 disabled:opacity-40"><Undo2 size={18} /></button>
          <button type="button" aria-label={t("redo")} title={t("redo")} disabled={!future.length || playing} onClick={redo} className="grid size-10 shrink-0 place-items-center rounded-lg hover:bg-surface-2 disabled:opacity-40"><Redo2 size={18} /></button>
          <button type="button" aria-label={t("deleteSelected")} title={t("deleteSelected")} disabled={!selected || playing} onClick={removeSelected} className="grid size-10 shrink-0 place-items-center rounded-lg text-danger hover:bg-danger/10 disabled:opacity-40"><Trash2 size={18} /></button>
        </Card>

        {/* Board */}
        <div className="overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-sm">
          <svg
            ref={svgRef}
            viewBox={`${vx} ${vy} ${vw} ${vh}`}
            className={`mx-auto block max-h-[78vh] w-full touch-none select-none ${tool === "select" || playing ? "cursor-default" : "cursor-crosshair"}`}
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
            {trails.map(({ id, a, b }) => (
              <g key={`trail-${id}`} pointerEvents="none" opacity={0.55}>
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#fff" strokeWidth={3} strokeDasharray="6 7" strokeLinecap="round" />
                <circle cx={a[0]} cy={a[1]} r={14} fill="none" stroke="#fff" strokeWidth={2} strokeDasharray="4 4" />
              </g>
            ))}
            {all.map((item) => {
              const shown = placed(item);
              return (
                <g key={item.id} onPointerDown={(e) => onItemDown(e, item)} onDoubleClick={() => editLabel(item)} className={playing ? "" : tool === "erase" ? "cursor-pointer" : "cursor-grab"}>
                  <Item item={shown} />
                  {selected === item.id && !playing && <Selection item={shown} />}
                </g>
              );
            })}
          </svg>
        </div>
        <p className="text-xs text-muted">{t("hint")}</p>

        {simulation && (
          <Card className="space-y-3 p-4" aria-label={t("sim.title")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">{t("sim.title")}</h2>
              <p className="text-sm text-muted" aria-live="polite">
                {t("sim.progress", { current: (playing ? Math.min(last, Math.floor(playhead)) : current) + 1, total: last + 1 })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label={t("sim.steps")}>
              {positions.map((_, i) => (
                <button
                  key={i} type="button" role="radio" aria-checked={!playing && current === i} disabled={playing}
                  onClick={() => { setStep(i); setSelected(null); }}
                  className={`h-9 min-w-9 rounded-lg border px-2.5 font-mono text-sm transition-colors disabled:opacity-50 ${!playing && current === i ? "border-accent bg-accent text-accent-fg" : "border-line hover:bg-surface-2"}`}
                >{i + 1}</button>
              ))}
              <Button variant="secondary" className="h-9 px-3" onClick={addStep} disabled={playing || steps.length + 1 >= MAX_STEPS} title={t("sim.addStep")}>
                <Plus size={16} aria-hidden /> {t("sim.addStep")}
              </Button>
              <button type="button" onClick={deleteStep} disabled={playing || current === 0} aria-label={t("sim.deleteStep")} title={t("sim.deleteStep")} className="grid size-9 place-items-center rounded-lg text-danger hover:bg-danger/10 disabled:opacity-40">
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {playing
                ? <Button onClick={pause} className="h-9"><Pause size={16} aria-hidden /> {t("sim.pause")}</Button>
                : <Button onClick={play} disabled={last === 0} className="h-9"><Play size={16} aria-hidden /> {t("sim.play")}</Button>}
              <label className="flex items-center gap-1.5 text-sm">
                <span className="text-muted">{t("sim.speed")}</span>
                <select value={speed} disabled={playing} onChange={(e) => setSpeed(Number(e.target.value) as (typeof SPEEDS)[number])} className="h-9 rounded-lg border border-line bg-surface px-2 text-sm">
                  {SPEEDS.map((s) => <option key={s} value={s}>{s}x</option>)}
                </select>
              </label>
              <button
                type="button" aria-pressed={loop} disabled={playing} onClick={() => setLoop(!loop)}
                className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm transition-colors disabled:opacity-50 ${loop ? "border-accent bg-accent-soft text-accent" : "border-line hover:bg-surface-2"}`}
              ><Repeat size={15} aria-hidden /> {t("sim.loop")}</button>
            </div>
            {playing && (
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden>
                <div className="h-full origin-left rounded-full bg-accent rtl:origin-right" style={{ transform: `scaleX(${playhead / last})` }} />
              </div>
            )}
            <p className="text-xs text-muted">{last === 0 ? t("sim.hintEmpty") : t("sim.hint")}</p>
          </Card>
        )}
      </div>

      {/* Side panel */}
      <div className="space-y-4">
        <Card className="space-y-4 p-4">
          <h2 className="font-semibold">{t("pitch")}</h2>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 xl:grid-cols-2" role="radiogroup" aria-label={t("pitch")}>
            {PITCH_KINDS.map((p) => (
              <button
                key={p} type="button" role="radio" aria-checked={board.pitch === p} disabled={playing}
                onClick={() => commit({ ...board, pitch: p })}
                className={`h-9 rounded-lg border px-1 text-xs font-medium disabled:opacity-50 ${board.pitch === p ? "border-accent bg-accent-soft text-accent" : "border-line hover:bg-surface-2"}`}
              >{t(`pitches.${p}`)}</button>
            ))}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="formation">{t("formation")}</label>
            <div className="flex gap-2">
              <select
                id="formation" value={fname} disabled={playing}
                onChange={(e) => {
                  const name = e.target.value;
                  setFname(name);
                  if (!formationFits(board.pitch)) return;
                  // Re-arrange the teams already on the board; with an empty board, line up the home team.
                  const teams = (["home", "away"] as const).filter((team) => board.items.some((i) => i.kind === "player" && i.team === team));
                  const items = (teams.length ? teams : (["home"] as const)).reduce((acc, team) => arrangeFormation(acc, name, team, board.pitch), board.items);
                  commit({ ...board, items });
                }}
                className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-surface px-2 text-sm"
              >
                {Object.keys(FORMATIONS).map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["home", "away"] as const).map((team) => (
                <Button
                  key={team} variant="secondary" className="h-9 px-2 text-xs" disabled={!formationFits(board.pitch) || playing}
                  onClick={() => commit({ ...board, items: arrangeFormation(board.items, fname, team, board.pitch) })}
                >{t(`place.${team}`)}</Button>
              ))}
            </div>
            {!formationFits(board.pitch) && <p className="mt-2 text-xs text-muted">{t("formationHint")}</p>}
          </div>
          <Button variant="ghost" className="w-full" onClick={() => { commit({ ...board, items: [], steps: [] }); setSelected(null); setStep(0); }} disabled={!board.items.length || playing}>{t("clear")}</Button>
        </Card>

        {mode === "public" ? (
          <>
            <Card className="space-y-3 p-4">
              <h2 className="font-semibold">{t("public.title")}</h2>
              <p className="text-sm text-muted">{SIGNUPS_OPEN ? t("public.body") : t("public.bodyClosed")}</p>
              <Button variant="secondary" onClick={exportPng} className="w-full"><Download size={16} aria-hidden /> {t("exportPng")}</Button>
              <LinkButton href={SIGNUPS_OPEN ? "/register" : "/contact?topic=full"} className="w-full">{SIGNUPS_OPEN ? t("public.cta") : t("public.ctaClosed")}</LinkButton>
            </Card>
            <Card className="space-y-2 p-4">
              <h2 className="flex items-center gap-2 font-semibold"><Lock size={16} className="text-accent" aria-hidden /> {t("sim.lockedTitle")}</h2>
              <p className="text-sm text-muted">{t("sim.lockedBody")}</p>
              <LinkButton href={SIGNUPS_OPEN ? "/register" : "/contact?topic=full"} variant="secondary" className="w-full">{t("sim.lockedCta")}</LinkButton>
            </Card>
          </>
        ) : (
        <Card className="space-y-3 p-4">
          <h2 className="font-semibold">{t("savePlan")}</h2>
          <Field label={t("titleLabel")}><Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} /></Field>
          <Field label={t("commentLabel")}><Input value={comment} onChange={(e) => setComment(e.target.value)} maxLength={255} /></Field>
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">{t("tags.label")}</legend>
            <div className="flex flex-wrap gap-1.5">
              {TAG_PRESETS.map((tag) => (
                <button
                  key={tag} type="button" aria-pressed={tags.includes(tag)} onClick={() => toggleTag(tag)}
                  className={`h-8 rounded-full border px-3 text-xs font-medium transition-colors ${tags.includes(tag) ? "border-accent bg-accent-soft text-accent" : "border-line hover:bg-surface-2"}`}
                >{tagLabel(tag)}</button>
              ))}
              {tags.filter((tag) => !(TAG_PRESETS as readonly string[]).includes(tag)).map((tag) => (
                <button
                  key={tag} type="button" aria-label={t("tags.remove", { tag })} onClick={() => toggleTag(tag)}
                  className="flex h-8 items-center gap-1 rounded-full border border-accent bg-accent-soft px-3 text-xs font-medium text-accent"
                >{tag} <X size={12} aria-hidden /></button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                value={tagDraft} maxLength={30} placeholder={t("tags.placeholder")} aria-label={t("tags.placeholder")}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagDraft); setTagDraft(""); } }}
              />
              <Button type="button" variant="secondary" onClick={() => { addTag(tagDraft); setTagDraft(""); }} disabled={!tagDraft.trim()}>{t("tags.add")}</Button>
            </div>
          </fieldset>
          <div className="flex gap-2">
            <Button onClick={save} disabled={status === "saving"} className="flex-1"><Save size={16} aria-hidden /> {status === "saving" ? t("saving") : planId ? t("update") : t("save")}</Button>
            <Button variant="secondary" onClick={exportPng} aria-label={t("exportPng")} title={t("exportPng")}><Download size={16} /></Button>
          </div>
          <p role="status" className="min-h-5 text-sm">
            {status === "saved" && <span className="text-accent">{t("saved")}</span>}
            {status === "error" && <span className="text-danger">{t("saveError")}</span>}
          </p>
        </Card>
        )}
      </div>
    </div>
  );
}

/** Reduced motion: the play still steps through, but items jump between positions instead of gliding. */
function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
