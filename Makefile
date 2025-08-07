# HeatScape Docker Management Makefile

.PHONY: help build up down logs clean dev prod restart

# Default target
help:
	@echo "HeatScape Docker Management"
	@echo "=========================="
	@echo "Available commands:"
	@echo "  build      - Build all services"
	@echo "  up         - Start all services"
	@echo "  down       - Stop all services"
	@echo "  logs       - View logs from all services"
	@echo "  clean      - Remove containers, networks, and images"
	@echo "  dev        - Start services in development mode"
	@echo "  prod       - Start services in production mode"
	@echo "  restart    - Restart all services"
	@echo ""
	@echo "Individual service commands:"
	@echo "  build-image   - Build image processing service"
	@echo "  build-vlm     - Build VLM solution service"
	@echo "  build-iot     - Build IoT localization service"
	@echo "  logs-image    - View image processing service logs"
	@echo "  logs-vlm      - View VLM solution service logs"
	@echo "  logs-iot      - View IoT localization service logs"

# Build all services
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Clean up everything
clean:
	docker-compose down -v --rmi all --remove-orphans

# Development mode
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Production mode
prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Restart services
restart:
	docker-compose restart

# Individual service builds
build-image:
	docker-compose build image-processing-service

build-vlm:
	docker-compose build vlm-solution-service

build-iot:
	docker-compose build iot-localization-service

# Individual service logs
logs-image:
	docker-compose logs -f image-processing-service

logs-vlm:
	docker-compose logs -f vlm-solution-service

logs-iot:
	docker-compose logs -f iot-localization-service

# Check service status
status:
	docker-compose ps

# Enter service containers
shell-image:
	docker-compose exec image-processing-service bash

shell-vlm:
	docker-compose exec vlm-solution-service bash

shell-iot:
	docker-compose exec iot-localization-service bash
