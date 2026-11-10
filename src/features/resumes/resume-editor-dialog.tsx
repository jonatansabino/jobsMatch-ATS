import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { ConfirmAction } from "@/components/shared/confirm-action";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  resumeDraftSchema,
  type Resume,
  type ResumeDraft,
} from "@/types/resume";
import { resumeRepository } from "@/lib/storage/resume-repository";
import { storageErrorMessage } from "@/lib/storage/errors";
import { ResumeFormSections } from "./resume-form-sections";
import { useResumeAutosave } from "./use-resume-autosave";

export function ResumeEditorDialog({
  resume,
  onClose,
}: {
  resume: Resume;
  onClose: () => void;
}) {
  const form = useForm<ResumeDraft>({
    resolver: zodResolver(resumeDraftSchema),
    mode: "onChange",
    defaultValues: {
      name: resume.name,
      content: structuredClone(resume.content),
    },
  });
  const { status, error, save, abandon } = useResumeAutosave(resume, form);
  const [closing, setClosing] = useState(false);
  const [copying, setCopying] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  async function close() {
    if (closing || copying) return;
    setClosing(true);
    if (await save(true)) onClose();
    setClosing(false);
  }
  async function saveAsNew() {
    if (!(await form.trigger())) return;
    setCopying(true);
    try {
      await resumeRepository.create(form.getValues());
      abandon();
      toast.success("Seus campos foram preservados em um novo currículo");
      onClose();
    } catch (cause) {
      toast.error(storageErrorMessage(cause));
    } finally {
      setCopying(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) void close();
      }}
    >
      <DialogContent className="flex max-h-[92dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b p-6 pr-12">
          <DialogTitle>Editar currículo</DialogTitle>
          <DialogDescription>
            Salvamento automático após uma pausa de 0,8 segundo. Informe somente
            dados e experiências reais.
          </DialogDescription>
          <p role="status" className="text-xs font-medium text-primary">
            {status}
          </p>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(async () => {
              if (await save(true)) toast.success("Currículo salvo");
            })}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 overflow-y-auto p-6">
              <fieldset disabled={closing || copying}>
                <ResumeFormSections />
              </fieldset>
            </div>
            <div className="shrink-0 space-y-3 border-t bg-card p-4 sm:px-6">
              {error && (
                <div
                  role="alert"
                  className="space-y-2 text-sm text-destructive"
                >
                  <p>{error}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={copying || closing}
                    onClick={() => void saveAsNew()}
                  >
                    Salvar campos como novo currículo
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={copying || closing}
                    onClick={() => setDiscarding(true)}
                  >
                    Fechar sem salvar
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap justify-between gap-2">
                <p className="self-center text-xs text-muted-foreground">
                  Cada alteração salva mantém um histórico.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={closing || copying}
                  >
                    <Save />
                    Salvar agora
                  </Button>
                  <Button
                    type="button"
                    disabled={closing || copying}
                    onClick={() => void close()}
                  >
                    {closing ? "Salvando…" : "Salvar e fechar"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
        {discarding && (
          <ConfirmAction
            title="Descartar alterações não salvas?"
            description="Somente o conteúdo já salvo será mantido. Os campos pendentes deste formulário serão descartados."
            label="Descartar e fechar"
            destructive
            onClose={() => setDiscarding(false)}
            onConfirm={async () => {
              abandon();
              onClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
