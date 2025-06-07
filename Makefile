build-dev:
	docker-compose -f docker-compose.dev.yml build

build-prod:
	docker-compose -f docker-compose.yml build

start-dev:
	docker-compose -f docker-compose.dev.yml up

stop-dev:
	docker-compose -f docker-compose.dev.yml down

test:
	docker-compose -f docker-compose.dev.yml exec app npm run test

start-prod:
	docker-compose -f docker-compose.yml up

stop-prod:
	docker-compose -f docker-compose.yml down


