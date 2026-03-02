FROM node:22-alpine

WORKDIR /app

# Install dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci --include=dev

# Copy source
COPY . .

# Pass Railway env vars to Astro build (PUBLIC_* are inlined at build time by Vite)
ARG PUBLIC_API_URL=https://business-flow-ai.up.railway.app
ARG PUBLIC_PORTAL_URL=https://clientportal2-production.up.railway.app
ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_PORTAL_URL=$PUBLIC_PORTAL_URL

# Clean any Astro cache and build fresh
RUN rm -rf .astro dist && npm run build

# Verify build output
RUN grep -o '"checkOrigin":[a-z]*' dist/server/manifest_*.mjs
RUN find dist/server/pages/api -name "*.mjs" | tee /dev/stderr | wc -l

EXPOSE 8080
ENV PORT=8080 HOST=0.0.0.0

CMD ["node", "dist/server/entry.mjs"]
