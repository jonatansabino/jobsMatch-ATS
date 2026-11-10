import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmAction } from "@/components/shared/confirm-action";
import { resumeRepository } from "@/lib/storage/resume-repository";
import { storageErrorMessage } from "@/lib/storage/errors";
import type { Resume, ResumeVersion, VersionReason } from "@/types/resume";
import { ResumeSnapshot } from "./resume-snapshot";
import { formatResumeDate } from "./utils";

const reasonLabels: Record<VersionReason, string> = {
  created: "Criação",
  autosave: "Salvamento automático",
  manual: "Salvamento manual",
  duplicate: "Duplicação",
  restored: "Restauração",
};
export function ResumeVersionsDialog({
  resume,
  onClose,
}: {
  resume: Resume;
  onClose: () => void;
}) {
  const [attempt, setAttempt] = useState(0);
  const result = useLiveQuery(async () => {
    try {
      return {
        versions: await resumeRepository.versions(resume.id),
        error: null,
      };
    } catch (error) {
      return { versions: [], error: storageErrorMessage(error) };
    }
  }, [resume.id, attempt]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [restore, setRestore] = useState<ResumeVersion | null>(null);
  const selected =
    result?.versions.find((item) => item.id === selectedId) ??
    result?.versions[0];
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Histórico de versões</DialogTitle>
          <DialogDescription>
            {resume.name} · Os registros anteriores são preservados. Restaurar
            cria uma nova versão.
          </DialogDescription>
        </DialogHeader>
        {!result ? (
          <Skeleton className="h-40" aria-label="Carregando versões" />
        ) : result.error ? (
          <div role="alert">
            <p>{result.error}</p>
            <Button
              variant="outline"
              onClick={() => setAttempt((value) => value + 1)}
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
          <div className="grid min-w-0 gap-5 sm:grid-cols-[200px_1fr]">
            <div
              className="max-h-60 space-y-2 overflow-y-auto sm:max-h-[60dvh]"
              aria-label="Versões"
            >
              {result.versions.map((version) => (
                <Button
                  key={version.id}
                  variant={selected?.id === version.id ? "secondary" : "ghost"}
                  className="h-auto w-full flex-col items-start whitespace-normal p-3 text-left"
                  aria-pressed={selected?.id === version.id}
                  onClick={() => setSelectedId(version.id)}
                >
                  <span>Versão {version.number}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {formatResumeDate(version.createdAt)}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {reasonLabels[version.reason]}
                  </span>
                </Button>
              ))}
            </div>
            {selected && (
              <div className="min-w-0 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
                  <div>
                    <h2 className="break-words font-semibold">
                      {selected.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Versão {selected.number}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={selected.number === resume.revision}
                    onClick={() => setRestore(selected)}
                  >
                    Restaurar esta versão
                  </Button>
                </div>
                <ResumeSnapshot content={selected.content} />
              </div>
            )}
          </div>
        )}
        {restore && (
          <ConfirmAction
            title={`Restaurar versão ${restore.number}?`}
            description="O conteúdo atual continuará no histórico. Uma nova versão será criada com o conteúdo selecionado."
            label="Restaurar versão"
            onClose={() => setRestore(null)}
            onConfirm={async () => {
              await resumeRepository.restoreVersion(
                resume.id,
                restore.id,
                resume.revision,
              );
              toast.success("Versão restaurada");
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
