import { z } from "zod";

const text = z.string().max(20000, "Use até 20.000 caracteres por campo.");
const shortText = z.string().max(300, "Use até 300 caracteres.");
const month = z
  .string()
  .refine(
    (value) => value === "" || /^\d{4}-(0[1-9]|1[0-2])$/.test(value),
    "Informe um mês válido.",
  );
export const resumeContentSchema = z.object({
  personal: z.object({
    fullName: shortText,
    professionalTitle: shortText,
    email: z
      .string()
      .max(300)
      .refine(
        (value) => value === "" || z.email().safeParse(value).success,
        "Informe um e-mail válido ou deixe em branco.",
      ),
    phone: shortText,
    location: shortText,
    linkedin: shortText,
    portfolio: shortText,
    github: shortText,
  }),
  summary: text,
  experiences: z
    .array(
      z.object({
        company: shortText,
        role: shortText,
        startDate: month,
        endDate: month,
        current: z.boolean(),
        description: text,
        achievements: text,
      }),
    )
    .max(100),
  education: z
    .array(
      z.object({
        institution: shortText,
        course: shortText,
        degree: shortText,
        period: shortText,
        status: shortText,
      }),
    )
    .max(100),
  skills: z.object({
    technical: text,
    behavioral: text,
    tools: text,
    technologies: text,
  }),
  certifications: z
    .array(
      z.object({
        name: shortText,
        institution: shortText,
        date: month,
        link: shortText,
      }),
    )
    .max(100),
  languages: z.array(z.object({ name: shortText, level: shortText })).max(100),
  projects: z
    .array(
      z.object({
        name: shortText,
        description: text,
        technologies: shortText,
        link: shortText,
      }),
    )
    .max(100),
});
export const resumeDraftSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Dê um nome a este currículo.")
    .max(120, "Use até 120 caracteres."),
  content: resumeContentSchema,
});
export type ResumeContent = z.infer<typeof resumeContentSchema>;
export type ResumeDraft = z.infer<typeof resumeDraftSchema>;
export interface Resume extends ResumeDraft {
  id: string;
  revision: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
export type VersionReason =
  "created" | "autosave" | "manual" | "duplicate" | "restored";
export interface ResumeVersion extends ResumeDraft {
  id: string;
  resumeId: string;
  number: number;
  createdAt: string;
  reason: VersionReason;
}
export function emptyResumeContent(): ResumeContent {
  return {
    personal: {
      fullName: "",
      professionalTitle: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
      github: "",
    },
    summary: "",
    experiences: [],
    education: [],
    skills: { technical: "", behavioral: "", tools: "", technologies: "" },
    certifications: [],
    languages: [],
    projects: [],
  };
}
