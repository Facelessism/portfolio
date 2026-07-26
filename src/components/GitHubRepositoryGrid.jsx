import useGitHubRepositories from "../hooks/useGitHubRepositories";
import RepositoryCard from "./RepositoryCard";
import { mapRepository } from "../services/repositoryMapper";

function GitHubRepositoryGrid() {
  const {
    repositories,
    loading,
    error,
  } = useGitHubRepositories();


  if (loading) {
    return (
      <p className="deck-status">
        Loading repositories...
      </p>
    );
  }


  if (error) {
    return (
      <p className="deck-status">
        Unable to load repositories.
      </p>
    );
  }


  return (
    <div className="repository-grid">
      {repositories.map((repository) => (
        <RepositoryCard
          key={repository.id}
          repository={mapRepository(
            repository,
            {
              featured: false,
              homepage: false,
              order: 0,
              live: "",
            }
          )}
        />
      ))}
    </div>
  );
}

export default GitHubRepositoryGrid;
