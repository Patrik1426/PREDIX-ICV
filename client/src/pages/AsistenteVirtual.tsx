// ============================================================
// AsistenteVirtual — página real de primer nivel (Módulo #1 por prioridad
// del ICVNL, ver docs/CUESTIONARIO_RESPUESTAS_ICVNL.md bloque 7.6). Ya no
// pasa por el shell de "vista previa" de ModuloDetalle.tsx — mismo patrón
// de página que Tablero.tsx (container + h1), porque ya no es una vista
// previa de algo por construir, es el LLM real funcionando.
// ============================================================

import { Redirect } from "wouter";
import { trpc } from "@/lib/trpc";
import { hasGroupAccess } from "@/lib/moduleGroups";
import AsistenteChat, { LlmReal } from "@/components/AsistenteChat";

export default function AsistenteVirtual() {
  const { data: accessibleModules, isLoading } = trpc.auth.getAccessibleModules.useQuery();

  if (!isLoading && !hasGroupAccess("chatbot", accessibleModules)) return <Redirect to="/" />;

  return (
    <div className="container py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asistente Virtual</h1>
          <p className="mt-1 text-muted-foreground">Resuelve dudas ciudadanas al instante, en lenguaje natural.</p>
        </div>
        <LlmReal />
      </div>

      <AsistenteChat />
    </div>
  );
}
