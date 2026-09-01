import useGitHubRepositories from "../hooks/useGitHubRepositories";

import RepositoryRow from "./RepositoryRow";

function GitHubRepositoryList() {
  const { repositories, loading, error } =
    useGitHubRepositories();

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

  if (repositories.length === 0) {
    return (
      <p className="repository-list-status">
        No repositories available.
      </p>
    );
  }

  return (
    <section className="github-repository-list">
      {repositories.map((repository) => (
        <RepositoryRow
          key={repository.id}
          repository={repository}
        />
      ))}
    </section>
  );
}

export default GitHubRepositoryList;
