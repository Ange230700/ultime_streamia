# scripts\db\setup.sh

#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL-}" ]; then
  echo "⚠️  Please set DATABASE_URL in your environment" >&2
  exit 1
fi

echo "🚧 Resetting database…"
npx prisma migrate reset --force

echo "🔧 Regenerating client…"
npx prisma generate

echo "🌱 Seeding database…"
npx prisma db seed

echo "✅ Database is ready!"
