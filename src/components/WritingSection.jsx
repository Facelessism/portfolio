import { getArticles } from "../services/content";
import WritingCard from "./WritingCard";


function WritingSection() {
  const articles = getArticles();

  return (
    <section className="writing-section">

      <div className="section-header">

        <h2>
          Articles
        </h2>

        <p>
          Technical writing, engineering notes
          and development logs.
        </p>

      </div>


      <div className="writing-grid">

        {articles.length === 0 ? (
          <p className="section-empty">
            No articles published yet.
          </p>
        ) : (
          articles.map((article) => (
            <WritingCard
              key={article.id}
              article={article}
            />
          ))
        )}

      </div>

    </section>
  );
}


export default WritingSection;
