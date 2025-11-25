FROM node:22.12.0 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM caddy:2
WORKDIR /srv
COPY --from=builder /app/dist /srv
