import { Info } from "lucide-react";

export function DemoNotice({ text }: { text: string }) {
  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-chart-2/30 bg-chart-2/10 px-3.5 py-3 text-xs leading-5 text-chart-2">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{text}</span>
    </div>
  );
}
