type DiscountSimulation = { expectedCompletionPct: number; projectedRevenueMillions: number; recommendation: string };

type SimuladorPoliticaProps = {
  discount: number;
  onDiscountChange: (discount: number) => void;
  simulation: DiscountSimulation;
};

export function SimuladorPolitica({ discount, onDiscountChange, simulation }: SimuladorPoliticaProps) {
  return (
    <section className="rounded-[1.4rem] bg-foreground p-5 text-background sm:p-6">
      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-primary">Simulador de política</p>
      <h2 className="mt-2 text-xl font-extrabold tracking-[-0.04em]">Descuento escalonado de refrendo</h2>
      <p className="mt-2 text-sm leading-6 text-background/70">Explora un incentivo de referencia. La estimación se actualiza con supuestos demostrativos y debe validarse antes de su uso operativo.</p>
      <div className="mt-7">
        <div className="flex items-end justify-between">
          <p className="text-sm font-bold">Incentivo propuesto</p>
          <p className="text-3xl font-extrabold tracking-[-0.06em] text-primary">{discount}%</p>
        </div>
        <input
          aria-label="Porcentaje de descuento"
          type="range"
          min="0"
          max="15"
          value={discount}
          onChange={(e) => onDiscountChange(Number(e.target.value))}
          data-testid="simulador-descuento"
          className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-background/20 accent-primary"
        />
        <div className="mt-1.5 flex justify-between text-[0.68rem] font-semibold text-background/60"><span>0%</span><span>15%</span></div>
      </div>
      <div aria-live="polite" className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-background/[0.08] p-3.5">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.12em] text-background/60">Conclusión esperada</p>
          <p className="mt-1.5 text-2xl font-extrabold">{simulation.expectedCompletionPct}%</p>
        </div>
        <div className="rounded-xl bg-background/[0.08] p-3.5">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.12em] text-background/60">Recaudación estimada</p>
          <p className="mt-1.5 text-2xl font-extrabold">${simulation.projectedRevenueMillions} M</p>
        </div>
      </div>
      <p aria-live="polite" className="mt-4 rounded-xl border border-background/10 bg-background/[0.04] p-3 text-xs leading-5 text-background/80">{simulation.recommendation}</p>
    </section>
  );
}
