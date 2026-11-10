import Dexie, { type EntityTable } from "dexie";
import type { Resume, ResumeVersion } from "@/types/resume";

export class JobMatchDatabase extends Dexie {
  resumes!: EntityTable<Resume, "id">;
  resumeVersions!: EntityTable<ResumeVersion, "id">;

  constructor(name = "jobmatch-ats") {
    super(name);
    // Schema v1. Future changes must add a version and an explicit upgrade,
    // never delete/recreate this database to apply a migration.
    this.version(1).stores({
      resumes: "id, name, updatedAt, deletedAt",
      resumeVersions: "id, resumeId, [resumeId+number]",
    });
  }
}
export const db = new JobMatchDatabase();
