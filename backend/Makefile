.PHONY: setup run migrate migration logs clean download-models

setup:
	docker compose up -d --build
	@echo "Waiting for database..."
	@until docker compose exec db pg_isready -U italearn > /dev/null 2>&1; do sleep 1; done
	docker compose exec api alembic upgrade head
	@echo "Ready: http://localhost:8000/health"

run:
	docker compose up

migrate:
	docker compose exec api alembic upgrade head

migration:
	docker compose exec api alembic revision --autogenerate -m "$(msg)"

logs:
	docker compose logs -f api

download-models:
	docker compose exec api python -c "from faster_whisper import WhisperModel; WhisperModel('small', device='cpu', compute_type='int8')"
	@echo "Whisper 'small' model downloaded."

clean:
	docker compose down -v
