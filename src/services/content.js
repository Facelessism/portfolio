import content from "../generated/content.json";

export function getArticles() {
  return content;
}

export function getArticle(slug) {
  return content.find(
    (item) => item.slug === slug
  );
}
