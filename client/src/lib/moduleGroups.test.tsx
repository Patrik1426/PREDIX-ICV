import { describe, expect, it } from "vitest";
import { hasGroupAccess, MODULE_GROUPS } from "./moduleGroups";

describe("MODULE_GROUPS", () => {
  it("maps each merged UI slug to its real RBAC slugs", () => {
    expect(MODULE_GROUPS.prediccion_asignacion).toEqual(["prediccion_demanda", "asignador_ventanillas"]);
    expect(MODULE_GROUPS.citas_operacion).toEqual(["citas", "monitor"]);
    expect(MODULE_GROUPS.chatbot).toEqual(["chatbot"]);
    expect(MODULE_GROUPS.admin).toEqual(["admin"]);
  });
});

describe("hasGroupAccess", () => {
  it("returns true when the user has access to at least one real sub-module", () => {
    expect(hasGroupAccess("prediccion_asignacion", ["asignador_ventanillas"])).toBe(true);
  });

  it("returns false when the user has none of the real sub-modules", () => {
    expect(hasGroupAccess("prediccion_asignacion", ["chatbot"])).toBe(false);
  });

  it("returns false for an unknown UI slug", () => {
    expect(hasGroupAccess("no-existe", ["admin"])).toBe(false);
  });

  it("treats a missing/undefined module list as no access", () => {
    expect(hasGroupAccess("chatbot", undefined)).toBe(false);
    expect(hasGroupAccess("chatbot", null)).toBe(false);
  });
});
