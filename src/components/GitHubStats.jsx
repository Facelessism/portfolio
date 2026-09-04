import EngineeringOverview from "./EngineeringOverview";
import ContributionPulse from "./ContributionPulse";
import RepositoryEvolution from "./RepositoryEvolution";
import RepositoryConstellation from "./RepositoryConstellation";
import TechStackConstellation from "./TechStackConstellation";
import useGitHubStats from "../hooks/useGitHubStats";

function GitHubStats() {
  const stats = useGitHubStats();

  return (
    <section
      className="github-stats"
      aria-labelledby="github-stats-title"
    >
      <div
        id="github-stats-title"
        className="github-stats-anchor"
      />

      <EngineeringOverview stats={stats} />

      <ContributionPulse stats={stats} />

      <RepositoryEvolution
        evolution={stats.evolution}
        repositories={stats.repositories}
      />

      <RepositoryConstellation
        historyRepositories={
          stats.historyRepositories
        }
      />

      <TechStackConstellation
        technologyGraph={
          stats.technologyGraph
        }
      />
    </section>
  );
}

export default GitHubStats;
