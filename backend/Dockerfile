FROM node:20-alpine

WORKDIR /app

# Add wget so Docker health checks work in this Alpine-based image
RUN apk add --no-cache wget

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source
COPY src/ ./src/

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser && \
    chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 3001

CMD ["node", "src/index.js"]
