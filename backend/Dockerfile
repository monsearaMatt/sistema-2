# Backend Dockerfile - multi-stage
FROM node:20.19-alpine AS builder
WORKDIR /app

# Instalamos dependencias (incluye dev deps para prisma generate y build)
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# prisma generate only needs the schema; a placeholder URL satisfies prisma.config.ts
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# Generar cliente Prisma y compilar la app
RUN npx prisma generate
RUN npm run build

FROM node:20.19-alpine
WORKDIR /app

# Copiar artefactos desde builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node","dist/src/main.js"]
