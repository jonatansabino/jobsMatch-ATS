import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { ResumesPage } from "./resumes-page";
import { db } from "@/lib/storage/database";
import { resumeRepository } from "@/lib/storage/resume-repository";
import { emptyResumeContent } from "@/types/resume";

function renderPage() {
  return render(
    <RouterProvider
      router={createMemoryRouter([{ path: "*", element: <ResumesPage /> }])}
    />,
  );
}
beforeEach(async () => {
  vi.restoreAllMocks();
  await db.transaction("rw", db.resumes, db.resumeVersions, async () => {
    await db.resumes.clear();
    await db.resumeVersions.clear();
  });
});
async function seed(name = "Meu currículo") {
  return resumeRepository.create({ name, content: emptyResumeContent() });
}

describe("Fluxos de currículos", () => {
  it("cria, salva automaticamente e mantém os dados ao remontar a página", async () => {
    const user = userEvent.setup();
    const view = renderPage();
    await user.click(
      await screen.findByRole("button", { name: "Novo currículo" }),
    );
    await user.type(
      screen.getByLabelText("Nome do currículo"),
      "Currículo real",
    );
    await user.click(screen.getByRole("button", { name: "Criar currículo" }));
    await screen.findByRole("heading", { name: "Editar currículo" });
    await user.type(screen.getByLabelText("Nome completo"), "Maria Silva");
    await user.type(
      screen.getByLabelText("Resumo profissional"),
      "Organizei processos.",
    );
    await waitFor(
      async () => {
        const [saved] = await resumeRepository.list();
        expect(saved.content.summary).toBe("Organizei processos.");
      },
      { timeout: 4000 },
    );
    await user.click(screen.getByRole("button", { name: "Salvar e fechar" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    view.unmount();
    renderPage();
    await user.click(
      await screen.findByRole("button", { name: "Editar currículo" }),
    );
    expect(screen.getByLabelText("Nome completo")).toHaveValue("Maria Silva");
    expect(screen.getByLabelText("Resumo profissional")).toHaveValue(
      "Organizei processos.",
    );
    await user.click(screen.getByRole("button", { name: "Salvar e fechar" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });
  it("não fecha nem perde campos inválidos e permite corrigir e tentar novamente", async () => {
    await seed();
    const user = userEvent.setup();
    renderPage();
    await user.click(
      await screen.findByRole("button", { name: "Editar currículo" }),
    );
    await user.type(screen.getByLabelText("E-mail"), "email-invalido");
    await user.click(screen.getByRole("button", { name: "Salvar e fechar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Corrija os campos",
    );
    expect(screen.getByLabelText("E-mail")).toHaveValue("email-invalido");
    expect((await resumeRepository.list())[0].content.personal.email).toBe("");
    await user.clear(screen.getByLabelText("E-mail"));
    await user.type(screen.getByLabelText("E-mail"), "maria@example.com");
    await user.click(screen.getByRole("button", { name: "Salvar e fechar" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect((await resumeRepository.list())[0].content.personal.email).toBe(
      "maria@example.com",
    );
  });
  it("mostra falha de gravação, preserva o formulário e tenta novamente", async () => {
    await seed();
    const user = userEvent.setup();
    renderPage();
    await user.click(
      await screen.findByRole("button", { name: "Editar currículo" }),
    );
    const spy = vi
      .spyOn(resumeRepository, "save")
      .mockRejectedValueOnce(new DOMException("Cheio", "QuotaExceededError"));
    await user.type(
      screen.getByLabelText("Resumo profissional"),
      "Texto preservado",
    );
    await user.click(screen.getByRole("button", { name: "Salvar e fechar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("cheio");
    expect(screen.getByLabelText("Resumo profissional")).toHaveValue(
      "Texto preservado",
    );
    spy.mockRestore();
    await user.click(screen.getByRole("button", { name: "Salvar e fechar" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect((await resumeRepository.list())[0].content.summary).toBe(
      "Texto preservado",
    );
  });
  it("adiciona e reordena experiências sem gerar informações fictícias", async () => {
    await seed();
    const user = userEvent.setup();
    renderPage();
    await user.click(
      await screen.findByRole("button", { name: "Editar currículo" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Adicionar experiência" }),
    );
    await user.type(screen.getByLabelText("Empresa"), "Empresa A");
    await user.click(
      screen.getByRole("button", { name: "Adicionar experiência" }),
    );
    await user.type(screen.getAllByLabelText("Empresa")[1], "Empresa B");
    await user.click(
      screen.getByRole("button", { name: "Mover experiência 2 para cima" }),
    );
    await user.click(screen.getByRole("button", { name: "Salvar e fechar" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    const [saved] = await resumeRepository.list();
    expect(saved.content.experiences.map((item) => item.company)).toEqual([
      "Empresa B",
      "Empresa A",
    ]);
    expect(
      saved.content.experiences.every((item) => item.achievements === ""),
    ).toBe(true);
  });
  it("exige confirmação para excluir e permite recuperar na lixeira", async () => {
    const resume = await seed("Recuperável");
    const user = userEvent.setup();
    renderPage();
    await user.click(
      await screen.findByRole("button", { name: "Ações de Recuperável" }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Excluir" }));
    const confirmation = screen.getByRole("alertdialog");
    await user.click(
      within(confirmation).getByRole("button", { name: "Cancelar" }),
    );
    expect((await resumeRepository.get(resume.id)).deletedAt).toBeNull();
    await user.click(
      screen.getByRole("button", { name: "Ações de Recuperável" }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Excluir" }));
    await user.click(
      screen.getByRole("button", { name: "Mover para lixeira" }),
    );
    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
    await user.click(
      await screen.findByRole("button", { name: "Lixeira (1)" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Restaurar currículo" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Ver currículos ativos" }),
    );
    expect(
      await screen.findByRole("heading", { name: "Recuperável" }),
    ).toBeInTheDocument();
  });
  it("pesquisa e ordena currículos persistidos", async () => {
    await seed("Zebra");
    await seed("Administração");
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole("heading", { name: "Zebra" });
    await user.selectOptions(screen.getByLabelText("Ordenar por"), "name");
    const cards = screen.getAllByRole("heading", { level: 2 });
    expect(cards.map((card) => card.textContent)).toEqual([
      "Administração",
      "Zebra",
    ]);
    await user.type(screen.getByLabelText("Pesquisar currículos"), "admin");
    expect(
      screen.queryByRole("heading", { name: "Zebra" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Administração" }),
    ).toBeInTheDocument();
  });
  it("exibe versões antigas e restaura sem apagar o histórico", async () => {
    const resume = await resumeRepository.create({
      name: "Histórico real",
      content: { ...emptyResumeContent(), summary: "Resumo original" },
    });
    await resumeRepository.save(
      resume.id,
      {
        name: resume.name,
        content: { ...resume.content, summary: "Resumo atualizado" },
      },
      1,
    );
    const user = userEvent.setup();
    renderPage();
    await user.click(await screen.findByRole("button", { name: "Versões" }));
    await user.click(await screen.findByRole("button", { name: /Versão 1/ }));
    expect(screen.getByText("Resumo original")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Restaurar esta versão" }),
    );
    await user.click(screen.getByRole("button", { name: "Restaurar versão" }));
    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
    expect(
      await screen.findByRole("button", { name: /Versão 3/ }),
    ).toBeInTheDocument();
    expect((await resumeRepository.get(resume.id)).content.summary).toBe(
      "Resumo original",
    );
    expect(await resumeRepository.versions(resume.id)).toHaveLength(3);
  });
  it("preserva edição em conflito e permite salvá-la como novo currículo", async () => {
    const resume = await seed();
    const user = userEvent.setup();
    renderPage();
    await user.click(
      await screen.findByRole("button", { name: "Editar currículo" }),
    );
    await resumeRepository.save(
      resume.id,
      { name: "Outra aba", content: resume.content },
      1,
    );
    await user.type(
      screen.getByLabelText("Resumo profissional"),
      "Experiência real desta aba",
    );
    await user.click(screen.getByRole("button", { name: "Salvar e fechar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("outra aba");
    await user.click(
      screen.getByRole("button", { name: "Salvar campos como novo currículo" }),
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    const items = await resumeRepository.list();
    expect(items).toHaveLength(2);
    expect((await resumeRepository.get(resume.id)).name).toBe("Outra aba");
    expect(items.find((item) => item.id !== resume.id)?.content.summary).toBe(
      "Experiência real desta aba",
    );
  });
  it("salva alterações pendentes antes de sair pela navegação SPA", async () => {
    const resume = await seed();
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [
        { path: "/curriculos", element: <ResumesPage /> },
        { path: "/fora", element: <h1>Outra página</h1> },
      ],
      { initialEntries: ["/curriculos"] },
    );
    render(<RouterProvider router={router} />);
    await user.click(
      await screen.findByRole("button", { name: "Editar currículo" }),
    );
    await user.type(
      screen.getByLabelText("Resumo profissional"),
      "Persistir ao navegar",
    );
    await act(async () => {
      await router.navigate("/fora");
    });
    expect(
      await screen.findByRole("heading", { name: "Outra página" }),
    ).toBeInTheDocument();
    expect((await resumeRepository.get(resume.id)).content.summary).toBe(
      "Persistir ao navegar",
    );
  });
  it("bloqueia saída com campos inválidos e exige confirmação para descartá-los", async () => {
    await seed();
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [
        { path: "/curriculos", element: <ResumesPage /> },
        { path: "/fora", element: <h1>Outra página</h1> },
      ],
      { initialEntries: ["/curriculos"] },
    );
    render(<RouterProvider router={router} />);
    await user.click(
      await screen.findByRole("button", { name: "Editar currículo" }),
    );
    await user.type(screen.getByLabelText("E-mail"), "invalido");
    const unload = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(unload);
    expect(unload.defaultPrevented).toBe(true);
    await act(async () => {
      await router.navigate("/fora");
    });
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Corrija os campos",
    );
    expect(router.state.location.pathname).toBe("/curriculos");
    await user.click(screen.getByRole("button", { name: "Fechar sem salvar" }));
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.getByLabelText("E-mail")).toHaveValue("invalido");
    await user.click(screen.getByRole("button", { name: "Fechar sem salvar" }));
    await user.click(
      screen.getByRole("button", { name: "Descartar e fechar" }),
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect((await resumeRepository.list())[0].content.personal.email).toBe("");
  });
  it("mostra um erro de leitura sem apresentar uma coleção vazia falsa", async () => {
    vi.spyOn(resumeRepository, "list").mockRejectedValue(
      new DOMException("Bloqueado", "SecurityError"),
    );
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "armazenamento local está indisponível",
    );
    expect(
      screen.getByRole("button", { name: "Novo currículo" }),
    ).toBeDisabled();
    vi.restoreAllMocks();
    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(
      await screen.findByRole("heading", {
        name: "Uma nova versão da sua trajetória.",
      }),
    ).toBeInTheDocument();
  });
});
