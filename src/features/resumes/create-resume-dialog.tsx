import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  emptyResumeContent,
  resumeDraftSchema,
  type Resume,
} from "@/types/resume";
import { resumeRepository } from "@/lib/storage/resume-repository";
import { storageErrorMessage } from "@/lib/storage/errors";

const nameSchema = resumeDraftSchema.pick({ name: true });
export function CreateResumeDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (resume: Resume) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string }>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  });
  const submit = handleSubmit(async ({ name }) => {
    try {
      const resume = await resumeRepository.create({
        name,
        content: emptyResumeContent(),
      });
      toast.success("Currículo criado neste navegador");
      onCreated(resume);
    } catch (cause) {
      setError(storageErrorMessage(cause));
    }
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo currículo</DialogTitle>
          <DialogDescription>
            Dê um nome para identificar esta versão. Os campos pessoais podem
            ser preenchidos aos poucos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="new-resume-name">Nome do currículo</Label>
            <Input
              id="new-resume-name"
              autoFocus
              placeholder="Ex.: Currículo para vagas administrativas"
              maxLength={120}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "new-name-error" : undefined}
              {...register("name")}
            />
            {errors.name && (
              <p id="new-name-error" className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando…" : "Criar currículo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
