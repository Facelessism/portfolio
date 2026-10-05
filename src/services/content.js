import content from "../generated/content.json";

export function getArticles() {
  return content.filter(
    (item) => item.type === "article",
  );
}
