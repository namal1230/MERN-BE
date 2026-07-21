# Build stage
FROM cgr.dev/chainguard/node@sha256:faf60a8162ce6b90be3307b0b8c34f71436bd8d4389dcc442d6555fa13cf62fd AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM cgr.dev/chainguard/node@sha256:faf60a8162ce6b90be3307b0b8c34f71436bd8d4389dcc442d6555fa13cf62fd

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nonroot:nonroot /app/dist ./dist

# Run as a non-root user
USER nonroot

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/index.js"]
