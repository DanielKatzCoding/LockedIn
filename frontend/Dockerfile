FROM node:20-slim as builder

# Set working directory for builder
WORKDIR /app

# Copy all source code (including package.json)
COPY ./frontend .
# Copy the frontend env file for build‑time variables
COPY .env.frontend .env.production

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

# Start the Next.js app
CMD ["npm", "run", "start"]
