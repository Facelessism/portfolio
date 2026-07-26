import PageHeader from "../components/PageHeader";
import GitHubOverview from "../components/GitHubOverview";
import GitHubRepositoryGrid from "../components/GitHubRepositoryGrid";

function GitHub() {
  return (
    <main className="github-page">
      <PageHeader
        eyebrow="GitHub"
        title="Engineering activity on GitHub."
        description="A live view of my repositories, experiments and engineering work across different technologies and domains."
      />

      <GitHubOverview />

      <GitHubRepositoryGrid />
    </main>
  );
}

export default GitHub;
