import {
  LayoutDashboard,
  Files,
  ScanSearch,
  History,
  BriefcaseBusiness,
  PanelsTopLeft,
  Settings2,
} from "lucide-react";

export const navigation = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard, group: "workspace" },
  {
    path: "/curriculos",
    label: "Meus Currículos",
    icon: Files,
    group: "workspace",
  },
  {
    path: "/analisar-vaga",
    label: "Analisar Vaga",
    icon: ScanSearch,
    group: "workspace",
  },
  {
    path: "/historico",
    label: "Histórico de Análises",
    icon: History,
    group: "workspace",
  },
  {
    path: "/candidaturas",
    label: "Minhas Candidaturas",
    icon: BriefcaseBusiness,
    group: "workspace",
  },
  {
    path: "/modelos",
    label: "Modelos de Currículos",
    icon: PanelsTopLeft,
    group: "workspace",
  },
  {
    path: "/configuracoes",
    label: "Configurações",
    icon: Settings2,
    group: "settings",
  },
] as const;
