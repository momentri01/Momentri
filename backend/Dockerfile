# Use Node.js 20 as base
FROM node:20-slim AS builder

# Install openssl for Prisma in builder stage
RUN apt-get update -y && apt-get install -y openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Copy prisma schema for postinstall npx prisma generate
COPY backend/prisma ./prisma/

# Install all dependencies
RUN npm install

# Copy rest of the source
COPY backend/ .

# Build the project
RUN npm run build

# --- Runtime Stage ---
FROM node:20-slim

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copy package.json
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Set environment variables
ENV NODE_ENV=production

# Command to run
CMD ["npm", "run", "start"]
