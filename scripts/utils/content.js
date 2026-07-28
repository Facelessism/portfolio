export function createSlug(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createTitle(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function extractInfo(markdown) {
  const text = markdown
    .replace(/^#+\s.*$/gm, "")
    .replace(/[*_`>#]/g, "")
    .trim();

  const paragraphs = text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const words = text
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    description: paragraphs[0] ?? "",
    readTime: `${Math.max(
      1,
      Math.ceil(words / 200)
    )} min read`,
  };
}
