import { Files } from "lucide-react";
import { FeaturePlaceholder } from "@/components/shared/feature-placeholder";
export function ResumesPage() {
  return (
    <FeaturePlaceholder
      title="Meus Currículos"
      description="Suas experiências, organizadas para cada oportunidade."
      icon={Files}
      emptyTitle="Uma nova versão da sua trajetória."
      emptyDescription="Aqui você poderá criar, importar e gerenciar seus currículos. A criação e a importação ainda não estão disponíveis."
      actionLabel="Novo currículo"
      stage="Etapa 3"
      capabilities={[
        "Importar arquivos PDF, DOCX e TXT.",
        "Editar suas informações por seção.",
        "Criar versões para diferentes vagas.",
      ]}
    />
  );
}
