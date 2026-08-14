import { cn } from "@/lib/utils";

/**
 * LineaCarril — el divisor de sección de PREDIX-ICV: una línea punteada
 * como la pintura de un carril vehicular. Es la referencia visual al
 * dominio del producto (control vehicular) en vez de una regla genérica.
 */
export function LineaCarril({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={cn("h-px w-full", className)}
      style={{
        backgroundImage: "repeating-linear-gradient(90deg, var(--border) 0 22px, transparent 22px 34px)",
      }}
    />
  );
}
