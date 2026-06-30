import { useState, type FormEvent } from "react";
import { useVault } from "../vault-session.tsx";
import { TopBar } from "./TopBar.tsx";

export function UnlockScreen() {
  const { unlock, recover } = useVault();
  const [mode, setMode] = useState<"passphrase" | "recovery">("passphrase");
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "passphrase") await unlock(value);
      else await recover(value);
      // On success the vault status flips to "unlocked" and this screen unmounts.
    } catch {
      setError(
        mode === "passphrase"
          ? "Incorrect passphrase."
          : "That recovery key didn’t work.",
      );
      setBusy(false);
    }
  }

  function switchMode(next: "passphrase" | "recovery") {
    setMode(next);
    setValue("");
    setError(null);
  }

  return (
    <main className="shell narrow">
      <TopBar />
      <section className="card">
        <h2 className="welcome">Unlock your vault</h2>
        <p className="muted small">
          Enter your master passphrase to decrypt your secrets in this browser.
        </p>
        <form onSubmit={onSubmit} className="form">
          {mode === "passphrase" ? (
            <label className="field">
              <span>Master passphrase</span>
              <input
                type="password"
                autoComplete="current-password"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
              />
            </label>
          ) : (
            <label className="field">
              <span>Recovery key</span>
              <input
                type="text"
                spellCheck={false}
                placeholder="KLEF-XXXXX-XXXXX-…"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
              />
            </label>
          )}
          {error && <p className="bad small">{error}</p>}
          <button className="btn" type="submit" disabled={busy || !value}>
            {busy ? "Unlocking…" : "Unlock"}
          </button>
        </form>
        <button
          className="btn link"
          onClick={() =>
            switchMode(mode === "passphrase" ? "recovery" : "passphrase")
          }
        >
          {mode === "passphrase"
            ? "Forgot your passphrase? Use your recovery key"
            : "Use your passphrase instead"}
        </button>
      </section>
    </main>
  );
}
