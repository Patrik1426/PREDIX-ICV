export function getEstadoBadgeClass(status: string): string {
  return status === "Atención" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success";
}
