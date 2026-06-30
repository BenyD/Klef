import { Navigate, Route, Routes } from "react-router";
import { Loader2 } from "lucide-react";
import { useSession } from "./auth.ts";
import { VaultProvider, useVault } from "./vault-session.tsx";
import { Landing } from "./components/Landing.tsx";
import { AuthPage } from "./components/AuthPage.tsx";
import { VaultSetup } from "./components/VaultSetup.tsx";
import { UnlockScreen } from "./components/UnlockScreen.tsx";
import { VaultHome } from "./components/VaultHome.tsx";

function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Loader2 className="text-muted-foreground size-5 animate-spin" />
    </div>
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

function AppArea() {
  const { data: session, isPending } = useSession();
  if (isPending) return <Loading />;
  if (!session) return <Navigate to="/auth" replace />;
  return (
    <VaultProvider>
      <VaultGate email={session.user.email} />
    </VaultProvider>
  );
}

function AuthRoute() {
  const { data: session, isPending } = useSession();
  if (isPending) return <Loading />;
  if (session) return <Navigate to="/app" replace />;
  return <AuthPage />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthRoute />} />
      <Route path="/app" element={<AppArea />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
