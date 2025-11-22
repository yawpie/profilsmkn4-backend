# syntax=docker/dockerfile:1

############################
# 0) args
############################
ARG NODE_VERSION=20
ARG PNPM_VERSION=8

############################
# 1) deps: install node_modules & generate prisma client
############################
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app

# ensure we have bash tools (optional), and set safe permissions
RUN apk add --no-cache libc6-compat

# copy package manifests only to leverage docker cache
COPY package.json package-lock.json ./   
# or use pnpm-lock.yaml if applicable

# install production + dev deps because we need prisma + ts build tools
RUN npm ci

# copy prisma schema early so we can run prisma generate
COPY prisma ./prisma
# (also copy any generator config if present)

# Run prisma generate to create the generated client into node_modules/@prisma/client
# This must run where node_modules exist (so @prisma/client is installed)
RUN npx prisma generate

# copy rest of source for build stage
COPY . .

############################
# 2) build: compile TypeScript
############################
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app

# copy deps + generated client
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app ./

# ensure the prebuild step runs (we will run tsc)
# If you use a build script (npm run build) that expects prebuild, it'll run prisma generate again if configured.
RUN npm run build

############################
# 3) runner: production image (only production deps + build)
############################
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# create non-root user (optional but recommended)
RUN addgroup -S app && adduser -S app -G app
USER app

# copy prod deps + build output
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

EXPOSE 3001
CMD ["node", "dist/index.js"]
