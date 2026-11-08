"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { call } from "@/lib/client";
import { Button } from "./ui";

export function DeleteButton({ path, redirectTo, confirmText }: { path: string; redirectTo: string; confirmText: string }) {
  const t = useTranslations("common");
  const router = useRouter();
  return (
    <Button
      variant="danger"
      onClick={async () => {
        if (!window.confirm(confirmText)) return;
        await call(path, { method: "DELETE" });
        router.replace(redirectTo);
        router.refresh();
      }}
    >
      <Trash2 size={16} aria-hidden /> {t("delete")}
    </Button>
  );
}
