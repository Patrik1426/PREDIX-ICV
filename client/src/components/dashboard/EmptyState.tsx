export function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
