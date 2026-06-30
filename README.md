# Klef

**Personal, zero-knowledge `.env` sync.** Paste your env files in, sync them
across machines, pull them back down — all end-to-end encrypted. The server only
ever stores ciphertext; your keys never leave the browser.

> Status: **early build.** Phase 0 (scaffold) complete. See [`PRD.md`](./PRD.md)
> for the full product spec and build phases.

Klef is deliberately **not** an Infisical/Doppler/Vault competitor. No CLI, no
daemon, no file watcher — just a dead-simple, truly zero-knowledge env vault you
drive by hand. Self-hosting on Cloudflare is a first-class feature.

## How it works (threat model in brief)

- **Zero-knowledge.** Env contents are encrypted in your browser with AES-256-GCM
  under a key (DEK) that is itself wrapped by a key derived from your master
  passphrase (Argon2id). The server sees only ciphertext, salts, and nonces.
- **Names plaintext, values encrypted.** Workspace/project/file names are stored
  in plaintext for navigation; only env *contents* are encrypted.
- **Auth ≠ unlock.** Logging in (Google/passkey) gets you a session; a separate
  master passphrase decrypts your data. A logged-in but locked client sees only
  ciphertext.
- **No server-side recovery.** Lose both your passphrase and your recovery key
  and the data is gone — by design.

The full cryptographic contract lives in
[`src/shared/BLOB_FORMAT.md`](./src/shared/BLOB_FORMAT.md).

**Klef does _not_ protect against** a compromised client device (keylogger,
malicious extension), a weak passphrase brute-forced offline, or loss of both
passphrase and recovery key.

## Stack

Vite + React SPA (owns all crypto/diffing) · Hono on Cloudflare Workers · Better
Auth · Cloudflare D1 · Wrangler + `@cloudflare/vite-plugin`. One package, one dev
server running the SPA and the Worker against real `workerd` with a real D1
binding.

## Develop

Requires Node 20+ and [pnpm](https://pnpm.io).

```bash
pnpm install
cp .dev.vars.example .dev.vars        # fill in when Phase 1 auth lands
pnpm db:migrate:local                 # apply migrations to local D1
pnpm dev                              # http://localhost:5173
```

Other scripts:

```bash
pnpm test          # Vitest: crypto units (node) + Worker/D1 (workerd via Miniflare)
pnpm typecheck     # tsc --noEmit
pnpm build         # typecheck + production build
```

## Self-hosting

Klef is built to be forked and self-hosted on your own Cloudflare account:
create your own D1 database, set your secrets, and `pnpm deploy`. A full guide
lands near Phase 6.

## License

[AGPL-3.0-or-later](./LICENSE). Open source from the first commit — for a secrets
tool, auditability is the whole trust story.
