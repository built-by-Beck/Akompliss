# Minimal image for the aKom-Pliss API service.
# Built from the repo root: docker build -f services/api/Dockerfile .
FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /repo

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json tsconfig.json ./
COPY services/api/package.json services/api/package.json
RUN pnpm install --frozen-lockfile
COPY services/api services/api
RUN pnpm --filter @akom/api build && pnpm --filter @akom/api deploy --prod /app

FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app /app
EXPOSE 3000
CMD ["node", "dist/index.js"]
