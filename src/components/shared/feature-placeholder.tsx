import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Clock3, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeading } from "./page-heading";

interface FeaturePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  actionLabel: string;
  stage: string;
  capabilities: string[];
}
export function FeaturePlaceholder({
  title,
  description,
  icon: Icon,
  emptyTitle,
  emptyDescription,
  actionLabel,
  stage,
  capabilities,
}: FeaturePlaceholderProps) {
  return (
    <>
      <PageHeading
        eyebrow="Seu espaço de carreira"
        title={title}
        description={description}
        action={
          <Button disabled>
            <Icon className="size-4" />
            {actionLabel}
          </Button>
        }
      />
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <Clock3 className="size-4 shrink-0 text-primary" />
        <span>
          Disponível na {stage}. Esta entrega inclui apenas a estrutura e a
          navegação.
        </span>
      </div>
      <Card className="shadow-none">
        <CardContent className="flex min-h-[365px] flex-col items-center justify-center p-6 text-center sm:p-12">
          <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Icon className="size-9" strokeWidth={1.3} />
          </div>
          <Badge variant="secondary" className="mb-4 gap-1.5 font-normal">
            <LockKeyhole className="size-3" />
            Em breve
          </Badge>
          <h2 className="text-xl font-semibold tracking-tight">{emptyTitle}</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {emptyDescription}
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Voltar ao dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
      <div className="mt-8">
        <h2 className="text-sm font-semibold">O que você poderá fazer aqui</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {capabilities.map((capability, i) => (
            <li
              key={capability}
              className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
            >
              <span className="text-xs font-semibold text-primary">
                0{i + 1}
              </span>
              {capability}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
