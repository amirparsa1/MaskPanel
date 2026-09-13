# RunoFlux MaskPanel - Procfile for Railway / Heroku / Render
# Railway will use Dockerfile if exists, but Procfile as fallback

web: /code/start.sh
worker: python scheduler_worker.py
node: python node_worker.py
release: python -m alembic upgrade head
