function GitHubOverview() {
  return (
    <section className="github-overview">
      <div className="github-overview-grid">

        <article className="github-overview-card">
          <p className="overview-label">
            Engineering Focus
          </p>

          <h3 className="overview-value">
            Developer Tools
          </h3>

          <p className="overview-description">
            Building utilities, automation workflows,
            and software that improves developer
            productivity.
          </p>
        </article>


        <article className="github-overview-card">
          <p className="overview-label">
            Primary Stack
          </p>

          <h3 className="overview-value">
            JavaScript · Python
          </h3>

          <p className="overview-description">
            Working across frontend systems,
            backend services, scripting and
            automation.
          </p>
        </article>


        <article className="github-overview-card">
          <p className="overview-label">
            Engineering Approach
          </p>

          <h3 className="overview-value">
            Systems Thinking
          </h3>

          <p className="overview-description">
            Focused on maintainable architecture,
            reusable systems and practical tooling.
          </p>
        </article>


        <article className="github-overview-card">
          <p className="overview-label">
            Current Activity
          </p>

          <h3 className="overview-value">
            Building & Experimenting
          </h3>

          <p className="overview-description">
            Exploring ideas through projects,
            experiments and open source work.
          </p>
        </article>

      </div>
    </section>
  );
}

export default GitHubOverview;
