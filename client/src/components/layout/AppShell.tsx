// ============================================================
// AppShell — sidebar de navegación + contenedor de contenido.
// Sidebar lista Tablero + los módulos accesibles por RBAC (auth.getAccessibleModules).
// Colapsable en escritorio (preferencia guardada en localStorage); en
// móvil se abre como Sheet.
// ============================================================

import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { MODULE_LABELS } from "@/lib/moduleLabels";
import { INSTITUTIONAL_ROLE_LABELS } from "@/lib/institutionalRoles";
import { MODULE_ICONS, MODULE_ORDER, MODULE_ACCENT } from "@/lib/moduleIcons";
import { hasGroupAccess } from "@/lib/moduleGroups";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LayoutGrid, LogOut, Menu, PanelLeftClose, PanelLeft, ShieldCheck } from "lucide-react";

const COLLAPSE_KEY = "predix-icv:sidebar-collapsed";

function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(COLLAPSE_KEY) === "1";
  });

  useEffect(() => {
    window.localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  return [collapsed, setCollapsed] as const;
}

function NavItem({
  href,
  active,
  collapsed,
  icon,
  iconColorClass,
  label,
  onNavigate,
}: {
  href: string;
  active: boolean;
  collapsed: boolean;
  icon: ReactNode;
  iconColorClass?: string;
  label: string;
  onNavigate?: () => void;
}) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl py-2 text-sm font-medium transition-all",
        collapsed ? "justify-center px-0" : "px-2",
        active
          ? "bg-sidebar-pill text-sidebar-pill-foreground shadow-sm"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      )}
    >
      <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center", active && iconColorClass)}>
        {icon}
      </span>
      {!collapsed && <span className="min-w-0 flex-1 leading-tight">{label}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

const BRAND_GRADIENT = "linear-gradient(135deg, var(--sidebar-primary), var(--chart-3))";

function NavContent({
  collapsed,
  onNavigate,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  onToggleCollapse?: () => void;
}) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { data: profile } = trpc.auth.getUserProfile.useQuery();
  const { data: accessibleModules, isLoading: modulesLoading } = trpc.auth.getAccessibleModules.useQuery();

  const roleLabel = profile?.institutionalRole
    ? INSTITUTIONAL_ROLE_LABELS[profile.institutionalRole] ?? profile.institutionalRole
    : "";
  const navSlugs = [...MODULE_ORDER, "admin"].filter((slug) => hasGroupAccess(slug, accessibleModules));

  const displayName = user?.name ?? profile?.name ?? "";
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div
        className={cn(
          "flex items-center gap-2",
          collapsed ? "flex-col justify-center py-3" : "h-16 justify-between px-4"
        )}
      >
        <div className={cn("flex items-center gap-3", collapsed ? "flex-col" : "min-w-0")}>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sidebar-primary-foreground font-bold"
            style={{ background: BRAND_GRADIENT }}
          >
            IC
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-semibold leading-tight">PREDIX-ICV</div>
              <div className="truncate text-xs text-sidebar-foreground/70 leading-tight">
                Instituto de Control Vehicular
              </div>
            </div>
          )}
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={collapsed ? "Expandir menú" : "Contraer menú"}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sidebar-pill text-sidebar-pill-foreground shadow-sm transition-colors hover:bg-sidebar-accent"
          >
            {collapsed ? <PanelLeft className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      <nav className={cn("flex-1 space-y-1 overflow-y-auto overflow-x-hidden py-2", collapsed ? "px-2" : "px-3")}>
        <NavItem
          href="/"
          active={location === "/"}
          collapsed={collapsed}
          icon={<LayoutGrid className="h-5 w-5" />}
          iconColorClass="text-primary"
          label="Tablero"
          onNavigate={onNavigate}
        />

        {!collapsed && (
          <div className="pt-3 pb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
            Módulos
          </div>
        )}
        {collapsed && <div className="my-2 border-t border-sidebar-border" />}

        {modulesLoading &&
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className={cn("h-9 animate-pulse rounded-xl bg-sidebar-accent/40", collapsed ? "mx-auto w-9" : "mx-1")}
            />
          ))}

        {navSlugs.map((slug) => {
          const href = `/modulos/${slug}`;
          const active = location === href;
          const accent = MODULE_ACCENT[slug];
          return (
            <NavItem
              key={slug}
              href={href}
              active={active}
              collapsed={collapsed}
              icon={MODULE_ICONS[slug]}
              iconColorClass={accent.text}
              label={MODULE_LABELS[slug]}
              onNavigate={onNavigate}
            />
          );
        })}

        {!modulesLoading && navSlugs.length === 0 && !collapsed && (
          <p className="px-3 py-2 text-xs text-sidebar-foreground/60">
            Tu rol no tiene módulos habilitados todavía.
          </p>
        )}
      </nav>

      <div className={cn("flex items-center gap-3 border-t border-sidebar-border p-4", collapsed && "justify-center px-2")}>
        <div className="shrink-0 rounded-full p-[1.5px]" style={{ background: BRAND_GRADIENT }}>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sidebar text-xs font-semibold">
            {initial}
          </div>
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{displayName}</div>
              <div className="truncate text-xs text-sidebar-foreground/70">{roleLabel}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => logout()}
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useSidebarCollapsed();

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className={cn("hidden shrink-0 transition-[width] duration-200 lg:block", collapsed ? "w-[4.5rem]" : "w-64")}>
        <div className="sticky top-0 h-screen p-3">
          <div
            className="h-full overflow-hidden rounded-2xl ring-1 ring-black/5"
            style={{ boxShadow: "0 8px 30px -12px oklch(0.55 0.05 55 / 0.35)" }}
          >
            <NavContent collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b bg-sidebar px-4 text-sidebar-foreground lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <NavContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-semibold">PREDIX-ICV</span>
        </header>

        <header className="sticky top-0 z-10 hidden h-14 items-center justify-between gap-3 border-b bg-sidebar px-6 text-sidebar-foreground lg:flex">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/70">
              Instituto de Control Vehicular de Nuevo León
            </p>
            <p className="truncate text-sm font-semibold">PREDIX-ICV · Panel institucional</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs font-medium text-sidebar-foreground/70">Sesión institucional activa</span>
            <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
            <Badge variant="outline" className="gap-1.5 border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              Entorno restringido
            </Badge>
          </div>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
