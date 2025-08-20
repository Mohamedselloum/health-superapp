# Multi-stage build for NestJS Backend
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy backend package files
COPY apps/backend/package.json ./apps/backend/
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
COPY . .
EXPOSE 3001
CMD ["pnpm", "--filter", "backend", "run", "start:dev"]

# Build stage
FROM base AS build
COPY . .
RUN pnpm --filter backend run build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

# Copy package files
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/pnpm-workspace.yaml ./
COPY --from=build /app/apps/backend/package.json ./apps/backend/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=build --chown=nestjs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=build --chown=nestjs:nodejs /app/apps/backend/node_modules ./apps/backend/node_modules

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["node", "apps/backend/dist/main"]

