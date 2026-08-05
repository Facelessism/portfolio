import useGitHubRepositories from "../hooks/useGitHubRepositories";
import { mapRepository } from "../services/repositoryMapper";

import RepositoryRow from "./RepositoryRow";

function GitHubRepositoryList() {
  const {
    repositories,
    loading,
    error,
  } = useGitHubRepositories();

  if (loading) {
    return (
      <p className="repository-list-status">
        Loading repositories...
      </p>
    );
  }

  if (error) {
    return (
      <p className="repository-list-status">
        Unable to load repositories.
      </p>
    );
  }

  return (
    <section className="github-repository-list">

      {repositories.map((repository) => (
        <RepositoryRow
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

    </section>
  );
}

export default GitHubRepositoryList;
