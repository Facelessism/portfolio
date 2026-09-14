import Button from "./Button";

const LANGUAGE_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3776ab",
  Java: "#f89820",
  Go: "#00add8",
  Rust: "#dea584",
  C: "#555",
  "C++": "#00599c",
  HTML: "#e34f26",
  CSS: "#1572b6",
  PHP: "#777bb4",
  Ruby: "#cc342d",
  Kotlin: "#7f52ff",
  Swift: "#f05138",
};

function formatCount(value) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value ?? 0);
}

function FeaturedRepositoryCard({ repository }) {
  const language = repository.language || "Unknown";
  const accent = LANGUAGE_COLORS[language] || "#8b8f98";
  const topics = repository.topics?.length
    ? repository.topics.slice(0, 6)
    : ["repository"];

  return (
    <article
      className="repository-card"
      style={{ "--repository-accent": accent }}
    >
      <div className="repository-card-content">
        <header className="repository-card-header">
          <div className="repository-card-path">
            <span className="repository-card-status" />
            <span>{repository.owner}</span>
            <b>/</b>
            <span className="repository-card-repo">{repository.repo}</span>
          </div>

          <h3 className="repository-name">{repository.name}</h3>

          <div className="repository-card-language">
            <i />
            <span>{language}</span>
          </div>
        </header>

        <div className="repository-card-tags" aria-label="Repository topics">
          <div className="repository-card-tags-track">
            {[...topics, ...topics].map((topic, index) => (
              <span key={`${topic}-${index}`}>
                <b>•</b>
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="repository-card-description">
          <p>
            {repository.description || "No description available."}
          </p>
        </div>

        <div className="repository-card-spacer" />

        <dl className="repository-card-meta">
          <div>
            <dt>Stars</dt>
            <dd>{formatCount(repository.stars)}</dd>
          </div>

          <div>
            <dt>Forks</dt>
            <dd>{formatCount(repository.forks)}</dd>
          </div>

          <div>
            <dt>Commits</dt>
            <dd>{formatCount(repository.commits)}</dd>
          </div>

          <div>
            <dt>Type</dt>
            <dd>
              <i />
              {repository.fork ? "Fork" : "Source"}
            </dd>
          </div>
        </dl>

        <footer className="repository-actions">
          <Button href={repository.repositoryUrl} variant="secondary">
            Source
            <span aria-hidden="true">↗</span>
          </Button>

          {repository.homepage && (
            <Button href={repository.homepage}>
              Live
              <span aria-hidden="true">↗</span>
            </Button>
          )}
        </footer>
      </div>
    </article>
  );
}

export default FeaturedRepositoryCard;
