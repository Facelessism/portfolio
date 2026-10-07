import Container from "./Container";
import ActivityEvent from "./ActivityEvent";
import SectionHeader from "./SectionHeader";

import useGitHubActivity from "../hooks/useGitHubActivity";

function ActivityTerminal() {
  const { activity, loading, error } = useGitHubActivity();

  const activityCounts = activity.reduce(
    (counts, event) => {
      if (event.type === "COMMIT") {
        counts.commits += 1;
      }

      if (event.type === "PR") {
        counts.pullRequests += 1;
      }

      return counts;
    },
    {
      commits: 0,
      pullRequests: 0,
    },
  );

  return (
    <section className="activity-section" aria-labelledby="activity-title">
      <Container>
        <SectionHeader
          path="~/activity"
          title="My recent activities"
          description=""
          id="activity-title"
        />

        <div className="activity-terminal">
          <div className="activity-scanline" aria-hidden="true" />

          <header className="activity-header">
            <div className="activity-heading">
              <span className="activity-path">github contribution stream</span>
            </div>

            <div className="activity-status">
              <span className="activity-status-signal" aria-hidden="true" />

              <span>MONITORING</span>
            </div>
          </header>

          <div className="activity-toolbar">
            <span>LAST 30 DAYS</span>

            <span className="activity-toolbar-separator">/</span>

            <span>{activityCounts.commits} COMMITS</span>

            <span className="activity-toolbar-separator">/</span>

            <span>{activityCounts.pullRequests} PRs</span>

            <span className="activity-toolbar-live">AUTO SYNC</span>
          </div>

          <div className="activity-body" aria-live="polite">
            {loading && (
              <div className="activity-state">
                <span className="activity-state-mark">//</span>

                <span>Synchronizing contribution stream...</span>
              </div>
            )}

            {!loading && error && (
              <div className="activity-state activity-state-error">
                <span className="activity-state-mark">!!</span>

                <span>Unable to synchronize activity.</span>
              </div>
            )}

            {!loading && !error && activity.length === 0 && (
              <div className="activity-state">
                <span className="activity-state-mark">--</span>

                <span>No recent activity available.</span>
              </div>
            )}

            {!loading && !error && activity.length > 0 && (
              <div className="activity-feed">
                {activity.map((event) => (
                  <ActivityEvent key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>

          <footer className="activity-footer">
            <span className="activity-footer-path">github.com/Facelessism</span>

            <span>{activity.length} records</span>
          </footer>
        </div>
      </Container>
    </section>
  );
}

export default ActivityTerminal;
