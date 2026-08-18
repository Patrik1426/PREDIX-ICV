import { describe, expect, it } from "vitest";
import { PROPUESTA_MODULOS } from "./Propuesta";
import { MODULE_GROUPS } from "@/lib/moduleGroups";

// Guarda barata contra el riesgo de obsolescencia que describe el comentario
// sobre PROPUESTA_MODULOS: la lista está congelada a propósito (contenido
// histórico de la propuesta comercial) y no se deriva de moduleGroups.ts, así
// que nada evita que sus `ruta` queden apuntando a un slug que ya no existe
// en el producto — salvo este test.
describe("PROPUESTA_MODULOS", () => {
  it("every ruta points at a UI slug that still exists in MODULE_GROUPS", () => {
    for (const modulo of PROPUESTA_MODULOS) {
      const slug = modulo.ruta.replace(/^\/modulos\//, "");
      expect(Object.keys(MODULE_GROUPS)).toContain(slug);
    }
  });
});
