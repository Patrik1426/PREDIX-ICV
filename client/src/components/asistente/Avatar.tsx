import type { ChatMsg } from "./types";

type AvatarProps = { role: ChatMsg["role"] };

export function Avatar({ role }: AvatarProps) {
  if (role === "assistant") {
    return (
      <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
        P
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-accent text-xs font-bold text-muted-foreground">
      Tú
    </span>
  );
}
