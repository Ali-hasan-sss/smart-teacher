FROM node:18-bullseye AS builder

WORKDIR /app

COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install --legacy-peer-deps

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:18-bullseye AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

CMD ["npm", "start"]
