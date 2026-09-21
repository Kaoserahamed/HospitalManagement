# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

# Production preview stage
FROM nginx:alpine AS runtime

COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: expose API URL via environment variable at runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]