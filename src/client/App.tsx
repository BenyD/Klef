import { useEffect, useState } from "react";

interface Health {
  ok: boolean;
  service: string;
  db: { reachable: boolean; healthChecks: number };
  time: string;
}

export function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json() as Promise<Health>)
      .then(setHealth)
      .catch((e: unknown) => setError(String(e)));
  }, []);

  return (
    <main className="shell">
      <h1>Klef</h1>
      <p className="tagline">Zero-knowledge .env sync — your keys never leave this browser.</p>

      <section className="card">
        <h2>Phase 0 — scaffold</h2>
        {error && <p className="bad">Worker unreachable: {error}</p>}
        {!error && !health && <p className="muted">Checking Worker + D1…</p>}
        {health && (
          <ul className="status">
            <li>
              <span>SPA → Worker</span>
              <strong className="good">connected</strong>
            </li>
            <li>
              <span>Worker → D1</span>
              <strong className={health.db.reachable ? "good" : "bad"}>
                {health.db.reachable ? "connected" : "down"}
              </strong>
            </li>
            <li>
              <span>health_check rows</span>
              <strong>{health.db.healthChecks}</strong>
            </li>
          </ul>
        )}
      </section>
    </main>
  );
}
