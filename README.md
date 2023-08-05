# Prereq

1. Install pnpm
2. Install docker
3. Install docker-compose
4. Fill in these environment variables in a .env file in the root of the project

```
POSTGRES_PASSWORD=
POSTGRES_USER=
POSTGRES_DB=
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public
```

# Setup database

1. On first setup run "docker-compose up db -d" to start the database container
2. Run "pnpm prisma migrate dev --name init" to create the database schema
3. Run "pnpm prisma db seed" to seed the database with test data

# Update db

1. Run "pnpm prisma migrate dev" to update the database schema
2. Run "pnpm prisma generate" to generate the prisma client
3. Run "pnpm prisma db seed" to seed the database with test data if needed.
  - Make sure the seed file is not destructive to existing data
4. Run the following for sql files
  - psql -h hostname -U username -d databasename -f command_to_run_1.sql
