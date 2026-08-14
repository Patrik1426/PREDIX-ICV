// ============================================================
// AppShell — sidebar de navegación + contenedor de contenido.
// Sidebar lista Resumen + los módulos accesibles por RBAC (auth.getAccessibleModules).
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
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LayoutGrid, LogOut, Menu, PanelLeftClose, PanelLeft } from "lucide-react";

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
  activeBarClass,
  activeSoftClass,
  label,
  onNavigate,
}: {
  href: string;
  active: boolean;
  collapsed: boolean;
  icon: ReactNode;
  iconColorClass?: string;
  activeBarClass: string;
  activeSoftClass?: string;
  label: string;
  onNavigate?: () => void;
}) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors",
        collapsed ? "justify-center px-0" : "px-3",
        active
          ? cn("text-sidebar-accent-foreground", activeSoftClass ?? "bg-sidebar-accent")
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
      )}
    >
      {active && (
        <span className={cn("absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full", activeBarClass)} />
      )}
      <span className={cn("shrink-0", iconColorClass)}>{icon}</span>
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

function NavContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { data: profile } = trpc.auth.getUserProfile.useQuery();
  const { data: accessibleModules } = trpc.auth.getAccessibleModules.useQuery();

  const roleLabel = profile?.institutionalRole
    ? INSTITUTIONAL_ROLE_LABELS[profile.institutionalRole] ?? profile.institutionalRole
    : "";
  const hasAccess = (slug: string) => accessibleModules?.includes(slug) ?? false;
  const navSlugs = [...MODULE_ORDER, "admin"].filter(hasAccess);

  const displayName = user?.name ?? profile?.name ?? "";
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className={cn("flex h-16 items-center gap-3", collapsed ? "justify-center px-2" : "px-5")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
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

      <nav className={cn("flex-1 space-y-1 overflow-y-auto overflow-x-hidden py-2", collapsed ? "px-2" : "px-3")}>
        <NavItem
          href="/"
          active={location === "/"}
          collapsed={collapsed}
          icon={<LayoutGrid className="h-5 w-5" />}
          activeBarClass="bg-sidebar-primary"
          label="Resumen"
          onNavigate={onNavigate}
        />

        {!collapsed && (
          <div className="pt-3 pb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
            Módulos
          </div>
        )}
        {collapsed && <div className="my-2 border-t border-sidebar-border" />}

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
              activeBarClass={accent.solid}
              activeSoftClass={accent.soft}
              label={MODULE_LABELS[slug]}
              onNavigate={onNavigate}
            />
          );
        })}

        {navSlugs.length === 0 && !collapsed && (
          <p className="px-3 py-2 text-xs text-sidebar-foreground/60">
            Tu rol no tiene módulos habilitados todavía.
          </p>
        )}
      </nav>

      <div className={cn("flex items-center gap-3 border-t border-sidebar-border p-4", collapsed && "justify-center px-2")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold">
          {initial}
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
      <aside className={cn("hidden shrink-0 border-r border-sidebar-border transition-[width] duration-200 lg:block", collapsed ? "w-[4.5rem]" : "w-64")}>
        <div className="sticky top-0 flex h-screen flex-col">
          <div className="flex-1 overflow-hidden">
            <NavContent collapsed={collapsed} />
          </div>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex h-11 shrink-0 items-center justify-center gap-2 border-t border-sidebar-border bg-sidebar text-xs font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            title={collapsed ? "Expandir menú" : "Contraer menú"}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <><PanelLeftClose className="h-4 w-4" /> Contraer</>}
          </button>
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

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
