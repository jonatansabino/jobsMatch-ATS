import { ResumeConflictError } from "./resume-repository";

export function storageErrorMessage(error: unknown): string {
  if (error instanceof ResumeConflictError) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof error.name === "string"
  ) {
    if (/quota/i.test(error.name))
      return "O armazenamento do navegador está cheio. Libere espaço e tente salvar novamente. Seus campos continuam abertos.";
    if (/security|invalidstate|missingapi|unknown/i.test(error.name))
      return "O armazenamento local está indisponível. Verifique as permissões do navegador ou use uma janela normal e tente novamente.";
  }
  return "Não foi possível acessar os dados locais. Tente novamente. Alterações não salvas permanecem no formulário enquanto ele estiver aberto.";
}
