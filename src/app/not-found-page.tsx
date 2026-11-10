import { Link } from "react-router-dom";
import { ArrowLeft, MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <MapPinOff className="mb-5 size-12 text-primary" strokeWidth={1.3} />
      <p className="text-xs font-medium text-muted-foreground">ERRO 404</p>
      <h1 className="mt-3 text-2xl font-semibold">
        Esta página não foi encontrada.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Continue sua jornada a partir do dashboard.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">
          <ArrowLeft />
          Voltar ao dashboard
        </Link>
      </Button>
    </div>
  );
}
