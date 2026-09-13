#!/usr/bin/env bash

ROLE="${ROLE:-all-in-one}"

echo "
╔════════════════════════════════════════════════════════════╗
║  🎭 MaskPanel by RunoFlux • Veiled Flux Engine            ║
║  ᛗ ᚨᛊᚲ ᛈᚨᚾᛖᛚ • ᚱᚢᚾᛟᚠᛚᚢᛉ • ᛉ ᚡᛖᛁᛚᛖᛞ ᚠᛚᚢᛉ                     ║
║  Veiled Connectivity, Flux Intelligence                    ║
╚════════════════════════════════════════════════════════════╝
"

if [ "${ROLE}" = "node" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🛰️ Starting Flux Node Worker... ᚱ"
    exec python node_worker.py
elif [ "${ROLE}" = "scheduler" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⏰ Starting Flux Scheduler... ᛚ"
    exec python scheduler_worker.py
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🎭 Starting MaskPanel (${ROLE})... ᛗ"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🌊 Flux Engine: Initializing veiled routes..."
    python -m alembic upgrade head
    exit_code=$?

    if [ $exit_code -ne 0 ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ ERROR: Database migrations failed"
        exit 1
    fi

    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 👻 Ghost Mode: Active • Obfuscation: 94% • Masks: Ready"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🚀 MaskPanel ready at /dashboard/ • Flux: Optimal"
    exec python main.py
fi
