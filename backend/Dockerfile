FROM python:3.12-slim AS builder

WORKDIR /app/backend

# Install system dependencies needed for uv and building wheels
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install uv (the fast Python package manager)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
ENV VIRTUAL_ENV=/app/backend/.venv
ENV PATH="/app/backend/.venv/bin:$PATH"

# Copy the rest of the application source code
COPY ./backend .

# Install runtime dependencies (no dev) using uv inside the venv
RUN uv sync --no-dev


# ---------- Runtime stage ----------
FROM python:3.12-slim
WORKDIR /app/backend

# Copy installed packages from builder stage
COPY --from=builder /app/backend /app/backend
ENV VIRTUAL_ENV=/app/backend/.venv
ENV PATH="/app/backend/.venv/bin:$PATH"
# Expose the FastAPI port
EXPOSE 8000


CMD ["uvicorn","app:app","--host","0.0.0.0","--port","8000"]