import Button from "./Button";

function FeaturedRepositoryCard({ repository }) {
  const topics = repository.topics ?? [];

  return (
    <article className="repository-card">
      <header className="repository-card-header">
        <h3 className="repository-name">
          {repository.name}
        </h3>

        <p className="repository-description">
          {repository.description || "No description available."}
        </p>
      </header>

      {topics.length > 0 && (
        <ul className="repository-topics">
          {topics.map((topic) => (
            <li
              key={topic}
              className="repository-topic"
            >
              {topic}
            </li>
          ))}
        </ul>
      )}

      <dl className="repository-meta">
        <div>
          <dt>Stars</dt>
          <dd>★ {repository.stars ?? 0}</dd>
        </div>

        <div>
          <dt>Forks</dt>
          <dd>⑂ {repository.forks ?? 0}</dd>
        </div>

        <div>
          <dt>Language</dt>
          <dd>{repository.language || "Unknown"}</dd>
        </div>
      </dl>

      <footer className="repository-actions">
        <Button
          href={repository.repository}
          variant="secondary"
        >
          Repository
        </Button>

        {repository.homepage && (
          <Button href={repository.homepage}>
            Live
          </Button>
        )}
      </footer>
    </article>
  );
}

export default FeaturedRepositoryCard;
