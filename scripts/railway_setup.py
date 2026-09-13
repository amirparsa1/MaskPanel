#!/usr/bin/env python3
"""
MaskPanel by RunoFlux - Railway Setup Helper
Converts Railway DATABASE_URL to SQLALCHEMY_DATABASE_URL with asyncpg
"""
import os
import sys

def convert_db_url(url: str) -> str:
    """Convert postgres:// to postgresql+asyncpg://"""
    if not url:
        return ""
    
    # Railway gives postgresql:// or postgres://
    # We need postgresql+asyncpg://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    # Ensure asyncpg
    if "postgresql://" in url and "+asyncpg" not in url:
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    return url

def main():
    print("""
╔════════════════════════════════════════════════════════════╗
║  🎭 MaskPanel by RunoFlux • Railway Setup Helper         ║
║  ᛗ ᚨᛊᚲ ᛈᚨᚾᛖᛚ • ᚱᚢᚾᛟᚠᛚᚢᛉ • 🚂 Railway                         ║
╚════════════════════════════════════════════════════════════╝
    """)
    
    # Check env
    railway_db = os.getenv("DATABASE_URL", "")
    postgres_db = os.getenv("Postgres_DATABASE_URL", "") or os.getenv("POSTGRES_URL", "")
    current = railway_db or postgres_db
    
    if current:
        print(f"📦 Found DATABASE_URL: {current[:30]}...")
        converted = convert_db_url(current)
        print(f"🔄 Converted to: {converted[:50]}...")
        print(f"\n✅ Set this as SQLALCHEMY_DATABASE_URL in Railway Variables:")
        print(f"\n{converted}\n")
    else:
        print("⚠️ No DATABASE_URL found in env")
        print("💡 In Railway, add Postgres plugin and it will auto-create DATABASE_URL")
    
    print("\n📋 Required Railway Variables:")
    print("""
PORT=8000 (Railway auto-sets)
SQLALCHEMY_DATABASE_URL=postgresql+asyncpg://... (converted from DATABASE_URL)
ROLE=all-in-one
NATS_ENABLED=0
VITE_BASE_API=/
DASHBOARD_PATH=/dashboard/
UVICORN_HOST=0.0.0.0
LOG_LEVEL=INFO
    """)
    
    print("\n🚀 After deploy:")
    print("1. railway run python maskpanel-cli.py generate-temp-key")
    print("2. Go to https://your-domain.up.railway.app/dashboard/")
    print("3. Click Owner access, enter temp key, create owner")
    print("4. Enjoy Ghost Mode! 👻 ᛉ VEILED")
    print("\nᛗ ᚨᛊᚲ ᛈᚨᚾᛖᛚ • ᚱᚢᚾᛟᚠᛚᚢᛉ")

if __name__ == "__main__":
    main()
