export function createSlug(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


export function createTitle(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}


export function extractInfo(markdown) {
  const text =
    markdown
      // Remove fenced code blocks.
      .replace(
        /```[\s\S]*?```/g,
        ""
      )

      // Remove Markdown headings.
      .replace(
        /^#{1,6}\s+.*$/gm,
        ""
      )

      // Remove blockquotes.
      .replace(
        /^>\s?.*$/gm,
        ""
      )

      // Remove Markdown emphasis markers.
      .replace(
        /[*_`~]/g,
        ""
      )

      .trim();


  const paragraphs =
    text
      .split(/\n\s*\n/)
      .map(
        (paragraph) =>
          paragraph
            .replace(/\s+/g, " ")
            .trim()
      )
      .filter(Boolean);


  const words =
    text
      .split(/\s+/)
      .filter(Boolean)
      .length;


  return {
    description:
      paragraphs[0] ?? "",

    readTime:
      `${Math.max(
        1,
        Math.ceil(
          words / 200
        )
      )} min read`,
  };
}
