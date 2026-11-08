"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { call } from "@/lib/client";
import type { Evaluation, Skill } from "@/lib/types";
import { Button, Card } from "./ui";

export function EvaluationEditor({ playerId, skills, evaluations }: { playerId: number; skills: Skill[]; evaluations: Evaluation[] }) {
  const t = useTranslations("players.evaluation");
  const router = useRouter();
  const initial = Object.fromEntries(evaluations.map((e) => [e.skill, e.value]));
  const [values, setValues] = useState<Record<number, number>>(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const dirty = JSON.stringify(values) !== JSON.stringify(initial);

  const groups = skills.reduce<Record<string, Skill[]>>((acc, s) => ((acc[s.category_name] ??= []).push(s), acc), {});

  async function save() {
    setState("saving");
    try {
      const ratings = Object.entries(values).map(([skill, value]) => ({ skill: Number(skill), value }));
      await call(`/players/${playerId}/evaluate/`, { method: "POST", json: { ratings } });
      setState("saved");
      router.refresh();
    } catch {
      setState("error");
    }
  }

  if (skills.length === 0) return <p className="text-sm text-muted">{t("noSkills")}</p>;

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([cat, list]) => (
        <Card key={cat} className="p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{cat}</h3>
          <ul className="divide-y divide-line">
            {list.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <span className="text-sm">{s.skill_name}</span>
                <div role="radiogroup" aria-label={s.skill_name} className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n} type="button" role="radio" aria-checked={values[s.id] === n} aria-label={String(n)}
                      onClick={() => { setValues({ ...values, [s.id]: n }); setState("idle"); }}
                      className={`size-9 rounded-lg border font-mono text-sm transition-colors ${
                        (values[s.id] ?? 0) >= n ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-muted hover:border-muted"
                      }`}
                    >{n}</button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ))}
      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={!dirty || state === "saving"}>{state === "saving" ? t("saving") : t("save")}</Button>
        <span role="status" className="text-sm text-muted">
          {state === "saved" && t("saved")}
          {state === "error" && <span className="text-danger">{t("error")}</span>}
        </span>
      </div>
    </div>
  );
}
