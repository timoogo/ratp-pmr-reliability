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


reset-db:
	docker compose down -v
	sudo rm -rf prisma/migrations
	sudo rm -rf node_modules/.prisma
	docker compose up -d
	docker compose exec web npx prisma migrate dev --name init
	docker compose exec web npx prisma generate
	docker compose exec web npm run build:seed
	docker compose exec web node dist/prisma/seed.js


reseed:
	docker compose exec web npm run build:seed
	docker compose exec web node dist/prisma/seed.js
