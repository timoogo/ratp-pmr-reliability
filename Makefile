ENV_FILE = .env
UID := $(shell id -u)
GID := $(shell id -g)
ENV_VARS = UID=$(UID) GID=$(GID)

build-dev:
	$(ENV_VARS) docker-compose -f docker-compose.yml build

build-prod:
	$(ENV_VARS) docker-compose -f docker-compose.yml build

start-dev:
	$(ENV_VARS) docker compose down -v
	sudo chown -R $(UID):$(GID) prisma/migrations || true
	sudo chown -R $(UID):$(GID) node_modules/.prisma || true
	rm -rf prisma/migrations
	rm -rf node_modules/.prisma

	# 🚀 Démarre tous les services
	$(ENV_VARS) docker compose up -d

	# 💾 Migration + génération Prisma
	$(ENV_VARS) docker compose exec web npx prisma migrate dev --name init
	$(ENV_VARS) docker compose exec web npx prisma generate

	# 👤 Permissions build dist
	$(ENV_VARS) sudo chown -R $(UID):$(GID) dist || true

	# ✅ Prisma Studio (lancé localement, non bloquant)
	make prisma-studio

stop-dev:
	$(ENV_VARS) docker-compose -f docker-compose.yml down

start-prod:
	$(ENV_VARS) docker-compose -f docker-compose.yml up

stop-prod:
	$(ENV_VARS) docker-compose -f docker-compose.yml down

test:
	$(ENV_VARS) docker-compose -f docker-compose.yml exec app npm run test

reset-db:
	$(ENV_VARS) docker compose down -v
	sudo chown -R $(UID):$(GID) prisma/migrations || true
	sudo chown -R $(UID):$(GID) node_modules/.prisma || true
	rm -rf prisma/migrations
	rm -rf node_modules/.prisma

	# 🚀 Démarre tous les services (inclut web, db, ws)
	$(ENV_VARS) docker compose up -d

	# 💾 Migration + génération Prisma
	$(ENV_VARS) docker compose exec web npx prisma migrate dev --name init
	$(ENV_VARS) docker compose exec web npx prisma generate

	# 👤 Permissions build dist
	$(ENV_VARS) sudo chown -R $(UID):$(GID) dist || true

	# 🌱 Rebuild + seed DB
	$(ENV_VARS) docker compose exec web npm run build:seed
	$(ENV_VARS) docker compose exec web node dist/prisma/seed.js

	# ✅ Prisma studio with detached mode
	$(ENV_VARS) docker compose exec web npx prisma studio &

reseed:
	$(ENV_VARS) docker compose exec web npm run build:seed
	$(ENV_VARS) docker compose exec web node dist/prisma/seed.js

restart:
	make stop-dev
	make start-dev

prune:
	-docker compose down -v --remove-orphans
	-docker image prune -f
	-docker container prune -f
	-docker volume prune -f
	-docker network prune -f


.PHONY: prisma-validate prisma-migrate

# ✅ Valider le schéma
prisma-validate:
	npx prisma validate

# ✅ Appliquer les migrations (dev)
prisma-migrate:
	docker compose up -d db
	sleep 3 # laisse le temps à la BDD de démarrer
	npx prisma validate
	npx prisma migrate dev --name subscription-schema


# ✅ Enchaîner les deux
prisma-setup: prisma-validate prisma-migrate

prisma-studio:
	docker compose exec web npx prisma studio