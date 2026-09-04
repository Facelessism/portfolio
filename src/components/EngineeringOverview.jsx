import StatsMetric from "./StatsMetric";
import StatsSectionHeader from "./StatsSectionHeader";

function formatDate(timestamp) {
  if (!timestamp) return "Unknown";

  return new Date(timestamp).toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function EngineeringOverview({ stats }) {
  const latest = stats.latestContribution;
  const activeWindow = stats.period.days || 0;
  const languages = stats.languageBreakdown.slice(0, 5);

  return (
    <section className="engineering-overview">
      <StatsSectionHeader
        number="01"
        title="Engineering Overview"
        description="A compact view of the projects, activity and technologies shaping the portfolio."
      />

      <div className="engineering-overview-shell">
        <div className="engineering-metrics">
          <StatsMetric
            value={stats.repositories.length}
            label="repositories"
            detail="public portfolio surface"
          />

          <StatsMetric
            value={stats.sourceRepositories.length}
            label="source repositories"
            detail="non-fork projects"
          />

          <StatsMetric
            value={stats.forkRepositories.length}
            label="forked repositories"
            detail="external codebases"
          />

          <StatsMetric
            value={stats.activeRepositories.length}
            label="active repositories"
            detail={`within ${activeWindow}-day window`}
          />
        </div>

        <div className="engineering-overview-detail">
          <div className="engineering-latest">
            <span className="engineering-detail-label">
              Latest contribution
            </span>

            {latest ? (
              <>
                <a
                  href={latest.url}
                  target="_blank"
                  rel="noreferrer"
                  className="engineering-latest-repository"
                >
                  {latest.repository}
                </a>

                <p className="engineering-latest-message">
                  {latest.details}
                </p>

                <time dateTime={latest.timestamp}>
                  {formatDate(latest.timestamp)}
                </time>
              </>
            ) : (
              <span className="engineering-latest-message">
                No recent contribution detected.
              </span>
            )}
          </div>

          <div className="engineering-recent">
            <span className="engineering-detail-label">
              Recent repositories
            </span>

            <div className="engineering-recent-list">
              {stats.recentRepositories.slice(0, 6).map((repository) => (
                <a
                  key={repository.repository}
                  href={repository.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {repository.repository}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="engineering-overview-detail">
          <div className="engineering-latest">
            <span className="engineering-detail-label">
              Most represented stack
            </span>

            <div className="engineering-recent-list">
              {languages.map((item) => (
                <span key={item.language}>
                  {item.language}
                </span>
              ))}
            </div>
          </div>

          <div className="engineering-recent">
            <span className="engineering-detail-label">
              Data status
            </span>

            <p className="engineering-latest-message">
              GitHub data generated from the build pipeline.
            </p>

            <time dateTime={stats.generatedAt}>
              Updated {formatDate(stats.generatedAt)}
            </time>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EngineeringOverview;
