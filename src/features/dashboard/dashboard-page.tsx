import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileCheck2,
  Files,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  FilePenLine,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useResumes } from "@/hooks/use-resumes";
import { PageHeading } from "@/components/shared/page-heading";

const metrics = [
  {
    label: "Currículos",
    icon: Files,
    description: "Seus perfis profissionais",
  },
  {
    label: "Vagas analisadas",
    icon: ScanSearch,
    description: "Oportunidades em perspectiva",
  },
  {
    label: "Candidaturas ativas",
    icon: BriefcaseBusiness,
    description: "Sua jornada em movimento",
  },
];
const additionalMetrics = [
  { label: "Média ATS", icon: TrendingUp },
  { label: "Melhor match", icon: Trophy },
  { label: "Otimizados", icon: FilePenLine },
];
const steps = [
  {
    title: "Organize seu currículo",
    text: "Reúna suas experiências, habilidades e conquistas.",
    path: "/curriculos",
  },
  {
    title: "Encontre uma oportunidade",
    text: "Tenha em mãos a descrição da vaga que faz sentido para você.",
    path: "/analisar-vaga",
  },
  {
    title: "Entenda sua compatibilidade",
    text: "Identifique pontos fortes e requisitos que precisam de atenção.",
    path: "/historico",
  },
];
export function DashboardPage() {
  const { resumes, loading, error } = useResumes();
  const total =
    loading || error
      ? "—"
      : resumes.filter((resume) => !resume.deletedAt).length;
  return (
    <>
      <PageHeading
        eyebrow="SEU ESPAÇO DE CARREIRA"
        title="Sua próxima oportunidade começa aqui."
        description="Mais organização para seus currículos. Mais clareza para o seu próximo passo."
      />
      <section
        aria-labelledby="welcome-title"
        className="relative mb-6 flex min-h-40 items-center justify-between gap-6 overflow-hidden rounded-xl border border-primary/10 bg-accent px-6 py-7 sm:px-7"
      >
        <div className="max-w-xl">
          <Badge
            variant="outline"
            className="mb-3 border-primary/20 bg-card/50 text-[10px] font-medium text-accent-foreground"
          >
            Feito para sua jornada
          </Badge>
          <h2
            id="welcome-title"
            className="text-xl font-semibold tracking-tight text-accent-foreground"
          >
            Seu talento merece encontrar a vaga certa.
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-accent-foreground/85">
            Um lugar para organizar seus currículos, entender requisitos e
            acompanhar cada oportunidade.
          </p>
        </div>
        <div
          aria-hidden="true"
          className="relative mr-5 hidden h-28 w-32 shrink-0 items-center justify-center sm:flex"
        >
          <div className="absolute h-24 w-20 -rotate-12 rounded-lg border border-primary/25 bg-card/30" />
          <FileCheck2
            className="relative size-24 text-primary"
            strokeWidth={0.9}
          />
          <span className="absolute -bottom-1 right-0 rounded-full bg-card p-2 text-primary">
            <Sparkles className="size-5" strokeWidth={1.5} />
          </span>
        </div>
      </section>
      <section
        aria-label="Resumo do seu espaço"
        className="mb-7 grid gap-4 sm:grid-cols-3"
      >
        {metrics.map(({ label, icon: Icon, description }) => (
          <Card key={label} className="py-5 shadow-none">
            <CardContent className="flex items-center gap-4 px-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-5" strokeWidth={1.6} />
              </span>
              <div>
                <h2 className="text-xs font-medium text-muted-foreground">
                  {label}
                </h2>
                <p
                  className="my-1 text-2xl font-semibold leading-none"
                  aria-label={
                    label === "Currículos"
                      ? "Total de currículos ativos"
                      : "Ainda indisponível"
                  }
                >
                  {label === "Currículos" ? total : "—"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <Card className="gap-0 py-0 shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-6 py-5">
            <div>
              <h2 className="text-sm font-semibold">Análises recentes</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Cada oportunidade, uma nova perspectiva.
              </p>
            </div>
            <Badge variant="secondary" className="text-[10px] font-normal">
              Em breve
            </Badge>
          </div>
          <CardContent className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
            <span className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <FileCheck2 className="size-8" strokeWidth={1.3} />
            </span>
            <h3 className="text-lg font-semibold tracking-tight">
              Seu próximo passo, mais claro.
            </h3>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Quando o analisador estiver disponível, suas análises aparecerão
              aqui.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-5">
              <Link to="/curriculos">
                Ver meus currículos
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="gap-0 shadow-none">
          <div className="px-6">
            <h2 className="text-sm font-semibold">
              Uma jornada com mais direção
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Conheça o que vem nas próximas etapas.
            </p>
          </div>
          <CardContent className="px-6 pt-6">
            <ol className="space-y-5">
              {steps.map((step, i) => (
                <li key={step.title}>
                  <Link to={step.path} className="group flex gap-3 rounded-md">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-xs font-semibold text-accent-foreground">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="flex items-center gap-2 text-xs font-semibold group-hover:text-primary">
                        {step.title}
                        <ArrowRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {step.text}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
      <section
        aria-label="Indicadores adicionais"
        className="mt-5 grid grid-cols-3 divide-x rounded-xl border bg-card px-2 py-4"
      >
        {additionalMetrics.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center gap-2 px-2 text-xs sm:flex-row sm:gap-3"
          >
            <Icon className="size-4 text-muted-foreground" strokeWidth={1.6} />
            <span className="text-center text-muted-foreground">{label}</span>
            <span className="font-semibold" aria-label="Ainda indisponível">
              —
            </span>
          </div>
        ))}
      </section>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[11px] leading-relaxed text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 shrink-0" />
          Projetado para funcionar inteiramente no navegador.
        </span>
        <span className="flex items-center gap-1.5">
          <Clock3 className="size-3.5 shrink-0" />
          Total de currículos salvo localmente. Demais indicadores em breve.
        </span>
      </div>
    </>
  );
}
