// ============================================================
// ReportExporter — exporta el KPI rollup del Tablero a CSV. 100% cliente
// (Blob + descarga), sin backend nuevo. Los datos vienen del caller
// — nunca datos reales del ICVNL.
//
// NOTA: hoy solo se conecta a las constantes demo del Tablero. Antes de
// reusar este componente para datos reales respaldados por schema, agregar
// (a) un gate RBAC `canExport` (la matriz de permisos ya soporta esta acción,
// ver server/_core/infra/permissions.ts) y (b) escapado a prueba de
// inyección de fórmulas CSV para celdas que empiecen con `=`, `+`, `@` o `-`
// (formula injection) — ninguno de los dos existe todavía, no hace falta
// mientras los datos sean de ejemplo.
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

// RFC-4180: un campo va entre comillas dobles, y toda comilla doble literal
// dentro del campo se escapa duplicándola (nunca con backslash).
function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function buildCsv(rows: ReportRow[]): string {
  const header = "Métrica,Valor";
  const lines = rows.map((r) => `${csvField(r.metrica)},${csvField(r.valor)}`);
  return [header, ...lines].join("\n");
}

export default function ReportExporter({ rows }: { rows: ReportRow[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    const csv = buildCsv(rows);
    // BOM UTF-8 al frente: sin esto, Excel en Windows abre el CSV con el
    // codepage ANSI del sistema por defecto y los acentos (Métrica,
    // Trámites, Precisión...) se ven como mojibake.
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "predix-icv-kpis-demo.csv";
    // El ancla debe estar en el DOM para que .click() dispare la descarga de
    // forma confiable en todos los navegadores (Firefox en particular no
    // garantiza el disparo de un <a> fuera del documento); revocar la URL
    // del objeto se difiere un tick para no invalidarla antes de que el
    // navegador arranque la descarga.
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 0);
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
