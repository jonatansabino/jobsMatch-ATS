import {
  Copy,
  FileText,
  History,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Resume } from "@/types/resume";
import { formatResumeDate } from "./utils";

export function ResumeCard({
  resume,
  busy,
  onEdit,
  onDuplicate,
  onPrimary,
  onHistory,
  onDelete,
  onRestore,
}: {
  resume: Resume;
  busy: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onPrimary: () => void;
  onHistory: () => void;
  onDelete: () => void;
  onRestore: () => void;
}) {
  return (
    <Card className="min-w-0 gap-0 shadow-none">
      <CardContent className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <FileText className="size-5" />
          </span>
          {resume.isPrimary && (
            <Badge variant="secondary" className="gap-1">
              <Star className="size-3" />
              Principal
            </Badge>
          )}
          {!resume.deletedAt && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label={`Ações de ${resume.name}`}
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  disabled={busy}
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={onEdit}>
                  <Pencil />
                  Editar ou renomear
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={onDuplicate}>
                  <Copy />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={onPrimary}
                  disabled={resume.isPrimary}
                >
                  <Star />
                  Definir como principal
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={onHistory}>
                  <History />
                  Histórico de versões
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={onDelete}
                  className="text-destructive"
                >
                  <Trash2 />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div>
          <h2 className="break-words font-semibold">{resume.name}</h2>
          <p className="mt-1 break-words text-sm text-muted-foreground">
            {resume.content.personal.professionalTitle ||
              resume.content.personal.fullName ||
              "Currículo em preenchimento"}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Versão {resume.revision} · {formatResumeDate(resume.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-4">
          {resume.deletedAt ? (
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={onRestore}
            >
              <RotateCcw />
              Restaurar currículo
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                disabled={busy}
              >
                <Pencil />
                Editar currículo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onHistory}
                disabled={busy}
              >
                <History />
                Versões
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
