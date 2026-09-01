import { getArticles } from "../services/content";

import WritingCard from "./WritingCard";
import SectionHeader from "./SectionHeader";

function WritingSection() {
  const articles = getArticles();

  return (
    <section className="writing-section">
      <SectionHeader
        path="~/writing"
        title="Articles"
        description="Engineering notes, research, logs and writings."
      />

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
