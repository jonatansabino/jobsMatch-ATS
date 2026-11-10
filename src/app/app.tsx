import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./theme-provider";
import { AppLayout } from "@/components/layout/app-layout";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { ResumesPage } from "@/features/resumes/resumes-page";
import { AnalyzeJobPage } from "@/features/jobs/analyze-job-page";
import { HistoryPage } from "@/features/history/history-page";
import { ApplicationsPage } from "@/features/applications/applications-page";
import { TemplatesPage } from "@/features/templates/templates-page";
import { SettingsPage } from "@/features/settings/settings-page";
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
