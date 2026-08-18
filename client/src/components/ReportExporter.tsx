// ============================================================
// ReportExporter — exporta el KPI rollup del Tablero a CSV. 100% cliente
// (Blob + descarga), sin backend nuevo. Los datos vienen del caller
// — nunca datos reales del ICVNL.
// ============================================================

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, FileText } from "lucide-react";

export interface ReportRow {
  metrica: string;
  valor: string;
}

export function buildCsv(rows: ReportRow[]): string {
  const header = "Métrica,Valor";
  const lines = rows.map(
    (r) => `"${r.metrica.replace(/"/g, '""')}",${JSON.stringify(r.valor)}`
  );
  return [header, ...lines].join("\n");
}

export default function ReportExporter({ rows }: { rows: ReportRow[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    const csv = buildCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "predix-icv-kpis-demo.csv";
    a.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <FileText className="h-3.5 w-3.5" /> Generar reporte
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar KPIs (datos de ejemplo)</DialogTitle>
          <DialogDescription>
            Descarga un CSV con los {rows.length} indicadores del Tablero. Los valores son
            de ejemplo, no datos operativos reales del ICVNL.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={handleExport} className="gap-1.5">
          <Download className="h-3.5 w-3.5" /> Descargar CSV
        </Button>
      </DialogContent>
    </Dialog>
  );
}
