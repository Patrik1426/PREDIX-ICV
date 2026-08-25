import { Route, Switch } from "wouter";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { AppShell } from "@/components/layout/AppShell";
import Login from "@/pages/Login";
import Tablero from "@/pages/Tablero";
import Propuesta from "@/pages/Propuesta";
import AsistenteVirtual from "@/pages/AsistenteVirtual";
import CitasYOperacion from "@/pages/CitasYOperacion";
import PrediccionYAsignacion from "@/pages/PrediccionYAsignacion";
import PolicyStudio from "@/pages/PolicyStudio";
import ComponentShowcase from "@/pages/ComponentShowcase";
import ModuloDetalle from "@/pages/ModuloDetalle";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/login",
  });

  if (loading) return null;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" switchable>
      <NotificationProvider>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/">
            <RequireAuth>
              <AppShell>
                <Tablero />
              </AppShell>
            </RequireAuth>
          </Route>
          <Route path="/propuesta">
            <RequireAuth>
              <AppShell>
                <Propuesta />
              </AppShell>
            </RequireAuth>
          </Route>
          <Route path="/modulos/chatbot">
            <RequireAuth>
              <AppShell>
                <AsistenteVirtual />
              </AppShell>
            </RequireAuth>
          </Route>
          <Route path="/modulos/citas_operacion">
            <RequireAuth>
              <AppShell>
                <CitasYOperacion />
              </AppShell>
            </RequireAuth>
          </Route>
          <Route path="/modulos/prediccion_asignacion">
            <RequireAuth>
              <AppShell>
                <PrediccionYAsignacion />
              </AppShell>
            </RequireAuth>
          </Route>
          <Route path="/modulos/politica">
            <RequireAuth>
              <AppShell>
                <PolicyStudio />
              </AppShell>
            </RequireAuth>
          </Route>
          <Route path="/admin/componentes">
            <RequireAuth>
              <AppShell>
                <ComponentShowcase />
              </AppShell>
            </RequireAuth>
          </Route>
          <Route path="/modulos/:slug">
            <RequireAuth>
              <AppShell>
                <ModuloDetalle />
              </AppShell>
            </RequireAuth>
          </Route>
        </Switch>
        <Toaster />
      </NotificationProvider>
    </ThemeProvider>
  );
}
