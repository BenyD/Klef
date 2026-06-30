import { describe, expect, it } from "vitest";
import { diffLines, diffStats, isUnchanged } from "./diff.ts";

describe("diffLines", () => {
  it("reports no changes for identical text", () => {
    const text = "A=1\nB=2\n";
    expect(diffLines(text, text).every((o) => o.type === "same")).toBe(true);
    expect(isUnchanged(text, text)).toBe(true);
  });

  it("detects an added line", () => {
    const ops = diffLines("A=1\nB=2", "A=1\nB=2\nC=3");
    expect(ops.filter((o) => o.type === "add").map((o) => o.text)).toEqual(["C=3"]);
    expect(diffStats(ops)).toEqual({ added: 1, removed: 0 });
  });

  it("detects a removed line", () => {
    const ops = diffLines("A=1\nB=2\nC=3", "A=1\nC=3");
    expect(ops.filter((o) => o.type === "remove").map((o) => o.text)).toEqual(["B=2"]);
    expect(diffStats(ops)).toEqual({ added: 0, removed: 1 });
  });

  it("represents a changed value as remove + add", () => {
    const ops = diffLines("KEY=old", "KEY=new");
    expect(diffStats(ops)).toEqual({ added: 1, removed: 1 });
    expect(ops.find((o) => o.type === "remove")?.text).toBe("KEY=old");
    expect(ops.find((o) => o.type === "add")?.text).toBe("KEY=new");
  });

  it("preserves order and unchanged context", () => {
    const ops = diffLines("A=1\nB=2\nC=3", "A=1\nB=22\nC=3");
    expect(ops.map((o) => `${o.type[0]}:${o.text}`)).toEqual([
      "s:A=1",
      "r:B=2",
      "a:B=22",
      "s:C=3",
    ]);
  });

  it("treats CRLF and LF as equal", () => {
    expect(isUnchanged("A=1\r\nB=2", "A=1\nB=2")).toBe(true);
    expect(diffStats(diffLines("A=1\r\nB=2", "A=1\nB=2"))).toEqual({ added: 0, removed: 0 });
  });

  it("handles empty old (first save) and empty new (cleared)", () => {
    expect(diffStats(diffLines("", "A=1\nB=2"))).toEqual({ added: 2, removed: 0 });
    expect(diffStats(diffLines("A=1\nB=2", ""))).toEqual({ added: 0, removed: 2 });
  });
});
