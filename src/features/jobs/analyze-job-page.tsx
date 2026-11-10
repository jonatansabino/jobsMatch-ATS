import { ScanSearch } from "lucide-react";
import { FeaturePlaceholder } from "@/components/shared/feature-placeholder";
export function AnalyzeJobPage() {
  return (
    <FeaturePlaceholder
      title="Analisar Vaga"
      description="Descubra como suas experiências se conectam aos requisitos de uma vaga."
      icon={ScanSearch}
      emptyTitle="Encontre os pontos de conexão."
      emptyDescription="O analisador local comparará o texto da vaga com seu currículo. A análise ainda não está disponível. O resultado será uma estimativa heurística, sem vínculo com sistemas ATS de empresas."
      actionLabel="Analisar compatibilidade"
      stage="Etapa 4"
      capabilities={[
        "Identificar requisitos da descrição.",
        "Conferir palavras-chave e evidências.",
        "Receber recomendações baseadas em regras.",
      ]}
    />
  );
}
