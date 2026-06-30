import { useState, type FormEvent } from "react";
import { useVault } from "../vault-session.tsx";
import { TopBar } from "./TopBar.tsx";

const MIN_LENGTH = 8;

export function VaultSetup() {
  const { runSetup, finishSetup } = useVault();
  const [step, setStep] = useState<"passphrase" | "recovery">("passphrase");
  const [passphrase, setPassphrase] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [saved, setSaved] = useState(false);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (passphrase.length < MIN_LENGTH) {
      setError(`Use at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (passphrase !== confirm) {
      setError("Passphrases don’t match.");
      return;
    }
    setBusy(true);
    try {
      setRecoveryKey(await runSetup(passphrase));
      setStep("recovery");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  function copy() {
    void navigator.clipboard?.writeText(recoveryKey);
  }

  function download() {
    const blob = new Blob(
      [
        `Klef recovery key\n\n${recoveryKey}\n\n`,
        "Keep this somewhere safe and private. It is the ONLY way back into your\n",
        "vault if you forget your passphrase. Klef cannot recover it for you.\n",
      ],
      { type: "text/plain" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "klef-recovery-key.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (step === "recovery") {
    return (
      <main className="shell narrow">
        <TopBar />
        <section className="card">
          <h2 className="welcome">Save your recovery key</h2>
          <p>
            This is shown <strong>once</strong>. It’s the only way back if you
            forget your passphrase — Klef can’t recover it for you.
          </p>
          <pre className="recovery-code">{recoveryKey}</pre>
          <div className="row-actions">
            <button className="btn secondary" onClick={copy}>Copy</button>
            <button className="btn secondary" onClick={download}>Download</button>
          </div>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={saved}
              onChange={(e) => setSaved(e.target.checked)}
            />
            <span>
              I’ve saved my recovery key and understand Klef cannot recover it for
              me.
            </span>
          </label>
          <button className="btn" disabled={!saved} onClick={finishSetup}>
            Enter my vault
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="shell narrow">
      <TopBar />
      <section className="card">
        <h2 className="welcome">Set your master passphrase</h2>
        <p>
          This passphrase encrypts everything in your vault, in this browser. It
          never reaches our servers, and we can’t reset it. Choose something
          strong you won’t forget.
        </p>
        <form onSubmit={onCreate} className="form">
          <label className="field">
            <span>Master passphrase</span>
            <input
              type="password"
              autoComplete="new-password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              autoFocus
            />
          </label>
          <label className="field">
            <span>Confirm passphrase</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>
          {error && <p className="bad small">{error}</p>}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Creating your vault…" : "Create vault"}
          </button>
        </form>
      </section>
    </main>
  );
}
