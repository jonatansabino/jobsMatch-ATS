import { db, type JobMatchDatabase } from "./database";
import {
  resumeDraftSchema,
  type Resume,
  type ResumeDraft,
  type ResumeVersion,
  type VersionReason,
} from "@/types/resume";

export class ResumeConflictError extends Error {
  constructor() {
    super(
      "Este currículo foi alterado em outra aba. Seus campos foram preservados. Salve como um novo currículo ou reabra a versão atual.",
    );
    this.name = "ResumeConflictError";
  }
}
function snapshot(resume: Resume, reason: VersionReason): ResumeVersion {
  return {
    id: crypto.randomUUID(),
    resumeId: resume.id,
    name: resume.name,
    content: structuredClone(resume.content),
    number: resume.revision,
    createdAt: resume.updatedAt,
    reason,
  };
}
export function createResumeRepository(database: JobMatchDatabase) {
  async function active(id: string) {
    const resume = await database.resumes.get(id);
    if (!resume || resume.deletedAt)
      throw new Error(
        "O currículo não está mais disponível. Verifique a lixeira.",
      );
    return resume;
  }
  async function create(
    draft: ResumeDraft,
    reason: "created" | "duplicate" = "created",
  ) {
    const parsed = resumeDraftSchema.parse(draft);
    return database.transaction(
      "rw",
      database.resumes,
      database.resumeVersions,
      async () => {
        const all = await database.resumes.toArray();
        const now = new Date().toISOString();
        const resume: Resume = {
          ...parsed,
          id: crypto.randomUUID(),
          revision: 1,
          isPrimary: !all.some((item) => !item.deletedAt && item.isPrimary),
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        };
        await database.resumes.add(resume);
        await database.resumeVersions.add(snapshot(resume, reason));
        return resume;
      },
    );
  }
  return {
    list: () => database.resumes.toArray(),
    get: active,
    create,
    async save(
      id: string,
      draft: ResumeDraft,
      expectedRevision: number,
      reason: "manual" | "autosave" = "autosave",
    ) {
      const parsed = resumeDraftSchema.parse(draft);
      return database.transaction(
        "rw",
        database.resumes,
        database.resumeVersions,
        async () => {
          const current = await active(id);
          if (current.revision !== expectedRevision)
            throw new ResumeConflictError();
          if (
            current.name === parsed.name &&
            JSON.stringify(current.content) === JSON.stringify(parsed.content)
          )
            return current;
          const next = {
            ...current,
            ...parsed,
            revision: current.revision + 1,
            updatedAt: new Date().toISOString(),
          };
          await database.resumes.put(next);
          await database.resumeVersions.add(snapshot(next, reason));
          return next;
        },
      );
    },
    async duplicate(id: string) {
      // Read and clone in one transaction, including the primary-resume invariant.
      return database.transaction(
        "rw",
        database.resumes,
        database.resumeVersions,
        async () => {
          const source = await active(id);
          return create(
            {
              name: `${source.name.slice(0, 110)} — cópia`,
              content: source.content,
            },
            "duplicate",
          );
        },
      );
    },
    async setPrimary(id: string) {
      await database.transaction("rw", database.resumes, async () => {
        await active(id);
        await database.resumes.toCollection().modify((item) => {
          item.isPrimary = item.id === id;
        });
      });
    },
    async trash(id: string) {
      await database.transaction("rw", database.resumes, async () => {
        const current = await active(id);
        await database.resumes.update(id, {
          deletedAt: new Date().toISOString(),
          isPrimary: false,
        });
        if (current.isPrimary) {
          const replacement = (await database.resumes.toArray())
            .filter((item) => !item.deletedAt)
            .sort(
              (a, b) =>
                b.updatedAt.localeCompare(a.updatedAt) ||
                a.id.localeCompare(b.id),
            )[0];
          if (replacement)
            await database.resumes.update(replacement.id, { isPrimary: true });
        }
      });
    },
    async restoreFromTrash(id: string) {
      await database.transaction("rw", database.resumes, async () => {
        const current = await database.resumes.get(id);
        if (!current || !current.deletedAt)
          throw new Error("Este currículo não está na lixeira.");
        const hasPrimary = (await database.resumes.toArray()).some(
          (item) => !item.deletedAt && item.isPrimary,
        );
        await database.resumes.update(id, {
          deletedAt: null,
          isPrimary: !hasPrimary,
        });
      });
    },
    versions: (id: string) =>
      database.resumeVersions
        .where("resumeId")
        .equals(id)
        .sortBy("number")
        .then((versions) => versions.reverse()),
    async restoreVersion(
      id: string,
      versionId: string,
      expectedRevision: number,
    ) {
      return database.transaction(
        "rw",
        database.resumes,
        database.resumeVersions,
        async () => {
          const current = await active(id);
          if (current.revision !== expectedRevision)
            throw new ResumeConflictError();
          const version = await database.resumeVersions.get(versionId);
          if (!version || version.resumeId !== id)
            throw new Error("Versão não encontrada para este currículo.");
          const next: Resume = {
            ...current,
            name: version.name,
            content: structuredClone(version.content),
            revision: current.revision + 1,
            updatedAt: new Date().toISOString(),
          };
          await database.resumes.put(next);
          await database.resumeVersions.add(snapshot(next, "restored"));
          return next;
        },
      );
    },
  };
}
export const resumeRepository = createResumeRepository(db);
