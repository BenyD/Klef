import path from "node:path";
import { defineConfig } from "vitest/config";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-pool-workers";

// Two test surfaces (see PRD §5 / research):
//   - "unit"   : pure crypto + client logic in a fast node/happy-dom env.
//   - "worker" : Hono routes + D1 inside the real workerd runtime (Miniflare),
//                with our migrations applied to an isolated local D1 per run.
export default defineConfig(async () => {
  const migrations = await readD1Migrations(
    path.join(import.meta.dirname, "migrations"),
  );

  return {
    test: {
      projects: [
        {
          test: {
            name: "unit",
            environment: "node",
            include: [
              "src/shared/**/*.test.ts",
              "src/client/**/*.test.{ts,tsx}",
            ],
          },
        },
        {
          plugins: [
            cloudflareTest({
              wrangler: { configPath: "./wrangler.jsonc" },
              // Hand the migrations to the test Worker as a binding so the
              // setup file can apply them to the isolated local D1.
              miniflare: {
                bindings: { TEST_MIGRATIONS: migrations },
              },
            }),
          ],
          test: {
            name: "worker",
            include: ["src/worker/**/*.test.ts"],
            setupFiles: ["./test/apply-migrations.ts"],
          },
        },
      ],
    },
  };
});
