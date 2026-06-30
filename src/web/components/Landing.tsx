import type { ReactNode } from "react";
import { Link } from "react-router";
import { KeyRound, Lock, GitBranch, RefreshCw } from "lucide-react";
import { Button } from "./ui/button.tsx";

export function Landing() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <KeyRound className="size-3.5" />
          </div>
          <span className="font-semibold tracking-tight">Klef</span>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/auth">Sign in</Link>
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-5">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Zero-knowledge sync for your .env files
          </h1>
          <p className="text-muted-foreground max-w-lg text-lg text-balance">
            Store environment files in one place and pull them down on any
            machine. Everything is encrypted in your browser before it leaves.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/auth">Get started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="https://github.com/BenyD/klef" target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>

        <div className="mt-8 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          <Feature icon={<Lock className="size-4" />} title="End-to-end encrypted">
            Keys are derived and held in your browser. The server only ever stores
            ciphertext.
          </Feature>
          <Feature icon={<RefreshCw className="size-4" />} title="Paste, diff, save">
            See exactly what changed before you save a new version.
          </Feature>
          <Feature icon={<GitBranch className="size-4" />} title="Version history">
            Every save is a version. Restore any of them anytime.
          </Feature>
        </div>
      </main>

      <footer className="text-muted-foreground mx-auto w-full max-w-5xl px-6 py-6 text-center text-sm">
        Open source, AGPL-3.0
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-card flex flex-col gap-2 rounded-xl border p-4 text-left">
      <div className="bg-muted text-foreground flex size-8 items-center justify-center rounded-md">
        {icon}
      </div>
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground text-sm">{children}</p>
    </div>
  );
}
