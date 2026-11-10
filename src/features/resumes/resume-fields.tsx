import { useState } from "react";
import { ConfirmAction } from "@/components/shared/confirm-action";
import {
  useFieldArray,
  useFormContext,
  type FieldArrayPath,
  type FieldArray,
  type FieldPath,
} from "react-hook-form";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ResumeDraft } from "@/types/resume";

export function ResumeField({
  name,
  label,
  multiline = false,
  type = "text",
}: {
  name: FieldPath<ResumeDraft>;
  label: string;
  multiline?: boolean;
  type?: string;
}) {
  const { register, getFieldState, formState } = useFormContext<ResumeDraft>();
  const error = getFieldState(name, formState).error;
  const id = `resume-${name}`;
  const props = {
    id,
    ...register(name),
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  };
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea {...props} rows={4} />
      ) : (
        <Input {...props} type={type} />
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}

interface ItemField {
  key: string;
  label: string;
  multiline?: boolean;
  type?: string;
}
interface RepeatSectionProps {
  name: FieldArrayPath<ResumeDraft>;
  title: string;
  singular: string;
  fields: ItemField[];
  empty: FieldArray<ResumeDraft, FieldArrayPath<ResumeDraft>>;
}
export function RepeatSection({
  name,
  title,
  singular,
  fields: itemFields,
  empty,
}: RepeatSectionProps) {
  const { control, register, watch } = useFormContext<ResumeDraft>();
  const { fields, append, remove, move } = useFieldArray({ control, name });
  const values = watch(name);
  const [removing, setRemoving] = useState<number | null>(null);
  return (
    <section className="space-y-4 border-t pt-6" aria-label={title}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={fields.length >= 100}
          onClick={() => append(empty)}
        >
          <Plus />
          Adicionar {singular}
        </Button>
      </div>
      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum item adicionado. Preencha apenas informações verdadeiras.
        </p>
      )}
      {fields.map((field, index) => (
        <fieldset key={field.id} className="space-y-4 rounded-lg border p-4">
          <legend className="px-1 text-sm font-medium">
            {singular} {index + 1}
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {itemFields.map((item) => (
              <div
                key={item.key}
                className={item.multiline ? "sm:col-span-2" : ""}
              >
                <ResumeField
                  name={
                    `${name}.${index}.${item.key}` as FieldPath<ResumeDraft>
                  }
                  label={item.label}
                  multiline={item.multiline}
                  type={item.type}
                />
              </div>
            ))}
          </div>
          {name === "content.experiences" && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...register(`content.experiences.${index}.current`)}
              />
              Emprego atual
              {Boolean((values[index] as { current?: boolean })?.current) && (
                <span className="text-xs text-muted-foreground">
                  Deixe a data final em branco.
                </span>
              )}
            </label>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={index === 0}
              aria-label={`Mover ${singular} ${index + 1} para cima`}
              onClick={() => move(index, index - 1)}
            >
              <ArrowUp />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={index === fields.length - 1}
              aria-label={`Mover ${singular} ${index + 1} para baixo`}
              onClick={() => move(index, index + 1)}
            >
              <ArrowDown />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setRemoving(index)}
            >
              <Trash2 />
              Remover
            </Button>
          </div>
        </fieldset>
      ))}
      {removing !== null && (
        <ConfirmAction
          title={`Remover ${singular} ${removing + 1}?`}
          description="Versões já salvas continuarão disponíveis no histórico."
          label="Remover item"
          destructive
          onClose={() => setRemoving(null)}
          onConfirm={async () => {
            remove(removing);
          }}
        />
      )}
    </section>
  );
}
