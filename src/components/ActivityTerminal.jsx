import Container from "./Container";
import ActivityEvent from "./ActivityEvent";

import useGitHubActivity from "../hooks/useGitHubActivity";

function ActivityTerminal() {
  const {
    activity,
    loading,
    error,
  } = useGitHubActivity();

  const commitCount = activity.filter(
    (event) => event.type === "COMMIT"
  ).length;

  const pullRequestCount = activity.filter(
    (event) => event.type === "PR"
  ).length;

  return (
    <section
      className="activity-section"
      aria-label="Recent GitHub activity"
    >
      <Container>
        <div className="activity-terminal">
          <div
            className="activity-scanline"
            aria-hidden="true"
          />

          <header className="activity-header">
            <div className="activity-heading">
              <span className="activity-path">
                ~/activity
              </span>

              <span className="activity-subtitle">
                github contribution stream
              </span>
            </div>

            <div className="activity-status">
              <span
                className="activity-status-signal"
                aria-hidden="true"
              />

              <span>MONITORING</span>
            </div>
          </header>

          <div className="activity-toolbar">
            <span>
              LAST 30 DAYS
            </span>

            <span className="activity-toolbar-separator">
              /
            </span>

            <span>
              {commitCount} COMMITS
            </span>

            <span className="activity-toolbar-separator">
              /
            </span>

            <span>
              {pullRequestCount} PRs
            </span>

            <span className="activity-toolbar-live">
              AUTO SYNC
            </span>
          </div>

          <div
            className="activity-body"
            aria-live="polite"
          >
            {loading && (
              <div className="activity-state">
                <span className="activity-state-mark">
                  //
                </span>

                <span>
                  Synchronizing contribution stream...
                </span>
              </div>
            )}

            {!loading && error && (
              <div className="activity-state activity-state-error">
                <span className="activity-state-mark">
                  !!
                </span>

                <span>
                  Unable to synchronize activity.
                </span>
              </div>
            )}

            {!loading &&
              !error &&
              activity.length === 0 && (
                <div className="activity-state">
                  <span className="activity-state-mark">
                    --
                  </span>

                  <span>
                    No recent activity available.
                  </span>
                </div>
              )}

            {!loading &&
              !error &&
              activity.length > 0 && (
                <div className="activity-feed">
                  {activity.map((event) => (
                    <ActivityEvent
                      key={event.id}
                      event={event}
                    />
                  ))}
                </div>
              )}
          </div>

          <footer className="activity-footer">
            <span className="activity-footer-path">
              github.com/Facelessism
            </span>

            <span>
              {activity.length} records
            </span>
          </footer>
        </div>
      </Container>
    </section>
  );
}

export default ActivityTerminal;
