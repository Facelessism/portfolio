import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";
import Container from "../components/Container";

import GitHubOverview from "../components/GitHubOverview";
import GitHubRepositoryList from "../components/GitHubRepositoryList";

function GitHub() {
  return (
    <div className="github-page">
      <PageHeader
        eyebrow="GitHub"
        title="My Activity on GitHub"
        description={
          <>
            Every repository here represents a problem explored, a tool built or an idea experimented with.{" "}
            This page stays in sync with my GitHub and reflects my ongoing works.
          </>
        }
      />

      <Container>
        <GitHubOverview />

        <SectionHeader
          eyebrow="Repositories"
          title="Everything I've Built"
          description="Developer tools, backend systems, automation projects, experiments and open-source contributions."
        />

        <GitHubRepositoryList />
      </Container>
    </div>
  );
}

export default GitHub;
