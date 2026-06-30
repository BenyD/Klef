/// <reference types="@cloudflare/vitest-pool-workers/types" />
import type { D1Migration } from "@cloudflare/vitest-pool-workers";

// The `cloudflare:test` module types `env` as `Cloudflare.Env`. Augment that
// (not the production global `Env`) with the test-only bindings we inject in
// vitest.config.ts, so they never leak into the Worker's runtime types.
declare global {
  namespace Cloudflare {
    interface Env {
      TEST_MIGRATIONS: D1Migration[];
    }
  }
}
