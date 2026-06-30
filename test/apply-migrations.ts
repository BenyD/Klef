import { applyD1Migrations, env } from "cloudflare:test";

// Runs once before the Worker test suite: applies our D1 migrations to the
// isolated local database so routes can query real tables.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
