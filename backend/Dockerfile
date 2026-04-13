# Use Node.js 20 as base
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for tsc)
RUN npm install

# Copy source and prisma
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# --- Runtime Stage ---
FROM node:20-slim

WORKDIR /app

# Install openssl for Prisma (needed on slim images)
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
