import { PanelsTopLeft } from "lucide-react";
import { FeaturePlaceholder } from "@/components/shared/feature-placeholder";
export function TemplatesPage() {
  return (
    <FeaturePlaceholder
      title="Modelos de Currículos"
      description="Apresente sua trajetória com clareza, legibilidade e uma estrutura profissional."
      icon={PanelsTopLeft}
      emptyTitle="O essencial merece destaque."
      emptyDescription="Os modelos ATS Clássico, Moderno e Executivo terão estrutura linear e texto legível. A prévia, a seleção e a exportação ainda não estão disponíveis."
      actionLabel="Escolher modelo"
      stage="Etapa 7"
      capabilities={[
        "Explorar três modelos profissionais.",
        "Conferir a prévia antes de selecionar.",
        "Imprimir ou exportar com texto selecionável.",
      ]}
    />
  );
}
