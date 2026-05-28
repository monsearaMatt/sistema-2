# AGENTS.md

## Project: sistema-2

NestJS 11 backend + two static HTML test frontends, orchestrated via Docker Compose.

## Commands

All from `backend/` except Docker:

```bash
cd backend
npm run start:dev     # watch mode
npm run build         # compile TS
npm run start:prod    # node dist/main
npm run test          # unit tests (matches *.spec.ts in src/)
npm run test:e2e      # e2e tests (test/ dir)
npm run lint          # eslint --fix
npm run format        # prettier --write
```

Docker:
```bash
docker compose up --build                                    # backend + frontends (no db)
docker compose --profile localdb up --build db               # local Postgres
```

When running locally against a local DB, use `COMPOSE_PROFILES=localdb` or start only the services you need.

## Architecture

```
backend/src/
  main.ts                   # NestFactory, CORS enabled
  app.module.ts             # imports: RrhhModule, LogisticaModule, PrismaModule
  common/prisma/            # PrismaService (OnModuleInit → $connect, OnModuleDestroy → $disconnect)
  modules/
    logistica/              # full CRUD module: presentation/ + application/ layers
    rrhh/                   # empty stub module (no controllers or services)
```

- Entrypoint: `backend/src/main.ts`
- Prisma schema: `backend/prisma/schema.prisma` — two PostgreSQL schemas: `Logistica` and `RRHH`
- The `RrhhModule` is a placeholder; Logistica is the only functional domain module
- Two simple static HTML frontends at `frontend/logistica-test/` and `frontend/logistica-test-get/` served via nginx (ports 5000, 5001)

## Prisma

**Prisma client output is non-standard:** generated into `node_modules/.prisma/client` instead of the default `node_modules/@prisma/client`. This is set in `prisma/schema.prisma` (generator output path).

**Custom adapter:** PrismaService uses `@prisma/adapter-pg` (PrismaPg). The adapter requires the PrismaClient constructor to receive `{ adapter }` — this is why `Dockerfile.prisma-patch` exists: at build time, Prisma's generated PrismaClient calls `super()` which conflicts with the adapter pattern, so a sed patch injects `constructor() { super({}); }` into the compiled JS. If you refactor the PrismaService or upgrade Prisma, verify the patch still works.

**DATABASE_URL is required** at startup — PrismaService throws if unset.

**Migrations:** use `npx prisma migrate dev --name <name>` during development, `npx prisma migrate deploy` for production. Generate client after schema changes: `npx prisma generate`.

**Seed data:** `backend/scripts/data-logistica.sql` — raw SQL, not automated via Prisma seed.

## Module conventions

- Modules follow a two-layer pattern: `presentation/` (controllers + DTOs) and `application/` (services)
- Controllers use `@UsePipes(new ValidationPipe({ transform: true }))` at class level
- Path params use `ParseIntPipe` for numeric parameters
- DTOs use `class-validator` decorators (`@IsInt`, `@IsPositive`, `@IsString`, `@IsNotEmpty`, `@IsIn`, `@Length`)
- Services inject `PrismaService` via constructor DI

## CORS

Enabled in `main.ts` with explicit config. Accepts comma-separated origins from `CORS_ORIGIN` env var; defaults to allowing all origins if unset.

## Style

- Prettier: single quotes, trailing commas (`backend/.prettierrc`)
- ESLint: `@typescript-eslint/recommendedTypeChecked` with prettier plugin, `endOfLine: auto`
