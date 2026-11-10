import { History } from "lucide-react";
import { FeaturePlaceholder } from "@/components/shared/feature-placeholder";
export function HistoryPage() {
  return (
    <FeaturePlaceholder
      title="Histórico de Análises"
      description="Um registro para acompanhar suas oportunidades e sua evolução."
      icon={History}
      emptyTitle="Cada análise conta uma parte da jornada."
      emptyDescription="Suas análises serão registradas com a versão do currículo utilizada. O histórico, os filtros e as comparações ainda não estão disponíveis."
      actionLabel="Comparar análises"
      stage="Etapa 8"
      capabilities={[
        "Consultar resultados anteriores.",
        "Pesquisar e filtrar oportunidades.",
        "Comparar a compatibilidade entre análises.",
      ]}
    />
  );
}
