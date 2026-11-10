import { Check, HardDrive, Info, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/shared/page-heading";
import { themeOptions } from "@/app/theme-options";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/use-theme";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <PageHeading
        eyebrow="DO SEU JEITO"
        title="Configurações"
        description="Personalize seu espaço e conheça como seus dados serão tratados."
      />
      <div className="space-y-5">
        <Card className="shadow-none">
          <CardContent>
            <h2 className="text-base font-semibold">Aparência</h2>
            <p className="mb-5 mt-1 text-sm text-muted-foreground">
              Escolha o tema que funciona melhor para você.
            </p>
            <div
              role="group"
              aria-label="Tema da interface"
              className="grid gap-3 sm:grid-cols-3"
            >
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant="outline"
                  aria-pressed={theme === value}
                  className={`h-20 justify-start gap-3 px-5 ${theme === value ? "border-primary bg-accent text-accent-foreground" : ""}`}
                  onClick={() => {
                    setTheme(value);
                    toast.success(`Tema ${label.toLowerCase()} selecionado`);
                  }}
                >
                  <Icon className="size-5" />
                  {label}
                  {theme === value && <Check className="ml-auto size-4" />}
                </Button>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              O modo automático acompanha o sistema. Esta preferência é salva no
              LocalStorage do navegador.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="shadow-none">
            <CardContent>
              <ShieldCheck
                className="mb-4 size-6 text-primary"
                strokeWidth={1.5}
              />
              <h2 className="text-sm font-semibold">
                Privacidade por princípio
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Sem login, serviços de IA ou envio de documentos. Nesta etapa,
                apenas a preferência de tema é armazenada. A persistência de
                currículos e análises será implementada com IndexedDB na Etapa
                2.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent>
              <Info className="mb-4 size-6 text-primary" strokeWidth={1.5} />
              <h2 className="text-sm font-semibold">Sobre a análise ATS</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                O futuro Match Score será uma estimativa de alinhamento
                calculada por regras locais. Não representa uma avaliação
                oficial de empresas. Nenhuma experiência será adicionada sem
                confirmação.
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="shadow-none">
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <HardDrive className="size-5 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Gerenciar dados</h2>
              </div>
              <Badge variant="secondary" className="font-normal">
                Disponível na Etapa 9
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Backup JSON, restauração, demonstração e limpeza de dados serão
              disponibilizados após a implementação da persistência. Nenhum
              documento está sendo armazenado nesta etapa.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
