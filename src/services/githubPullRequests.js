const BASE_URL = "https://api.github.com";
const USERNAME = "Facelessism";

const headers = {
  Accept: "application/vnd.github+json",
};

export async function fetchRecentPullRequests(
  days = 30
) {
  const since = new Date(
    Date.now() -
      days * 24 * 60 * 60 * 1000
  );

  const date =
    since.toISOString().slice(0, 10);

  const query =
    `author:${USERNAME}` +
    `+is:pr` +
    `+created:>=${date}`;

  const url =
    `${BASE_URL}/search/issues` +
    `?q=${encodeURIComponent(query)}` +
    `&sort=created` +
    `&order=desc` +
    `&per_page=100`;

  const response = await fetch(url, {
    headers,
  });

  if (!response.ok) {
    throw new Error(
      "Unable to fetch GitHub pull requests"
    );
  }

  const data =
    await response.json();

  return (data.items || [])
    .map(mapPullRequest)
    .filter(Boolean);
}

function mapPullRequest(
  pullRequest
) {
  const repository =
    pullRequest.repository_url
      ?.split("/")
      .pop();

  const repositoryFullName =
    pullRequest.repository_url
      ?.split("repos/")
      .pop();

  if (
    !pullRequest.id ||
    !repository ||
    !pullRequest.created_at
  ) {
    return null;
  }

  return {
    id: `pr-${pullRequest.id}`,

    type: "PR",

    repository,

    repositoryFullName:
      repositoryFullName || "",

    timestamp:
      pullRequest.created_at,

    details:
      pullRequest.title ||
      "Pull request",

    url:
      pullRequest.html_url ||
      `https://github.com/${repositoryFullName}/pulls`,
  };
}
