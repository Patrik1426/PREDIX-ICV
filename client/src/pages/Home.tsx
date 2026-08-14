// ============================================================
// HOME — Shell post-login de PREDIX-ICV.
// V0: identidad del usuario (RBAC real) + grid de módulos accesibles.
// Los 5 módulos de la propuesta y el chatbot siguen sin pantalla propia —
// "Próximamente" hasta que se construyan (ver TODOs en drizzle/schema.ts
// y server/routers.ts).
// ============================================================

import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { MODULE_LABELS, MODULE_DESCRIPTIONS } from "@/lib/moduleLabels";
import { INSTITUTIONAL_ROLE_LABELS } from "@/lib/institutionalRoles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut } from "lucide-react";

export default function Home() {
  const { user, logout } = useAuth();
  const { data: profile } = trpc.auth.getUserProfile.useQuery();
  const { data: accessibleModules, isLoading: modulesLoading } =
    trpc.auth.getAccessibleModules.useQuery();

  const roleLabel = profile?.institutionalRole
    ? INSTITUTIONAL_ROLE_LABELS[profile.institutionalRole] ?? profile.institutionalRole
    : "";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-sidebar text-sidebar-foreground">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
              IC
            </div>
            <div>
              <div className="font-semibold leading-tight">PREDIX-ICV</div>
              <div className="text-xs text-sidebar-foreground/70 leading-tight">
                Instituto de Control Vehicular de Nuevo León
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{user?.name ?? profile?.name}</div>
              <div className="text-xs text-sidebar-foreground/70">{roleLabel}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => logout()} title="Cerrar sesión">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Módulos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Acceso según tu rol institucional
            {roleLabel ? ` — ${roleLabel}` : ""}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulesLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}

          {!modulesLoading &&
            Object.entries(MODULE_LABELS).map(([slug, label]) => {
              const hasAccess = accessibleModules?.includes(slug) ?? false;
              if (!hasAccess) return null;
              return (
                <Card key={slug} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{label}</CardTitle>
                      <Badge variant="secondary">Próximamente</Badge>
                    </div>
                    <CardDescription>{MODULE_DESCRIPTIONS[slug]}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}

          {!modulesLoading && (accessibleModules?.length ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">
              Tu rol no tiene módulos habilitados todavía.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
