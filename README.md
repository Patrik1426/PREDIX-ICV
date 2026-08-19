# PREDIX-ICV

Plataforma de inteligencia predictiva para el Instituto de Control Vehicular de Nuevo León (ICVNL).

Scaffold inicial forkeado de la arquitectura genérica de `seguridad-edomex` (auth, RBAC, vault, tRPC, UI kit).

## Setup

```bash
pnpm install
cp ENV_TEMPLATE.txt .env   # completar DATABASE_URL / JWT_SECRET / VAULT_MASTER_KEY
pnpm db:push
pnpm exec tsx scripts/load-nl-municipios-geojson.ts   # descarga los 5 poligonos municipales reales (INEGI WFS, gitignored — necesario para el mapa de delegaciones del Tablero)
pnpm dev
```

## Documentos

- [`docs/CUESTIONARIO_DIMENSIONAMIENTO_ICVNL.md`](./docs/CUESTIONARIO_DIMENSIONAMIENTO_ICVNL.md) — cuestionario enviado al cliente, define el alcance real.
- [`docs/Propuesta PREDIX ICVNL Paco.docx`](./docs/) — propuesta técnica original.
