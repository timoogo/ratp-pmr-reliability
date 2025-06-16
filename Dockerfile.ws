FROM node:20-alpine

WORKDIR /ws

COPY ./ws-server/package.json ./ws-server/package-lock.json ./
RUN npm ci

COPY ./ws-server ./

EXPOSE 3001

CMD ["npm", "run", "start"]
