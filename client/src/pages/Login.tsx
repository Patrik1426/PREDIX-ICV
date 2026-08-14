// ============================================================
// LOGIN — PREDIX-ICV
// Login institucional real (auth.institutionalLogin) contra la tabla users.
// ============================================================

import { useState } from "react";
import { useLocation } from "wouter";
import { AlertCircle, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CarrilFlujo, DatoEjemplo } from "@/components/demo/DemoVisuals";
import { LineaCarril } from "@/components/layout/LineaCarril";
import { DEMO_DELEGACIONES } from "@/lib/demoData";

// Solo para desarrollo local — nunca se incluye en el build de producción
// (import.meta.env.DEV se elimina en tiempo de compilación por Vite).
const DEMO_CREDENTIALS = import.meta.env.DEV
  ? { email: "admin@icvnl.gob.mx", employeeId: "ADMIN001", password: "Demo@2026" }
  : null;

export default function Login() {
  const [, navigate] = useLocation();
  const { refresh } = useAuth();
  const [email, setEmail] = useState(DEMO_CREDENTIALS?.email ?? "");
  const [password, setPassword] = useState(DEMO_CREDENTIALS?.password ?? "");
  const [employeeId, setEmployeeId] = useState(DEMO_CREDENTIALS?.employeeId ?? "");

  const loginMut = trpc.auth.institutionalLogin.useMutation({
    onSuccess: async () => {
      await refresh();
      navigate("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMut.mutate({ email, password, employeeId });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel institucional — misma identidad que el sidebar de la app */}
      <div className="flex flex-col justify-between bg-sidebar p-8 text-sidebar-foreground lg:p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
            IC
          </div>
          <div>
            <div className="font-semibold leading-tight">PREDIX-ICV</div>
            <div className="text-xs text-sidebar-foreground/70 leading-tight">Instituto de Control Vehicular</div>
          </div>
        </div>

        <div className="max-w-sm space-y-5 py-12 lg:py-0">
          <h1 className="text-3xl font-bold leading-tight">
            Anticipar la fila, antes de que se forme.
          </h1>
          <LineaCarril className="opacity-40" />
          <div className="space-y-3 rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/70">
                Ocupación por delegación
              </span>
              <DatoEjemplo />
            </div>
            <div className="space-y-2 [&_span]:text-sidebar-foreground/80">
              {DEMO_DELEGACIONES.slice(0, 3).map((d) => (
                <CarrilFlujo key={d.nombre} {...d} />
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-sidebar-foreground/50">Nuevo León · icvnl.gob.mx</p>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Acceso institucional</h2>
            <p className="text-sm text-muted-foreground">Ingresa con tu cuenta del ICVNL.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo institucional</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Número de empleado</Label>
              <Input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {DEMO_CREDENTIALS && (
              <p className="text-xs text-muted-foreground">
                Credenciales de desarrollo precargadas — solo en este entorno.
              </p>
            )}

            {loginMut.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Credenciales inválidas.</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loginMut.isPending}>
              {loginMut.isPending ? "Ingresando..." : "Ingresar"}
              {!loginMut.isPending && <ArrowRight className="ml-1 h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
