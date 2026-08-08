import content from "../generated/content.json";

export function getArticles() {
  return content.filter(
    (item) =>
      item.type === "article"
  );
}

export function getArticle(slug) {
  return content.find(
    (item) =>
      item.type === "article" &&
      item.slug === slug
  );
}
