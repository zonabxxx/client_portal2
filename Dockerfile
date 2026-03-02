FROM node:22-alpine

WORKDIR /app

# Install dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci --include=dev

# Copy source and build
COPY . .
RUN npm run build

# Remove devDependencies for smaller image
RUN npm prune --production

# Verify API routes exist
RUN echo "=== API Routes ===" && find dist/server/pages/api -name "*.mjs" && echo "=== OK ==="

EXPOSE 8080
ENV PORT=8080 HOST=0.0.0.0

CMD ["npm", "run", "start"]
