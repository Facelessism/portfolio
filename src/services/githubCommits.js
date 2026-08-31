const BASE_URL = "https://api.github.com";
const USERNAME = "Facelessism";

const headers = {
  Accept: "application/vnd.github+json",
};

const MAX_REPOSITORIES = 20;
const MAX_COMMITS_PER_REPOSITORY = 100;

export async function fetchRecentCommits(days = 30) {
  const since = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  ).toISOString();

  const repositories =
    await fetchRepositories();

  const activeRepositories =
    repositories
      .filter(
        (repository) =>
          repository.pushed_at &&
          new Date(repository.pushed_at) >=
            new Date(since)
      )
      .slice(0, MAX_REPOSITORIES);

  const results = await Promise.allSettled(
    activeRepositories.map((repository) =>
      fetchRepositoryCommits(
        repository,
        since
      )
    )
  );

  return results
    .filter(
      (result) =>
        result.status === "fulfilled"
    )
    .flatMap(
      (result) => result.value
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp) -
        new Date(a.timestamp)
    );
}

async function fetchRepositories() {
  const response = await fetch(
    `${BASE_URL}/users/${USERNAME}/repos?per_page=100&sort=pushed`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to fetch GitHub repositories"
    );
  }

  return response.json();
}

async function fetchRepositoryCommits(
  repository,
  since
) {
  const url =
    `${BASE_URL}/repos/${repository.full_name}/commits` +
    `?author=${encodeURIComponent(USERNAME)}` +
    `&since=${encodeURIComponent(since)}` +
    `&per_page=${MAX_COMMITS_PER_REPOSITORY}`;

  const response = await fetch(url, {
    headers,
  });

  if (!response.ok) {
    return [];
  }

  const commits =
    await response.json();

  return commits
    .filter(
      (commit) =>
        commit.sha &&
        (
          commit.commit?.author?.date ||
          commit.commit?.committer?.date
        )
    )
    .map((commit) => ({
      id: `commit-${commit.sha}`,
      type: "COMMIT",

      repository:
        repository.name,

      repositoryFullName:
        repository.full_name,

      repositoryUrl:
        repository.html_url,

      description:
        repository.description || "",

      language:
        repository.language || "",

      timestamp:
        commit.commit?.author?.date ||
        commit.commit?.committer?.date,

      details:
        commit.commit?.message
          ?.split("\n")[0] ||
        "Commit",

      url:
        commit.html_url ||
        `${repository.html_url}/commit/${commit.sha}`,

      sha: commit.sha,

      author:
        commit.author?.login ||
        USERNAME,
    }));
}
