import { Route, Switch } from "wouter";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { AppShell } from "@/components/layout/AppShell";
import Login from "@/pages/Login";
import Resumen from "@/pages/Resumen";
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
                <Resumen />
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
