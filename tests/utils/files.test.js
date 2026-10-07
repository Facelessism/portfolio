import { describe, expect, it } from "vitest";

import { getFileSize } from "../../scripts/utils/files.js";

describe("file utilities", () => {
  it("formats bytes", () => {
    expect(getFileSize(0)).toBe("0 B");
    expect(getFileSize(512)).toBe("512 B");
  });

  it("formats kilobytes with one decimal place", () => {
    expect(getFileSize(1024)).toBe("1.0 KB");

    expect(getFileSize(1536)).toBe("1.5 KB");
  });

  it("formats megabytes with one decimal place", () => {
    expect(getFileSize(1024 * 1024)).toBe("1.0 MB");
  });
});
