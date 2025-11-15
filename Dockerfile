# FROM node:20

# # Set working directory
# WORKDIR /app

# # Copy package.json dan package-lock.json dulu untuk caching
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy semua source code
# COPY . .

# RUN npx prisma generate


# # Expose port (misalnya pakai 3000, sesuaikan dengan express kamu)
# EXPOSE 3000

# # Jalankan perintah default (bisa juga override di compose)

# CMD ["npm", "run", "dev"]

# api/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
USER app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
EXPOSE 4000
CMD ["node", "dist/index.js"]
