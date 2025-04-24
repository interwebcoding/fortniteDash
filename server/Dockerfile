FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS build-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build-deps /app/dist ./dist
COPY --from=build-deps /app/data ./data
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/index.js"]