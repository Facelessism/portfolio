import { describe, expect, it } from "vitest";

import {
  formatNumber,
  getConnectedIds,
  hash,
} from "../../src/utils/visualization.js";

describe("visualization utilities", () => {
  it("produces deterministic numeric hashes", () => {
    expect(hash("portfolio")).toBe(hash("portfolio"));

    expect(hash("portfolio")).not.toBe(hash("repository"));

    expect(hash("")).toBe(0);
  });

  it("returns the selected node and directly connected nodes", () => {
    const edges = [
      { source: "a", target: "b" },
      { source: "c", target: "a" },
      { source: "d", target: "e" },
    ];

    expect(
      getConnectedIds(edges, "a", (edge) => [edge.source, edge.target]),
    ).toEqual(new Set(["a", "b", "c"]));
  });

  it("returns an empty set when nothing is selected", () => {
    expect(
      getConnectedIds([{ source: "a", target: "b" }], null, (edge) => [
        edge.source,
        edge.target,
      ]),
    ).toEqual(new Set());
  });

  it("formats numbers using the shared formatter", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(1234)).toBe("1,234");
  });
});
