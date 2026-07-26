import Button from "./Button";

function RepositoryCard({ repository }) {
  return (
    <article className="repository-card">
      <header className="repository-card-header">
        <h3 className="repository-name">
          {repository.name}
        </h3>

        <p className="repository-description">
          {repository.description}
        </p>
      </header>

      {(repository.topics ?? []).length > 0 && (
        <ul className="repository-topics">
          {repository.topics.map((topic) => (
            <li
              key={topic}
              className="repository-topic"
            >
              {topic}
            </li>
          ))}
        </ul>
      )}

      <div className="repository-meta">
        <span>★ {repository.stars}</span>
        <span>⑂ {repository.forks}</span>
        <span>{repository.language}</span>
      </div>

      <div className="repository-actions">
        <Button
          href={repository.repository}
          external
          variant="secondary"
        >
          Repository
        </Button>

        {repository.homepage && (
          <Button
            href={repository.homepage}
            external
          >
            Live
          </Button>
        )}
      </div>
    </article>
  );
}

export default RepositoryCard;
