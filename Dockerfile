# Multi-stage build for Cherry Studio SaaS Backend
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml ./

# Install pnpm
RUN npm install -g pnpm@10.27.0

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.27.0

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built files from builder
COPY --from=builder /app/out ./out
COPY --from=builder /app/resources ./resources

# Create directories for uploads and logs
RUN mkdir -p /app/uploads /app/logs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "out/main/index.js"]
