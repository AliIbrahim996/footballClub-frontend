"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { BoardState } from "@/lib/types";
import { TacticsBoard } from "./tactics-board";

const KEY = "pitchside.designer.v1";
const subscribe = () => () => {};

function read(): Partial<BoardState> | undefined {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<BoardState>) : undefined;
  } catch {
    return undefined;
  }
}

/** The free designer: works without an account; the board is autosaved in this browser only. */
export function PublicDesigner({ placeholder }: { placeholder: string }) {
  // false on the server and during hydration, true afterwards: lets us read localStorage without a mismatch.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const persist = useCallback((board: BoardState) => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(board));
    } catch {
      /* storage full or blocked: the designer still works, it just won't remember */
    }
  }, []);

  if (!mounted) return <div aria-busy className="aspect-[1050/680] animate-pulse rounded-2xl bg-surface-2" role="status" aria-label={placeholder} />;
  return <TacticsBoard mode="public" initialBoard={read()} onBoardChange={persist} />;
}
