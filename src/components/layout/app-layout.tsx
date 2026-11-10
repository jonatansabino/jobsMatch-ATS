import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ChevronRight, Menu, Plus } from "lucide-react";
import { navigation } from "@/app/navigation";
import { Sidebar, Brand } from "./sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeMenu } from "@/components/shared/theme-menu";

export function AppLayout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const title =
    navigation.find((item) => item.path === pathname)?.label ??
    "Página não encontrada";
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);
  useEffect(() => {
    document.title = `${title} | JobMatch ATS`;
    if (previousPath.current !== pathname) {
      mainRef.current?.focus();
      window.scrollTo({ top: 0 });
      previousPath.current = pathname;
    }
  }, [pathname, title]);
  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-50 rounded-md bg-primary px-4 py-3 text-white focus:not-sr-only"
      >
        Pular para o conteúdo
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r lg:block">
        <Sidebar />
      </aside>
      <div className="lg:pl-[252px]">
        <header className="flex h-[76px] items-center justify-between gap-3 border-b bg-card px-4 sm:px-8 lg:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="lg:hidden"
                  aria-label="Abrir menu de navegação"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] gap-0 p-0">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <SheetDescription className="sr-only">
                  Acesse as páginas do JobMatch ATS.
                </SheetDescription>
                <Sidebar onNavigate={() => setMenuOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="sm:hidden">
              <Brand />
            </div>
            <nav
              aria-label="Localização"
              className="hidden items-center gap-3 text-xs sm:flex"
            >
              <Link to="/" className="text-muted-foreground hover:text-primary">
                Meu espaço
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <span aria-current="page" className="font-medium">
                {title}
              </span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <ThemeMenu />
            <Button asChild className="hidden sm:inline-flex">
              <Link to="/analisar-vaga">
                <Plus className="size-4" />
                Analisar vaga
              </Link>
            </Button>
          </div>
        </header>
        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="mx-auto max-w-[1500px] px-4 py-7 focus-visible:outline-none sm:px-8 sm:py-9 lg:px-9"
        >
          <Outlet />
        </main>
        <footer className="mx-4 flex flex-wrap justify-between gap-2 border-t py-5 text-[11px] text-muted-foreground sm:mx-8 lg:mx-9">
          <span>JobMatch ATS · Seu próximo passo profissional.</span>
          <span>Etapa 1 · Estrutura e design system</span>
        </footer>
      </div>
    </div>
  );
}
