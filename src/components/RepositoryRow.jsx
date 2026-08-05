import Button from "./Button";

function RepositoryRow({ repository }) {
  const topics = (repository.topics ?? []).slice(0, 4);

  return (
    <article className="repository-row">

      <div className="repository-row-main">

        <header className="repository-row-header">

          <h3 className="repository-row-title">
            {repository.name}
          </h3>

          <p className="repository-row-description">
            {repository.description}
          </p>

        </header>

        {topics.length > 0 && (
          <ul className="repository-row-topics">

            {topics.map((topic) => (
              <li
                key={topic}
                className="repository-row-topic"
              >
                {topic}
              </li>
            ))}

          </ul>
        )}

        <div className="repository-row-meta">

          <span>
            ★ {repository.stars}
          </span>

          <span>
            Forks {repository.forks}
          </span>

        </div>

      </div>

      <aside className="repository-row-actions">

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

      </aside>

    </article>
  );
}

export default RepositoryRow;
