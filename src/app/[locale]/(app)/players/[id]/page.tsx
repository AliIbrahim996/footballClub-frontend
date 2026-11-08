import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { api } from "@/lib/server";
import type { Player, Skill } from "@/lib/types";
import { Avatar, Card, LinkButton, PageHeader } from "@/components/ui";
import { DeleteButton } from "@/components/delete-button";
import { EvaluationEditor } from "@/components/evaluation-editor";
import { PlayerForm } from "@/components/player-form";

export const metadata: Metadata = { title: "Player" };

export default async function PlayerPage({
  params, searchParams,
}: { params: Promise<{ locale: string; id: string }>; searchParams: Promise<{ edit?: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("players");
  const fmt = await getFormatter();
  const player = await api<Player>(`/players/${id}/`).catch(() => notFound());
  const skills = await api<Skill[]>("/skills/");
  const editing = (await searchParams).edit === "1";
  const fullName = `${player.first_name} ${player.name}`;

  if (editing) {
    return (<><PageHeader title={t("edit")} subtitle={fullName} /><PlayerForm player={player} /></>);
  }

  const details: [string, string][] = [
    [t("form.dob"), fmt.dateTime(new Date(player.date_of_birth), { dateStyle: "long" })],
    [t("form.email"), player.email_address],
    [t("form.phone"), player.phone_number],
    [t("form.club"), player.society],
    [t("form.address"), `${player.address}, ${player.post_code} ${player.city}`],
  ];

  return (
    <>
      <PageHeader
        title={fullName}
        subtitle={`${player.city} · ${player.society}`}
        actions={
          <>
            <LinkButton href={`/players/${player.id}?edit=1`} variant="secondary">{t("edit")}</LinkButton>
            <DeleteButton path={`/players/${player.id}/`} redirectTo="/players" confirmText={t("confirmDelete", { name: fullName })} />
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit p-5">
          <div className="flex items-center gap-4">
            <Avatar src={player.image} name={fullName} size={72} />
            <div>
              <p className="font-mono text-3xl font-semibold text-accent">{player.average_rating?.toFixed(1) ?? "–"}</p>
              <p className="text-xs uppercase tracking-wide text-muted">{t("overall")}</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            {details.map(([k, v]) => (
              <div key={k}><dt className="text-xs text-muted">{k}</dt><dd className="break-words">{v}</dd></div>
            ))}
          </dl>
        </Card>
        <section aria-label={t("evaluation.title")}>
          <h2 className="mb-3 font-semibold">{t("evaluation.title")}</h2>
          <EvaluationEditor playerId={player.id} skills={skills} evaluations={player.evaluations ?? []} />
        </section>
      </div>
    </>
  );
}
