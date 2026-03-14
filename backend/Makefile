.PHONY: setup run migrate migration logs clean

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

clean:
	docker compose down -v
