import { Link } from "react-router-dom";

function WritingCard({ article }) {
  return (
    <article className="writing-card">

      <div className="writing-card-header">

        <p className="writing-category">
          {article.type}
          {" · "}
          {article.sourceFormat.toUpperCase()}
        </p>

        <h3 className="writing-title">
          <Link to={`/writing/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

      </div>

      {article.description && (
        <p className="writing-description">
          {article.description}
        </p>
      )}

      <footer className="writing-meta">
        {article.readTime && (
          <span>
            {article.readTime}
          </span>
        )}
      </footer>

    </article>
  );
}

export default WritingCard;


