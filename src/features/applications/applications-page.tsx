import { BriefcaseBusiness } from "lucide-react";
import { FeaturePlaceholder } from "@/components/shared/feature-placeholder";
export function ApplicationsPage() {
  return (
    <FeaturePlaceholder
      title="Minhas Candidaturas"
      description="Mais organização em cada etapa do seu processo seletivo."
      icon={BriefcaseBusiness}
      emptyTitle="Dê espaço às suas próximas oportunidades."
      emptyDescription="Aqui você acompanhará candidaturas em um quadro, de vagas salvas até o resultado final. O gerenciamento de candidaturas ainda não está disponível."
      actionLabel="Nova candidatura"
      stage="Etapa 8"
      capabilities={[
        "Organizar vagas em um quadro Kanban.",
        "Registrar links, datas e observações.",
        "Associar currículos e análises ATS.",
      ]}
    />
  );
}
