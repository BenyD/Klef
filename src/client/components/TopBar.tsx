import { signOut } from "../auth.ts";
import { useVault } from "../vault-session.tsx";

/** App header. Shows a Lock action only when the vault is unlocked. */
export function TopBar() {
  const { status, lock } = useVault();
  return (
    <header className="topbar">
      <strong>Klef</strong>
      <div className="topbar-actions">
        {status === "unlocked" && (
          <button className="btn ghost small" onClick={lock}>
            Lock
          </button>
        )}
        <button className="btn ghost small" onClick={() => void signOut()}>
          Sign out
        </button>
      </div>
    </header>
  );
}
