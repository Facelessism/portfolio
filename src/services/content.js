import content from "../generated/content.json";

export function getArticles() {
  return content.filter(
    (item) => item.type === "article"
  );
}


export function getDocuments() {
  return content.filter(
    (item) => item.type === "document"
  );
}
