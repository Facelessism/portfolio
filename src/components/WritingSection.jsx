import { getArticles } from "../services/content";
import WritingCard from "./WritingCard";

function WritingSection() {
  const articles = getArticles();

  return (
    <section className="writing-section">
      <div className="section-header">
        <h2>Articles</h2>

        <p>
          Essays, engineering notes, research, development logs and
          long-form writing.
        </p>
      </div>

      <div className="writing-grid">
        {articles.length > 0 ? (
          articles.map((article) => (
            <WritingCard
              key={article.id}
              article={article}
            />
          ))
        ) : (
          <p className="section-empty">
            No articles published yet.
          </p>
        )}
      </div>
    </section>
  );
}

export default WritingSection;
