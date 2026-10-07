import { describe, expect, it } from "vitest";

import {
  createSlug,
  createTitle,
  extractInfo,
} from "../../scripts/utils/content.js";

describe("content utilities", () => {
  it("creates stable slugs from filenames", () => {
    expect(createSlug("Hello World_v2.MD")).toBe("hello-world-v2");

    expect(createSlug("---Already--Slug---.txt")).toBe("already-slug");
  });

  it("creates readable titles from filenames", () => {
    expect(createTitle("hello_world-v2.md")).toBe("Hello World V2");
  });

  it("extracts the first useful paragraph and estimates reading time", () => {
    const markdown = [
      "# Heading",
      "",
      "> A blockquote that should not become the description.",
      "",
      "First **useful** paragraph with `code`.",
      "",
      "```js",
      "ignored code words should not count",
      "```",
      "",
      "Second paragraph.",
    ].join("\n");

    expect(extractInfo(markdown)).toEqual({
      description: "First useful paragraph with code.",
      readTime: "1 min read",
    });
  });

  it("never returns a zero-minute reading time", () => {
    expect(extractInfo("")).toEqual({
      description: "",
      readTime: "1 min read",
    });
  });
});
