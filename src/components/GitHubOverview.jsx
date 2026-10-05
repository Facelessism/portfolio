const overviewItems = [
  {
    label: "Engineering Focus",
    value: "Developer Tools",
    description:
      "Building utilities, automation workflows, and software that improves developer productivity.",
  },
  {
    label: "Primary Stack",
    value: "JavaScript · Python",
    description:
      "Working across frontend systems, backend services, scripting and automation.",
  },
  {
    label: "Engineering Approach",
    value: "Systems Thinking",
    description:
      "Focused on maintainable architecture, reusable systems and practical tooling.",
  },
  {
    label: "Current Activity",
    value: "Building & Experimenting",
    description:
      "Exploring ideas through projects, experiments and open source work.",
  },
];

function GitHubOverview() {
  return (
    <section className="github-overview">
      <div className="github-overview-grid">
        {overviewItems.map((item) => (
          <article
            className="github-overview-card"
            key={item.label}
          >
            <p className="overview-label">
              {item.label}
            </p>

            <h3 className="overview-value">
              {item.value}
            </h3>

            <p className="overview-description">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default GitHubOverview;
