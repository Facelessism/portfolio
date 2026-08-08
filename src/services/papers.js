import papers from "../generated/papers.json";

export function getPapers() {
  return papers;
}

export function getPaper(slug) {
  return papers.find(
    (paper) =>
      paper.slug === slug
  );
}

export function getPaperUrl(filename) {
  const base =
    import.meta.env.BASE_URL;

  return `${base}papers/${encodeURIComponent(
    filename
  )}`;
}
