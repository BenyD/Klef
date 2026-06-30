import type { ReactNode } from "react";
import { Link } from "react-router";
import { GitBranch, KeyRound, Lock, RefreshCw } from "lucide-react";
import "../styles/marketing.css";

export function Landing() {
  return (
    <div className="marketing">
      <nav className="marketing-nav">
        <Link to="/" className="marketing-brand">
          <span className="marketing-brand-mark">
            <KeyRound size={14} />
          </span>
          Klef
        </Link>
        <div className="marketing-nav-links">
          <a
            href="https://github.com/BenyD/klef"
            target="_blank"
            rel="noreferrer"
            className="m-btn m-btn-ghost m-btn-sm"
          >
            GitHub
          </a>
          <Link to="/auth" className="m-btn m-btn-primary m-btn-sm">
            Sign in
          </Link>
        </div>
      </nav>

      <main className="marketing-hero">
        <h1>Zero-knowledge sync for your .env files</h1>
        <p>
          Store environment files in one place and pull them down on any machine.
          Everything is encrypted in your browser before it leaves.
        </p>
        <div className="marketing-cta">
          <Link to="/auth" className="m-btn m-btn-primary">
            Get started
          </Link>
          <a
            href="https://github.com/BenyD/klef"
            target="_blank"
            rel="noreferrer"
            className="m-btn m-btn-outline"
          >
            View on GitHub
          </a>
        </div>
      </main>

      <section className="marketing-features">
        <Feature icon={<Lock size={16} />} title="End-to-end encrypted">
          Keys are derived and held in your browser. The server only stores
          ciphertext.
        </Feature>
        <Feature icon={<RefreshCw size={16} />} title="Paste, diff, save">
          See exactly what changed before you save a new version.
        </Feature>
        <Feature icon={<GitBranch size={16} />} title="Version history">
          Every save is a version. Restore any of them anytime.
        </Feature>
      </section>

      <footer className="marketing-footer">
        <div className="marketing-footer-inner">
          <span>Klef</span>
          <span>Open source, AGPL-3.0</span>
        </div>
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
    <div className="marketing-feature">
      <div className="marketing-feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
