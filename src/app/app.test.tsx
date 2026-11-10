import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { App } from "./app";
import { navigation } from "./navigation";
import { useTheme } from "@/hooks/use-theme";

function renderPage(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}
beforeEach(() => {
  localStorage.clear();
  useTheme.setState({ theme: "system" });
});
describe("Estrutura da Etapa 1", () => {
  it.each(navigation)("abre $label", ({ path, label }) => {
    renderPage(path);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      path === "/" ? "Sua próxima oportunidade começa aqui." : label,
    );
    expect(screen.getByRole("link", { name: label })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
  it("navega para currículos sem oferecer criação indisponível", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("link", { name: "Ver meus currículos" }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Meus Currículos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Novo currículo" }),
    ).toBeDisabled();
    expect(document.title).toBe("Meus Currículos | JobMatch ATS");
  });
  it("aplica e persiste a preferência de tema", async () => {
    const user = userEvent.setup();
    renderPage("/configuracoes");
    await user.click(screen.getByRole("button", { name: "Escuro" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(
      JSON.parse(localStorage.getItem("jobmatch-preferences")!).state.theme,
    ).toBe("dark");
    await user.click(screen.getByRole("button", { name: "Claro" }));
    expect(document.documentElement).not.toHaveClass("dark");
  });
  it("permite abrir e fechar o menu móvel ao navegar", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(
      screen.getByRole("button", { name: "Abrir menu de navegação" }),
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    await user.click(
      screen.getByRole("link", { name: "Modelos de Currículos" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Modelos de Currículos" }),
    ).toBeInTheDocument();
  });
  it("oferece retorno para rotas desconhecidas", async () => {
    const user = userEvent.setup();
    renderPage("/pagina-inexistente");
    expect(
      screen.getByRole("heading", { name: "Esta página não foi encontrada." }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Voltar ao dashboard" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Sua próxima oportunidade começa aqui.",
    );
  });
});
