import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/infra/trpc";
import { authRouter } from "./routers/auth";
import { adminRouter } from "./routers/admin";
import { usuariosRouter } from "./routers/usuarios";
import { vaultRouter } from "./routers/vault";
import { aiRouter } from "./routers/ai";

export const appRouter = router({
  // Todos los endpoints deben empezar con '/api/' (ver server/_core/index.ts).
  system: systemRouter,
  auth: authRouter,
  admin: adminRouter,
  usuarios: usuariosRouter,
  vault: vaultRouter,
  ai: aiRouter,
  // TODO: agregar aquí los routers de trámites/predicción/asignador/citas/
  // monitor conforme se construyan (ver drizzle/schema.ts TODO).
});

export type AppRouter = typeof appRouter;
