# syntax=docker/dockerfile:1

############################
# args
############################
ARG NODE_VERSION=20-slim
ARG CI=true

############################
# 1) deps: install node_modules & generate prisma client
############################
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

# Use apt-get (Debian-based). Install certs & openssl libs required by Prisma.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      ca-certificates \
      openssl \
      # try to ensure libssl exists; Debian slim may have libssl3
      libssl3 || true \
 && rm -rf /var/lib/apt/lists/*

# copy package manifests for better cache
COPY package.json package-lock.json ./

# install all deps (dev + prod) because we need prisma + build tools
RUN npm ci --no-audit --no-fund

# copy prisma schema so generate can run
COPY prisma ./prisma

# generate prisma client (runs with same libc as this stage)
RUN npx prisma generate

# copy everything else (source) so subsequent stages can reuse layer when changed
COPY . .

############################
# 2) build: compile TypeScript
############################
FROM node:${NODE_VERSION} AS build
WORKDIR /app

# copy deps + generated client and source from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app ./

# build (assumes npm run build exists and compiles to /app/dist)
RUN npm run build

############################
# 3) prod: prune dev deps (optional) -> produce smaller node_modules
############################
FROM node:${NODE_VERSION} AS prod-deps
WORKDIR /app

# copy package files and node_modules from build/deps
COPY --from=deps /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# prune dev dependencies to keep only production deps
RUN npm prune --omit=dev --no-audit --no-fund

############################
# 4) runner: production image
############################
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install runtime libs (again) for final image
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      ca-certificates \
      openssl \
      libssl3 || true \
 && rm -rf /var/lib/apt/lists/*

# create non-root user and group, and directory for uploads
RUN groupadd -r app && useradd -r -g app app \
 && mkdir -p /app/uploads \
 && chown -R app:app /app /app/uploads

# copy only production node_modules + dist + necessary files
COPY --chown=app:app --from=prod-deps /app/node_modules ./node_modules
COPY --chown=app:app --from=build /app/dist ./dist
COPY --chown=app:app --from=deps /app/prisma ./prisma
COPY --chown=app:app --from=deps /app/package*.json ./

USER app

EXPOSE 3001
CMD ["node", "dist/index.js"]
