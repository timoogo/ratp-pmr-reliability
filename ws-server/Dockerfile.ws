FROM node:20-alpine

WORKDIR /ws

# Installer uniquement les deps de prod
COPY package*.json ./
RUN npm ci --only=production

# Copier prisma (schéma et migrations)
COPY ./prisma ./prisma

# Copier le reste du projet
COPY ./ws-server ./

# Générer Prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3001

CMD ["npm", "run", "start"]
