import { useSession } from "./auth.ts";
import { VaultProvider, useVault } from "./vault-session.tsx";
import { LoginScreen } from "./components/LoginScreen.tsx";
import { VaultSetup } from "./components/VaultSetup.tsx";
import { UnlockScreen } from "./components/UnlockScreen.tsx";
import { VaultHome } from "./components/VaultHome.tsx";

function Loading() {
  return (
    <main className="shell narrow">
      <p className="muted">Loading…</p>
    </main>
  );
}

// Authenticated: route by vault state (the crypto "unlock" gate).
function VaultGate({ email }: { email: string }) {
  const { status } = useVault();
  switch (status) {
    case "loading":
      return <Loading />;
    case "needs-setup":
      return <VaultSetup />;
    case "locked":
      return <UnlockScreen />;
    case "unlocked":
      return <VaultHome email={email} />;
  }
}

export function App() {
  const { data: session, isPending } = useSession();

  if (isPending) return <Loading />;
  if (!session) return <LoginScreen />;

  return (
    <VaultProvider>
      <VaultGate email={session.user.email} />
    </VaultProvider>
  );
}
