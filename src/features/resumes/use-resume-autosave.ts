import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useBeforeUnload, useBlocker } from "react-router-dom";
import {
  resumeDraftSchema,
  type Resume,
  type ResumeDraft,
} from "@/types/resume";
import { resumeRepository } from "@/lib/storage/resume-repository";
import { storageErrorMessage } from "@/lib/storage/errors";

export function useResumeAutosave(
  resume: Resume,
  form: UseFormReturn<ResumeDraft>,
) {
  const revision = useRef(resume.revision);
  const persisted = useRef(
    JSON.stringify({ name: resume.name, content: resume.content }),
  );
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const queue = useRef<Promise<boolean>>(Promise.resolve(true));
  const [status, setStatus] = useState("Salvo neste navegador");
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    (manual = false): Promise<boolean> => {
      clearTimeout(timer.current);
      // Capture the latest form only when this task reaches the front of the
      // queue. An older request must never overwrite newer user input.
      const task = queue.current.then(async () => {
        const result = resumeDraftSchema.safeParse(form.getValues());
        if (!result.success) {
          await form.trigger();
          setStatus("Alterações não salvas");
          setError(
            "Corrija os campos indicados para salvar. Você pode manter campos opcionais vazios.",
          );
          return false;
        }
        const serialized = JSON.stringify(result.data);
        if (serialized === persisted.current) {
          dirty.current = false;
          setStatus("Salvo neste navegador");
          setError(null);
          return true;
        }
        setStatus("Salvando…");
        try {
          const saved = await resumeRepository.save(
            resume.id,
            result.data,
            revision.current,
            manual ? "manual" : "autosave",
          );
          revision.current = saved.revision;
          persisted.current = serialized;
          const latest = resumeDraftSchema.safeParse(form.getValues());
          dirty.current =
            !latest.success || JSON.stringify(latest.data) !== serialized;
          setStatus(
            dirty.current ? "Alterações pendentes" : "Salvo neste navegador",
          );
          setError(null);
          return !dirty.current;
        } catch (cause) {
          setStatus("Falha ao salvar");
          setError(storageErrorMessage(cause));
          return false;
        }
      });
      queue.current = task;
      return task;
    },
    [form, resume.id],
  );

  useEffect(() => {
    const subscription = form.watch(() => {
      dirty.current = true;
      setError(null);
      setStatus("Alterações pendentes");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        void save();
      }, 800);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timer.current);
      // A route can unmount the modal (e.g. browser Back). Flush valid data
      // rather than dropping a pending debounce.
      if (dirty.current) void save();
    };
  }, [form, save]);

  // A data-router blocker also protects pending/invalid drafts on SPA Back.
  const blocker = useBlocker(useCallback(() => dirty.current, []));
  const resolvingNavigation = useRef(false);
  useEffect(() => {
    if (blocker.state !== "blocked" || resolvingNavigation.current) return;
    resolvingNavigation.current = true;
    void save(true)
      .then((saved) => {
        if (saved) blocker.proceed();
        else blocker.reset();
      })
      .finally(() => {
        resolvingNavigation.current = false;
      });
  }, [blocker, save]);

  useBeforeUnload(
    useCallback((event) => {
      if (dirty.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    }, []),
  );
  return {
    status,
    error,
    save,
    abandon: () => {
      clearTimeout(timer.current);
      dirty.current = false;
    },
  };
}
