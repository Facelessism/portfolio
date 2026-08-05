import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";

import GitHubOverview from "../components/GitHubOverview";
import GitHubRepositoryList from "../components/GitHubRepositoryList";

function GitHub() {
  return (
    <main className="github-page">

      <PageHeader
        eyebrow="GitHub"
        title="My Activity on GitHub"
        description="Every repository represents a problem explored, a tool built, or an idea experimented with. This page stays in sync with GitHub and reflects my ongoing work."
      />

      <GitHubOverview />

      <SectionHeader
        eyebrow="Repositories"
        title="Everything I've Built"
        description="Developer tools, backend systems, automation projects, experiments, and open-source contributions."
      />

      <GitHubRepositoryList />

    </main>
  );
}

export default GitHub;
