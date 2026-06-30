import { describe, expect, it } from "vitest";
import { AES, BLOB_FORMAT_VERSION, KDF, RECOVERY_KEY } from "./constants.ts";

// The crypto contract is the linchpin: lock its parameters so an accidental
// edit can't silently weaken or fork the format. Real round-trip tests arrive
// in Phase 2.
describe("crypto contract constants", () => {
  it("uses AES-256-GCM with a 96-bit nonce", () => {
    expect(AES.name).toBe("AES-GCM");
    expect(AES.keyBytes).toBe(32); // AES-256
    expect(AES.nonceBytes).toBe(12); // 96-bit IV
    expect(AES.tagBits).toBe(128);
  });

  it("meets OWASP 2025 Argon2id / PBKDF2 floors", () => {
    expect(KDF.argon2id.memoryKiB).toBeGreaterThanOrEqual(19456);
    expect(KDF.argon2id.iterations).toBeGreaterThanOrEqual(2);
    expect(KDF.argon2id.parallelism).toBe(1);
    expect(KDF.argon2id.hashLengthBytes).toBe(32);
    expect(KDF.pbkdf2.iterations).toBeGreaterThanOrEqual(600_000);
  });

  it("recovery key carries 128 bits of entropy", () => {
    expect(RECOVERY_KEY.entropyBytes).toBe(16); // 128 bits
    expect(RECOVERY_KEY.prefix).toBe("KLEF");
  });

  it("pins the blob format version", () => {
    expect(BLOB_FORMAT_VERSION).toBe(1);
  });
});
