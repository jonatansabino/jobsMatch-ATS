import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { JobMatchDatabase } from "./database";
import {
  createResumeRepository,
  ResumeConflictError,
} from "./resume-repository";
import { emptyResumeContent, type ResumeDraft } from "@/types/resume";

let database: JobMatchDatabase;
let repository: ReturnType<typeof createResumeRepository>;
const draft = (name = "Meu currículo"): ResumeDraft => ({
  name,
  content: emptyResumeContent(),
});
beforeEach(() => {
  database = new JobMatchDatabase(`test-${crypto.randomUUID()}`);
  repository = createResumeRepository(database);
});
afterEach(async () => {
  await database.delete();
});

describe("Persistência e CRUD de currículos", () => {
  it("inicia vazio sem inserir demonstrações", async () => {
    expect(await repository.list()).toEqual([]);
    expect(await database.resumeVersions.count()).toBe(0);
  });
  it("cria currículo e versão inicial atômicos, permitindo um rascunho", async () => {
    const resume = await repository.create(draft("  Primeiro  "));
    expect(resume).toMatchObject({
      name: "Primeiro",
      revision: 1,
      isPrimary: true,
      deletedAt: null,
    });
    expect(await repository.get(resume.id)).toEqual(resume);
    expect(await repository.versions(resume.id)).toMatchObject([
      { number: 1, reason: "created", content: emptyResumeContent() },
    ]);
  });
  it("mantém dados ao fechar e reabrir uma nova instância do banco", async () => {
    const original = await repository.create(draft());
    const name = database.name;
    database.close();
    database = new JobMatchDatabase(name);
    repository = createResumeRepository(database);
    expect(await repository.get(original.id)).toEqual(original);
    expect(await repository.versions(original.id)).toHaveLength(1);
  });
  it("preserva snapshots antigos e não cria versões sem mudanças", async () => {
    const resume = await repository.create(draft());
    const content = emptyResumeContent();
    content.summary = "Organizei processos administrativos.";
    const changed = await repository.save(
      resume.id,
      { name: "Administrativo", content },
      1,
    );
    const unchanged = await repository.save(
      resume.id,
      { name: "Administrativo", content },
      changed.revision,
      "manual",
    );
    expect(unchanged.revision).toBe(2);
    const versions = await repository.versions(resume.id);
    expect(versions.map((version) => version.number)).toEqual([2, 1]);
    expect(versions[1].content.summary).toBe("");
    expect(versions[0].content.summary).toBe(content.summary);
  });
  it("duplica os dados verdadeiros com IDs e histórico independentes", async () => {
    const data = draft();
    data.content.skills.technical = "Excel";
    const resume = await repository.create(data);
    const copy = await repository.duplicate(resume.id);
    expect(copy.id).not.toBe(resume.id);
    expect(copy.name).toBe("Meu currículo — cópia");
    expect(copy.isPrimary).toBe(false);
    expect(copy.content).toEqual(data.content);
    await repository.save(
      copy.id,
      { ...copy, content: { ...copy.content, summary: "Resumo da cópia" } },
      1,
    );
    expect((await repository.get(resume.id)).content.summary).toBe("");
    expect(await repository.versions(copy.id)).toHaveLength(2);
    expect(await repository.versions(resume.id)).toHaveLength(1);
  });
  it("garante um principal mesmo com criações concorrentes", async () => {
    const [first, second] = await Promise.all([
      repository.create(draft("A")),
      repository.create(draft("B")),
    ]);
    expect(
      (await repository.list()).filter((resume) => resume.isPrimary),
    ).toHaveLength(1);
    await repository.setPrimary(second.id);
    expect((await repository.get(first.id)).isPrimary).toBe(false);
    expect((await repository.get(second.id)).isPrimary).toBe(true);
  });
  it("exclui reversivelmente, escolhe outro principal e mantém versões", async () => {
    const first = await repository.create(draft("A"));
    const second = await repository.create(draft("B"));
    await repository.trash(first.id);
    await expect(repository.get(first.id)).rejects.toThrow("lixeira");
    expect(
      (await repository.list()).filter((resume) => !resume.deletedAt),
    ).toHaveLength(1);
    expect((await repository.get(second.id)).isPrimary).toBe(true);
    expect(await repository.versions(first.id)).toHaveLength(1);
    await repository.restoreFromTrash(first.id);
    expect((await repository.get(first.id)).isPrimary).toBe(false);
    await repository.trash(second.id);
    await repository.trash(first.id);
    await repository.restoreFromTrash(first.id);
    expect((await repository.get(first.id)).isPrimary).toBe(true);
  });
  it("não permite salvar nem definir como principal um currículo na lixeira", async () => {
    const resume = await repository.create(draft());
    await repository.trash(resume.id);
    await expect(
      repository.save(resume.id, draft("Novo"), 1),
    ).rejects.toThrow();
    await expect(repository.setPrimary(resume.id)).rejects.toThrow();
    expect(await repository.versions(resume.id)).toHaveLength(1);
  });
  it("restaura uma versão sem apagar o conteúdo anterior", async () => {
    const resume = await repository.create(draft("Original"));
    const [initial] = await repository.versions(resume.id);
    await repository.save(resume.id, draft("Alterado"), 1);
    const restored = await repository.restoreVersion(resume.id, initial.id, 2);
    expect(restored).toMatchObject({ name: "Original", revision: 3 });
    expect(
      (await repository.versions(resume.id)).map((item) => item.name),
    ).toEqual(["Original", "Alterado", "Original"]);
    expect((await repository.versions(resume.id))[0].reason).toBe("restored");
  });
  it("rejeita restauração de uma versão pertencente a outro currículo", async () => {
    const first = await repository.create(draft("A"));
    const second = await repository.create(draft("B"));
    const [version] = await repository.versions(first.id);
    await expect(
      repository.restoreVersion(second.id, version.id, 1),
    ).rejects.toThrow("Versão não encontrada");
    expect((await repository.get(second.id)).revision).toBe(1);
  });
  it("detecta conflito entre abas e impede sobrescritas silenciosas", async () => {
    const resume = await repository.create(draft());
    await repository.save(resume.id, draft("Outra aba"), 1);
    await expect(
      repository.save(resume.id, draft("Antigo"), 1),
    ).rejects.toBeInstanceOf(ResumeConflictError);
    const [initial] = (await repository.versions(resume.id)).slice(-1);
    await expect(
      repository.restoreVersion(resume.id, initial.id, 1),
    ).rejects.toBeInstanceOf(ResumeConflictError);
    expect((await repository.get(resume.id)).name).toBe("Outra aba");
    expect(await repository.versions(resume.id)).toHaveLength(2);
  });
  it("reverte a gravação do currículo se a criação da versão falhar", async () => {
    const resume = await repository.create(draft());
    const fail = () => {
      throw new Error("Falha de escrita simulada");
    };
    database.resumeVersions.hook("creating", fail);
    await expect(
      repository.save(resume.id, draft("Não salvar"), 1),
    ).rejects.toThrow("Falha de escrita");
    database.resumeVersions.hook("creating").unsubscribe(fail);
    expect((await repository.get(resume.id)).revision).toBe(1);
    expect((await repository.get(resume.id)).name).toBe("Meu currículo");
    expect(await repository.versions(resume.id)).toHaveLength(1);
  });
  it("valida entradas antes de persistir e não inventa conteúdo", async () => {
    await expect(repository.create(draft(" "))).rejects.toThrow();
    const invalid = draft();
    invalid.content.personal.email = "invalido";
    await expect(repository.create(invalid)).rejects.toThrow();
    expect(await repository.list()).toEqual([]);
    const resume = await repository.create(draft());
    expect(resume.content.experiences).toEqual([]);
    expect(resume.content.skills.technical).toBe("");
  });
});
