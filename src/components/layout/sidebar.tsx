import { NavLink, Link } from "react-router-dom";
import { ArrowUpRight, FileCheck2, ShieldCheck } from "lucide-react";
import { navigation } from "@/app/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      className="flex items-center gap-2.5 rounded-md"
      aria-label="JobMatch ATS — início"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-white dark:text-slate-950">
        <FileCheck2 className="size-5" strokeWidth={1.8} />
      </span>
      <span className="text-xl font-bold tracking-tight">
        JobMatch <span className="font-medium text-muted-foreground">ATS</span>
      </span>
    </Link>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-card px-4 py-7">
      <div className="px-3">
        <Brand onNavigate={onNavigate} />
      </div>
      <p className="mb-3 mt-12 px-3 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">
        ESPAÇO DE TRABALHO
      </p>
      <nav aria-label="Navegação principal" className="space-y-1.5">
        {navigation
          .filter((item) => item.group === "workspace")
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors hover:bg-muted",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              <item.icon className="size-[18px] shrink-0" strokeWidth={1.7} />
              {item.label}
            </NavLink>
          ))}
      </nav>
      <div className="mt-auto pt-10">
        <NavLink
          to="/configuracoes"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "mb-5 flex min-h-11 items-center gap-3 rounded-lg px-3 text-[13px] font-medium hover:bg-muted",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground",
            )
          }
        >
          <navigationSettings.icon className="size-[18px]" strokeWidth={1.7} />
          Configurações
        </NavLink>
        <Separator />
        <div className="px-3 pt-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium">
            <ShieldCheck className="size-4 text-primary" />
            Seu espaço é privado
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Sem conta, sem servidor. Seus currículos e preferências ficam neste
            navegador.
          </p>
          <Link
            to="/configuracoes"
            onClick={onNavigate}
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary"
          >
            Sobre a privacidade <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
const navigationSettings = navigation[6];
