# Étape 1 : Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Prisma
RUN npx prisma generate

# Compile seed script dans dist/seed.js
RUN npm run build:seed

# Compile Next.js
RUN npm run build

# Étape 2 : Runner (prod)
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Dépendances
COPY --from=builder /app/node_modules ./node_modules

# Build Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Ajout du dist pour seed
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

CMD ["npm", "start"]
