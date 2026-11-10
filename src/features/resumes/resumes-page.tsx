import { useState } from "react";
import { Files, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/shared/page-heading";
import { ConfirmAction } from "@/components/shared/confirm-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useResumes } from "@/hooks/use-resumes";
import { resumeRepository } from "@/lib/storage/resume-repository";
import { storageErrorMessage } from "@/lib/storage/errors";
import type { Resume } from "@/types/resume";
import { CreateResumeDialog } from "./create-resume-dialog";
import { ResumeEditorDialog } from "./resume-editor-dialog";
import { ResumeVersionsDialog } from "./resume-versions-dialog";
import { ResumeCard } from "./resume-card";

export function ResumesPage() {
  const { resumes, loading, error, retry } = useResumes();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [trash, setTrash] = useState(false);
  const [create, setCreate] = useState(false);
  const [editing, setEditing] = useState<Resume | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Resume | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const active = resumes.filter((resume) => !resume.deletedAt);
  const deleted = resumes.filter((resume) => resume.deletedAt);
  const history = resumes.find(
    (resume) => resume.id === historyId && !resume.deletedAt,
  );
  const matching = (trash ? deleted : active)
    .filter((resume) =>
      `${resume.name} ${resume.content.personal.fullName} ${resume.content.personal.professionalTitle}`
        .toLocaleLowerCase("pt-BR")
        .includes(query.toLocaleLowerCase("pt-BR")),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "pt-BR")
        : b.updatedAt.localeCompare(a.updatedAt) ||
          a.name.localeCompare(b.name),
    );

  async function run(
    id: string,
    action: () => Promise<unknown>,
    message: string,
  ) {
    setBusyId(id);
    setActionError(null);
    try {
      await action();
      toast.success(message);
    } catch (cause) {
      const message = storageErrorMessage(cause);
      setActionError(message);
      toast.error(message);
    } finally {
      setBusyId(null);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="SEU ESPAÇO DE CARREIRA"
        title="Meus Currículos"
        description="Suas experiências, organizadas para cada oportunidade. Os dados ficam neste navegador."
        action={
          <Button
            onClick={() => setCreate(true)}
            disabled={loading || Boolean(error)}
          >
            <Plus />
            Novo currículo
          </Button>
        }
      />
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1 space-y-2">
          <Label htmlFor="resume-search">Pesquisar currículos</Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              id="resume-search"
              className="pl-9"
              placeholder="Nome, pessoa ou título profissional"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="resume-sort">Ordenar por</Label>
          <select
            id="resume-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-9 rounded-md border bg-card px-3 text-sm"
          >
            <option value="recent">Mais recentes</option>
            <option value="name">Nome (A–Z)</option>
          </select>
        </div>
        <Button
          variant={trash ? "secondary" : "outline"}
          aria-pressed={trash}
          onClick={() => setTrash((value) => !value)}
        >
          <Trash2 />
          {trash ? "Ver currículos ativos" : `Lixeira (${deleted.length})`}
        </Button>
      </div>
      {(error || actionError) && (
        <div
          role="alert"
          className="mb-5 space-y-3 rounded-lg border border-destructive/30 p-4 text-sm"
        >
          <p>{error || actionError}</p>
          {error && (
            <Button variant="outline" size="sm" onClick={retry}>
              Tentar novamente
            </Button>
          )}
        </div>
      )}
      {loading ? (
        <div
          aria-label="Carregando currículos"
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {[1, 2, 3].map((id) => (
            <Skeleton key={id} className="h-60 rounded-xl" />
          ))}
        </div>
      ) : (
        !error && (
          <>
            <p className="mb-4 text-xs text-muted-foreground" role="status">
              {matching.length} currículo(s){" "}
              {trash ? "na lixeira" : "encontrado(s)"}
            </p>
            {matching.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {matching.map((resume) => (
                  <ResumeCard
                    key={resume.id}
                    resume={resume}
                    busy={busyId !== null}
                    onEdit={() => setEditing(resume)}
                    onHistory={() => setHistoryId(resume.id)}
                    onDelete={() => setDeleting(resume)}
                    onDuplicate={() =>
                      void run(
                        resume.id,
                        async () => {
                          const copy = await resumeRepository.duplicate(
                            resume.id,
                          );
                          setEditing(copy);
                        },
                        "Cópia criada com histórico independente",
                      )
                    }
                    onPrimary={() =>
                      void run(
                        resume.id,
                        () => resumeRepository.setPrimary(resume.id),
                        "Currículo principal atualizado",
                      )
                    }
                    onRestore={() =>
                      void run(
                        resume.id,
                        () => resumeRepository.restoreFromTrash(resume.id),
                        "Currículo restaurado",
                      )
                    }
                  />
                ))}
              </div>
            ) : (
              <Card className="shadow-none">
                <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
                  <span className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                    <Files className="size-8" strokeWidth={1.4} />
                  </span>
                  <h2 className="text-xl font-semibold">
                    {query
                      ? "Nenhum currículo corresponde à pesquisa."
                      : trash
                        ? "Sua lixeira está vazia."
                        : "Uma nova versão da sua trajetória."}
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {query
                      ? "Tente outro nome ou limpe a pesquisa."
                      : trash
                        ? "Currículos excluídos poderão ser recuperados aqui, incluindo suas versões."
                        : "Crie seu primeiro currículo e preencha suas informações aos poucos. O salvamento automático mantém suas alterações neste navegador."}
                  </p>
                  {query ? (
                    <Button
                      className="mt-5"
                      variant="outline"
                      onClick={() => setQuery("")}
                    >
                      Limpar pesquisa
                    </Button>
                  ) : (
                    !trash && (
                      <Button className="mt-5" onClick={() => setCreate(true)}>
                        <Plus />
                        Criar primeiro currículo
                      </Button>
                    )
                  )}
                </CardContent>
              </Card>
            )}
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              {trash
                ? "A exclusão é reversível. O currículo e seu histórico permanecem no IndexedDB até você restaurá-los. Não há remoção permanente nesta etapa."
                : "O primeiro currículo é definido como principal. Importação de documentos, prévia e análise ATS serão implementadas em etapas futuras."}
            </p>
          </>
        )
      )}
      {create && (
        <CreateResumeDialog
          onClose={() => setCreate(false)}
          onCreated={(resume) => {
            setCreate(false);
            setEditing(resume);
            setTrash(false);
          }}
        />
      )}
      {editing && (
        <ResumeEditorDialog
          key={editing.id}
          resume={editing}
          onClose={() => setEditing(null)}
        />
      )}
      {history && (
        <ResumeVersionsDialog
          key={history.id}
          resume={history}
          onClose={() => setHistoryId(null)}
        />
      )}
      {deleting && (
        <ConfirmAction
          title={`Excluir “${deleting.name}”?`}
          description="O currículo e todas as versões serão movidos para a lixeira. Você poderá restaurá-los. Se este for o principal, outro currículo ativo será selecionado."
          label="Mover para lixeira"
          destructive
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            await resumeRepository.trash(deleting.id);
            toast.success("Currículo movido para a lixeira");
          }}
        />
      )}
    </>
  );
}
