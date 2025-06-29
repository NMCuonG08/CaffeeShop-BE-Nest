# Makefile
.PHONY: build up down logs restart clean

# Build images
build:
	docker-compose build --no-cache

# Start services
up:
	docker-compose up -d

# Stop services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Restart services
restart:
	docker-compose restart

# Clean up
clean:
	docker-compose down -v
	docker system prune -f
	docker volume prune -f

# Production deployment
deploy:
	git pull
	docker-compose build --no-cache
	docker-compose up -d
	docker-compose logs -f --tail=50

# Health check
health:
	docker-compose ps
	curl -f http://localhost/health || exit 1