# Dependencies stage - install only dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

# Build stage - compile TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and node_modules to speed up build
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./
COPY tsconfig*.json ./
COPY src/ ./src/

# Build application and cleanup
RUN npm run build && \
    rm -rf node_modules

# Production stage - minimal image for running the app
FROM node:20-alpine AS production

# Install tini and create non-root user
RUN apk add --no-cache tini && \
    addgroup -S nodejs && \
    adduser -S nodejs -G nodejs

WORKDIR /app

# Install production dependencies
COPY package*.json package-lock.json ./
RUN npm ci --omit=dev && \
    npm cache clean --force && \
    rm -rf /root/.npm /tmp/* && \
    chown -R nodejs:nodejs /app

# Copy only built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

ENV NODE_ENV=production
USER nodejs
EXPOSE 4000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main"] 