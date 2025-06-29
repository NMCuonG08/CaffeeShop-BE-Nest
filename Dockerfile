FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY src/ ./src/

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

# Copy package files
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma/

# Copy healthcheck file
COPY healthcheck.js ./

# Create logs directory
RUN mkdir -p logs

RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]