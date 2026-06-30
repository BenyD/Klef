import { TopBar } from "./TopBar.tsx";

/**
 * Placeholder unlocked view. Workspaces / projects / files (Phase 4) and the
 * paste→diff→save loop (Phase 5) render here next.
 */
export function VaultHome({ email }: { email: string }) {
  return (
    <main className="shell narrow">
      <TopBar />
      <section className="card">
        <h2 className="welcome">Vault unlocked</h2>
        <ul className="status">
          <li>
            <span>Signed in</span>
            <strong>{email}</strong>
          </li>
          <li>
            <span>Vault</span>
            <strong className="good">unlocked</strong>
          </li>
        </ul>
        <p className="muted small">
          Your secrets are decryptable in this browser for this session. Use{" "}
          <em>Lock</em> to clear the key from memory without signing out.
          Workspaces and the paste-to-sync loop arrive in the next phases.
        </p>
      </section>
    </main>
  );
}
