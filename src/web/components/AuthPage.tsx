import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { KeyRound } from "lucide-react";
import { z } from "zod";
import { authClient, signInWithGoogle } from "../auth.ts";
import { Button } from "./ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.tsx";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field.tsx";
import { Input } from "./ui/input.tsx";
import { PasswordInput } from "./ui/password-input.tsx";

type Mode = "signin" | "signup";
type FieldErrors = { name?: string; email?: string; password?: string };

function schemaFor(mode: Mode) {
  return z.object({
    name: z.string().optional(),
    email: z.email("Enter a valid email"),
    password:
      mode === "signup"
        ? z.string().min(8, "Use at least 8 characters")
        : z.string().min(1, "Enter your password"),
  });
}

export function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onGoogle() {
    setBusy(true);
    setFormError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const parsed = schemaFor(mode).safeParse({ name, email, password });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in next)) {
          next[key as keyof FieldErrors] = issue.message;
        }
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setBusy(true);

    const res =
      mode === "signup"
        ? await authClient.signUp.email({ email, password, name: name || email })
        : await authClient.signIn.email({ email, password });

    if (res.error) {
      setFormError(res.error.message ?? "Something went wrong");
      setBusy(false);
      return;
    }
    navigate("/app");
  }

  function toggleMode() {
    setMode(mode === "signin" ? "signup" : "signin");
    setErrors({});
    setFormError(null);
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 px-4 py-10">
      <Link to="/" className="flex flex-col items-center gap-3">
        <div className="bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-xl">
          <KeyRound className="size-5" />
        </div>
        <span className="text-2xl font-semibold tracking-tight">Klef</span>
      </Link>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{mode === "signin" ? "Sign in" : "Create your account"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={onGoogle}
            disabled={busy}
          >
            <GoogleMark />
            Continue with Google
          </Button>

          <div className="flex items-center gap-3">
            <span className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-xs">or</span>
            <span className="bg-border h-px flex-1" />
          </div>

          <form onSubmit={onSubmit} noValidate>
            <FieldGroup>
              {mode === "signup" && (
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </Field>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                {errors.email && <FieldError>{errors.email}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  id="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  aria-invalid={!!errors.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <FieldError>{errors.password}</FieldError>}
              </Field>
              {formError && <p className="text-destructive text-sm">{formError}</p>}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy
                  ? "Please wait"
                  : mode === "signin"
                    ? "Sign in"
                    : "Create account"}
              </Button>
            </FieldGroup>
          </form>

          <p className="text-muted-foreground text-center text-sm">
            {mode === "signin"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              className="text-foreground font-medium hover:underline"
              onClick={toggleMode}
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C39.9 36.5 44 31 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}
