#!/bin/sh

echo "⏳ Attente de la base de données..."
until nc -z db 5432; do
  sleep 1
done

echo "✅ Base de données accessible, on applique les migrations..."
npx prisma migrate deploy

echo "🌱 Exécution du seed..."
npm run seed || echo "⚠️ Seed ignoré (peut-être déjà appliqué ou vide)"

echo "🚀 Lancement de l'app"
npm run start
