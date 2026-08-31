function RecentWorkItem({ item, index }) {
  const date = new Date(item.timestamp);

  const dateLabel = date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  });

  const timeLabel = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <article
      className="recent-work-item"
      style={{
        "--work-index": index,
      }}
    >
      <div className="recent-work-item-line">
        <span className="recent-work-index">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className="recent-work-connector"
          aria-hidden="true"
        />
      </div>

      <div className="recent-work-item-content">
        <div className="recent-work-item-heading">
          <a
            className="recent-work-repository"
            href={item.url}
            target="_blank"
            rel="noreferrer"
          >
            {item.repository}
          </a>

          {item.language && (
            <span className="recent-work-language">
              {item.language}
            </span>
          )}
        </div>

        <p className="recent-work-description">
          {item.description}
        </p>

        <div className="recent-work-meta">
          <span>
            {item.commitCount}{" "}
            {item.commitCount === 1
              ? "commit"
              : "commits"}
          </span>

          <span className="recent-work-separator">
            /
          </span>

          <time dateTime={item.timestamp}>
            {dateLabel} · {timeLabel}
          </time>
        </div>
      </div>

      <a
        className="recent-work-arrow"
        href={item.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${item.repository}`}
      >
        ↗
      </a>
    </article>
  );
}

export default RecentWorkItem;
