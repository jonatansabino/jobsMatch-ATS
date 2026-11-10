import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./theme-provider";
import { AppLayout } from "@/components/layout/app-layout";
const DashboardPage = lazy(() =>
  import("@/features/dashboard/dashboard-page").then((module) => ({
    default: module.DashboardPage,
  })),
);
const ResumesPage = lazy(() =>
  import("@/features/resumes/resumes-page").then((module) => ({
    default: module.ResumesPage,
  })),
);
const AnalyzeJobPage = lazy(() =>
  import("@/features/jobs/analyze-job-page").then((module) => ({
    default: module.AnalyzeJobPage,
  })),
);
const HistoryPage = lazy(() =>
  import("@/features/history/history-page").then((module) => ({
    default: module.HistoryPage,
  })),
);
const ApplicationsPage = lazy(() =>
  import("@/features/applications/applications-page").then((module) => ({
    default: module.ApplicationsPage,
  })),
);
const TemplatesPage = lazy(() =>
  import("@/features/templates/templates-page").then((module) => ({
    default: module.TemplatesPage,
  })),
);
const SettingsPage = lazy(() =>
  import("@/features/settings/settings-page").then((module) => ({
    default: module.SettingsPage,
  })),
);
import { NotFoundPage } from "./not-found-page";

export function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="curriculos" element={<ResumesPage />} />
            <Route path="analisar-vaga" element={<AnalyzeJobPage />} />
            <Route path="historico" element={<HistoryPage />} />
            <Route path="candidaturas" element={<ApplicationsPage />} />
            <Route path="modelos" element={<TemplatesPage />} />
            <Route path="configuracoes" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
