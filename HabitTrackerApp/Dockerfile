<!-- Docker Configuration for Web Deployment -->
<!-- Place this as Dockerfile in project root -->
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build web version
RUN npm run build:web || npx expo export -p web

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install http-server to serve static files
RUN npm install -g http-server

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start server
CMD ["http-server", "dist", "-p", "3000", "-c-1"]
