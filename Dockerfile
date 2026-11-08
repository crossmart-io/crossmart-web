# Static build of the web app served by nginx.
#   docker build --build-arg VITE_API_URL=https://api.example.com \
#     --build-arg VITE_MCP_URL=https://mcp.example.com/mcp -t crossmart-web .

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS build
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH HUSKY=0
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_API_URL=http://localhost:3000
ARG VITE_MCP_URL=http://localhost:3100/mcp
ENV VITE_API_URL=${VITE_API_URL} VITE_MCP_URL=${VITE_MCP_URL}
RUN pnpm build

FROM nginx:1.29-alpine AS runtime
ARG VITE_API_URL=http://localhost:3000
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf
# The CSP may only connect to the API the bundle was built for: scheme, host and port of VITE_API_URL.
RUN api_origin="$(echo "$VITE_API_URL" | sed -E 's#^([a-z]+://[^/]+).*#\1#')" \
  && sed -i "s#__API_ORIGIN__#${api_origin}#" /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
