#!/usr/bin/env bash
set -e

# MaskPanel by RunoFlux - Universal starter for Docker & Railway Railpack
# Works both in /code (Docker) and current dir (Railpack)

ROLE="${ROLE:-all-in-one}"

# Railway compatibility: Railway provides PORT, we map it to UVICORN_PORT
if [ -n "${PORT}" ]; then
  export UVICORN_PORT="${PORT}"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🚂 Railway detected - PORT=${PORT} mapped to UVICORN_PORT"
fi

export UVICORN_PORT="${UVICORN_PORT:-8000}"
export UVICORN_HOST="${UVICORN_HOST:-0.0.0.0}"

# Detect venv (for Railpack) or .venv (for uv Docker)
if [ -f "/opt/venv/bin/activate" ]; then
  source /opt/venv/bin/activate
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🐍 Using /opt/venv (Railpack)"
elif [ -f "/code/.venv/bin/activate" ]; then
  source /code/.venv/bin/activate
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🐍 Using /code/.venv (Docker)"
elif [ -f ".venv/bin/activate" ]; then
  source .venv/bin/activate
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🐍 Using .venv (local)"
fi

# Ensure we are in correct dir
if [ -f "/code/main.py" ]; then
  cd /code
fi

echo "
╔════════════════════════════════════════════════════════════╗
║  🎭 MaskPanel by RunoFlux • Veiled Flux Engine            ║
║  ᛗ ᚨᛊᚲ ᛈᚨᚾᛖᛚ • ᚱᚢᚾᛟᚠᛚᚢᛉ • ᛉ ᚡᛖᛁᛚᛖᛞ ᚠᛚᚢᛉ                     ║
║  Veiled Connectivity, Flux Intelligence                    ║
║  🚂 Railway Ready • Ghost Mode Active                     ║
╚════════════════════════════════════════════════════════════╝
"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 📂 PWD: $(pwd) - Files: $(ls -1 | wc -l) files"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 📦 Python: $(python --version) - Pip: $(which python)"

if [ "${ROLE}" = "node" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🛰️ Starting Flux Node Worker... ᚱ"
    exec python node_worker.py
elif [ "${ROLE}" = "scheduler" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⏰ Starting Flux Scheduler... ᛚ"
    exec python scheduler_worker.py
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🎭 Starting MaskPanel (${ROLE}) on ${UVICORN_HOST}:${UVICORN_PORT}... ᛗ"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🌊 Flux Engine: Initializing veiled routes..."
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 📦 Database: ${SQLALCHEMY_DATABASE_URL:-sqlite:///db.sqlite3}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🎨 Dashboard build exists: $(ls -ld dashboard/build 2>&1)"
    
    # Run migrations
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔄 Running alembic migrations..."
    python -m alembic upgrade head || {
      echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ Migrations failed, trying with python -m alembic..."
      python -m alembic upgrade head
      exit_code=$?
      if [ $exit_code -ne 0 ]; then
          echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ ERROR: Database migrations failed - check DATABASE_URL"
          echo "[$(date '+%Y-%m-%d %H:%M:%S')] 💡 For Railway, set SQLALCHEMY_DATABASE_URL=postgresql+asyncpg://..."
          exit 1
      fi
    }

    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 👻 Ghost Mode: Active • Obfuscation: 94% • Masks: Ready"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🚀 MaskPanel ready at /dashboard/ • Flux: Optimal • Port: ${UVICORN_PORT}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ᛗ ᚨᛊᚲ ᛈᚨᚾᛖᛚ • ᚱᚢᚾᛟᚠᛚᚢᛉ"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔗 Health: http://${UVICORN_HOST}:${UVICORN_PORT}/api/system"
    exec python main.py
fi
