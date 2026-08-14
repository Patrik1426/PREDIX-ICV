import { cn } from "@/lib/utils";

export function DataRow({
  icon,
  label,
  value,
  colorClassName,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClassName: string;
  last?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3 py-2.5", !last && "border-b")}>
      <span className={cn("flex shrink-0 opacity-85", colorClassName)}>{icon}</span>
      <span className="flex-1 truncate text-sm text-muted-foreground">{label}</span>
      <span className={cn("shrink-0 whitespace-nowrap text-sm font-semibold", colorClassName)}>{value}</span>
    </div>
  );
}
