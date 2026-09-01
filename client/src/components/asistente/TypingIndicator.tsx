import { Avatar } from "./Avatar";

export function TypingIndicator() {
  return (
    <div role="status" aria-label="El asistente está escribiendo" className="flex items-center gap-2.5">
      <Avatar role="assistant" />
      <div className="flex items-center gap-1.5 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-sm border bg-muted/40 px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="h-1.5 w-1.5 animate-pulse motion-reduce:animate-none rounded-full bg-muted-foreground/60"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
