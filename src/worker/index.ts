import { Hono } from "hono";

// `Env` is generated into worker-configuration.d.ts by `wrangler types`
// (run `pnpm cf-typegen`). It exposes the bindings declared in wrangler.jsonc,
// e.g. `DB: D1Database`.
const app = new Hono<{ Bindings: Env }>();

// Phase 0 smoke test: proves the SPA can reach the Worker AND the Worker can
// reach D1 through the real binding. Replaced/expanded in later phases.
app.get("/api/health", async (c) => {
  const row = await c.env.DB.prepare(
    "SELECT COUNT(*) AS n FROM health_check",
  ).first<{ n: number }>();

  return c.json({
    ok: true,
    service: "klef",
    db: { reachable: true, healthChecks: row?.n ?? 0 },
    time: new Date().toISOString(),
  });
});

// Anything else under /api that we haven't defined yet.
app.all("/api/*", (c) => c.json({ ok: false, error: "Not found" }, 404));

export default app;
