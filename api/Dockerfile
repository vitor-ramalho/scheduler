# Multi-stage build for production
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY src/ src/

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S scheduler -u 1001

WORKDIR /app

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application and migrations
COPY --from=builder --chown=scheduler:nodejs /app/dist ./dist
COPY --from=builder --chown=scheduler:nodejs /app/node_modules ./node_modules

# Copy necessary config files
COPY --chown=scheduler:nodejs tsconfig*.json ./
COPY --chown=scheduler:nodejs nest-cli.json ./

# Security: Set proper permissions
RUN chmod -R 755 /app

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Switch to non-root user
USER scheduler

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]