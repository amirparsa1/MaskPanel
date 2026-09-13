ARG PYTHON_VERSION=3.14
ARG NODE_VERSION=22

# --- Python deps builder ---
FROM ghcr.io/astral-sh/uv:python${PYTHON_VERSION}-bookworm-slim AS python-builder
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*
ENV UV_PYTHON_DOWNLOADS=0
WORKDIR /build
# Copy dependency files first for better caching
COPY uv.lock pyproject.toml ./
RUN uv sync --frozen --no-install-project --no-dev
# Copy rest and install project
COPY . .
RUN uv sync --frozen --no-dev

# --- Dashboard builder (RunoFlux MaskPanel UI) ---
FROM node:${NODE_VERSION}-bookworm-slim AS dashboard-builder
WORKDIR /app/dashboard
# Install bun
RUN npm install -g bun
COPY dashboard/package.json dashboard/bun.lock* dashboard/package-lock.json* ./
RUN bun install --frozen-lockfile 2>&1 || npm install --legacy-peer-deps
COPY dashboard/ ./
ARG VITE_BASE_API=/
ENV VITE_BASE_API=${VITE_BASE_API}
RUN echo "🎭 Building MaskPanel by RunoFlux dashboard - VITE_BASE_API=${VITE_BASE_API}" && \
    bun run build 2>&1 || npm run build 2>&1
RUN cp ./build/index.html ./build/404.html 2>&1 || echo "No index.html to copy"
RUN ls -lh ./build/ | head -n 30

# --- Final runtime ---
FROM python:${PYTHON_VERSION}-slim-bookworm AS runtime
COPY --from=python-builder /build /code
WORKDIR /code
COPY --from=dashboard-builder /app/dashboard/build /code/dashboard/build
ENV PATH="/code/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV UVICORN_HOST=0.0.0.0
ENV UVICORN_PORT=8000
ENV ROLE=all-in-one
ENV NATS_ENABLED=0
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY cli_wrapper.sh /usr/bin/maskpanel-cli
RUN chmod +x /usr/bin/maskpanel-cli
COPY cli_wrapper.sh /usr/bin/pasarguard-cli
RUN chmod +x /usr/bin/pasarguard-cli
COPY tui_wrapper.sh /usr/bin/maskpanel-tui
RUN chmod +x /usr/bin/maskpanel-tui
COPY healthcheck.sh /code/healthcheck.sh
RUN chmod +x /code/healthcheck.sh
RUN chmod +x /code/start.sh
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD /code/healthcheck.sh || curl -f http://localhost:${UVICORN_PORT}/api/system || exit 1
EXPOSE 8000
ENTRYPOINT ["/code/start.sh"]
