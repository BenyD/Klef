import { useState } from "react";
import { TopBar } from "./TopBar.tsx";
import { StructureNav, type SelectedFile } from "./StructureNav.tsx";
import { FilePane } from "./FilePane.tsx";
import { useTree } from "../use-tree.ts";

export function VaultHome({ email }: { email: string }) {
  const { tree, error, reload } = useTree();
  const [selected, setSelected] = useState<SelectedFile | null>(null);

  return (
    <div className="app-shell">
      <TopBar />
      <div className="workbench">
        <aside className="sidebar">
          {error && <p className="bad small">{error}</p>}
          {tree ? (
            <StructureNav
              tree={tree}
              reload={reload}
              selectedFileId={selected?.id ?? null}
              onSelectFile={setSelected}
            />
          ) : (
            <p className="muted small">Loading…</p>
          )}
        </aside>

        <main className="pane">
          {selected ? (
            <FilePane key={selected.id} file={selected} onSaved={reload} />
          ) : (
            <div className="pane-empty">
              <p className="muted">
                Select an env file, or create a workspace → project → file to get
                started.
              </p>
              <p className="muted small">Signed in as {email}.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
