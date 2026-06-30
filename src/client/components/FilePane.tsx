import { useEffect, useMemo, useState } from "react";
import { decryptBlob, encryptBlob } from "../../shared/crypto.ts";
import { diffLines, diffStats, isUnchanged } from "../../shared/diff.ts";
import { getCurrentVersion, saveVersion } from "../structure-api.ts";
import { useVault } from "../vault-session.tsx";
import type { SelectedFile } from "./StructureNav.tsx";

interface Props {
  file: SelectedFile;
  onSaved: () => void;
}

// The heart of Klef: paste → decrypt current in-browser → diff → save. The
// server only ever sees opaque blobs across this whole flow.
export function FilePane({ file, onSaved }: Props) {
  const { dek } = useVault();
  const [stored, setStored] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setJustSaved(false);
    getCurrentVersion(file.id)
      .then(async ({ version }) => {
        const text = version && dek ? await decryptBlob(dek, version.blob) : "";
        if (cancelled) return;
        setStored(text);
        setDraft(text);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [file.id, dek]);

  const ops = useMemo(() => diffLines(stored, draft), [stored, draft]);
  const stats = useMemo(() => diffStats(ops), [ops]);
  const changed = !isUnchanged(stored, draft);

  async function onSave() {
    if (!dek || !changed) return;
    setSaving(true);
    setError(null);
    try {
      const blob = await encryptBlob(dek, draft);
      await saveVersion(file.id, blob);
      setStored(draft);
      setJustSaved(true);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pane-file">
      <div className="pane-head">
        <h2 className="pane-title">{file.name}</h2>
        <div className="pane-actions">
          {changed ? (
            <span className="diff-summary">
              <span className="add">+{stats.added}</span>{" "}
              <span className="remove">−{stats.removed}</span>
            </span>
          ) : (
            justSaved && <span className="good small">Saved ✓</span>
          )}
          {changed && (
            <button
              className="btn ghost small"
              onClick={() => setDraft(stored)}
              disabled={saving}
            >
              Discard
            </button>
          )}
          <button className="btn small save" onClick={onSave} disabled={!changed || saving}>
            {saving ? "Saving…" : "Save version"}
          </button>
        </div>
      </div>

      {error && <p className="bad small">{error}</p>}

      {loading ? (
        <p className="muted">Decrypting…</p>
      ) : (
        <>
          <textarea
            className="editor"
            spellCheck={false}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Paste your .env contents here…"
          />
          {changed && (
            <section className="diff">
              <h3 className="diff-title">Changes</h3>
              <pre className="diff-body">
                {ops.map((op, i) => (
                  <div key={i} className={`diff-line ${op.type}`}>
                    <span className="diff-gutter">
                      {op.type === "add" ? "+" : op.type === "remove" ? "−" : " "}
                    </span>
                    {op.text || " "}
                  </div>
                ))}
              </pre>
            </section>
          )}
        </>
      )}
    </div>
  );
}
