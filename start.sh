#!/usr/bin/env bash

ROLE="${ROLE:-all-in-one}"

# Railway compatibility: Railway provides PORT, we map it to UVICORN_PORT
if [ -n "${PORT}" ]; then
  export UVICORN_PORT="${PORT}"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🚂 Railway detected - PORT=${PORT} mapped to UVICORN_PORT"
fi

# Default to 8000 if not set
export UVICORN_PORT="${UVICORN_PORT:-8000}"
export UVICORN_HOST="${UVICORN_HOST:-0.0.0.0}"

echo "
╔════════════════════════════════════════════════════════════╗
║  🎭 MaskPanel by RunoFlux • Veiled Flux Engine            ║
║  ᛗ ᚨᛊᚲ ᛈᚨᚾᛖᛚ • ᚱᚢᚾᛟᚠᛚᚢᛉ • ᛉ ᚡᛖᛁᛚᛖᛞ ᚠᛚᚢᛉ                     ║
║  Veiled Connectivity, Flux Intelligence                    ║
║  🚂 Railway Ready • Ghost Mode Active                     ║
╚════════════════════════════════════════════════════════════╝
"

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
    
    python -m alembic upgrade head
    exit_code=$?

    if [ $exit_code -ne 0 ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ ERROR: Database migrations failed - check DATABASE_URL"
        exit 1
    fi

    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 👻 Ghost Mode: Active • Obfuscation: 94% • Masks: Ready"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🚀 MaskPanel ready at /dashboard/ • Flux: Optimal • Port: ${UVICORN_PORT}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ᛗ ᚨᛊᚲ ᛈᚨᚾᛖᛚ • ᚱᚢᚾᛟᚠᛚᚢᛉ"
    exec python main.py
fi
