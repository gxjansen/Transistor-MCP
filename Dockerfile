# transistor-mcp — stdio MCP server for the Transistor.fm podcast hosting API
# Build:  docker build -t transistor-mcp .
# Run:    docker run -i --rm -e TRANSISTOR_API_KEY=... transistor-mcp

FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src
RUN npm ci --ignore-scripts && npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=builder /app/build ./build

# Runtime environment variables (optional at startup — the server starts and
# answers introspection without them; tool calls fail with a clear error
# until it is set):
#   TRANSISTOR_API_KEY — API key from https://dashboard.transistor.fm/account

USER node
CMD ["node", "build/index.js"]
