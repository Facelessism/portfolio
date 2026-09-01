import Container from "./Container";
import RecentWorkItem from "./RecentWorkItem";
import SectionHeader from "./SectionHeader";

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
        <SectionHeader
          path="~/recent-work"
          title="What I've been building lately"
          description=""
          id="recent-work-title"
        />

        <div className="recent-work">
          <div className="recent-work-track">
            {loading && (
              <div className="recent-work-state">
                <span className="recent-work-loader" />
                <span>
                  Scanning recent work...
                </span>
              </div>
            )}

            {!loading && error && (
              <p className="recent-work-state recent-work-state-error">
                Unable to load recent work.
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
