import Container from "./Container";
import RecentWorkItem from "./RecentWorkItem";
import useRecentWork from "../hooks/useRecentWork";

function RecentWork() {
  const {
    work,
    loading,
    error,
  } = useRecentWork();

  return (
    <section
      className="recent-work-section"
      aria-labelledby="recent-work-title"
    >
      <Container>
        <div className="recent-work">
          <header className="recent-work-header">
            <div>
              <p className="recent-work-kicker">
                Recent work
              </p>

              <h2
                id="recent-work-title"
                className="recent-work-title"
              >
                What I've been building lately.
              </h2>
            </div>

            <span className="recent-work-signal">
              <span
                className="recent-work-signal-dot"
                aria-hidden="true"
              />
              LIVE!!!
            </span>
          </header>

          <div className="recent-work-track">
            {loading && (
              <div className="recent-work-state">
                <span className="recent-work-loader" />
                <span>Scanning recent works...</span>
              </div>
            )}

            {!loading && error && (
              <p className="recent-work-state recent-work-state-error">
                Unable to load recent works.
              </p>
            )}

            {!loading &&
              !error &&
              work.length === 0 && (
                <p className="recent-work-state">
                  No recent work detected.
                </p>
              )}

            {!loading &&
              !error &&
              work.length > 0 && (
                <div className="recent-work-list">
                  {work.map((item, index) => (
                    <RecentWorkItem
                      key={item.id}
                      item={item}
                      index={index}
                    />
                  ))}
                </div>
              )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default RecentWork;
