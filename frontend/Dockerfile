FROM node:20-slim as builder

# Set working directory for builder
WORKDIR /app

# Copy all source code (including package.json)
COPY . .

# Install pnpm and dependencies
ENV CI=true
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

# Build the Next.js application
RUN npm run build

# ----------- Runtime stage -----------
FROM node:20-slim
WORKDIR /app
# Copy built application and node_modules from builder stage
COPY --from=builder /app ./
# Expose the Next.js development server port
EXPOSE 3000
# Set environment variables (can be overridden via docker compose)
ENV NEXT_PUBLIC_STATUS_TYPES=${NEXT_PUBLIC_STATUS_TYPES}
# Start the Next.js app
CMD ["npm", "run", "start"]
