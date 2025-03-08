FROM node:22.11.0-alpine AS build

WORKDIR /app

COPY package*.json .
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run build
RUN npx prisma generate

FROM node:22.11.0-alpine

WORKDIR /app

COPY --chown=node:node --from=build /app/package*.json ./
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/prisma ./prisma

RUN npx prisma generate
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start:migrate:prod"]