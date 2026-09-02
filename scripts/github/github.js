import config from "./config.js";

async function githubRequest(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    config.requestTimeout,
  );

  try {
    const response = await fetch(
      `${config.apiUrl}${path}`,
      {
        ...options,
        signal: controller.signal,
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(config.token
            ? {
                Authorization: `Bearer ${config.token}`,
              }
            : {}),
          ...(options.headers || {}),
        },
      },
    );

    const contentType =
      response.headers.get("content-type") || "";

    const body = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        typeof body === "string"
          ? body
          : body?.message ||
            "GitHub API request failed";

      const error = new Error(
        `GitHub API ${response.status}: ${message}`,
      );

      error.status = response.status;
      error.rateLimitRemaining =
        response.headers.get(
          "x-ratelimit-remaining",
        );
      error.rateLimitReset =
        response.headers.get(
          "x-ratelimit-reset",
        );

      throw error;
    }

    return {
      data: body,
      rateLimitRemaining:
        response.headers.get(
          "x-ratelimit-remaining",
        ),
      rateLimitReset:
        response.headers.get(
          "x-ratelimit-reset",
        ),
      etag:
        response.headers.get("etag"),
      lastModified:
        response.headers.get(
          "last-modified",
        ),
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        `GitHub API request timed out after ${config.requestTimeout}ms`,
        {
          cause: error,
        },
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchProfile() {
  const response = await githubRequest(
    `/users/${encodeURIComponent(config.username)}`,
  );

  return response.data;
}

export async function fetchRepositories() {
  const params = new URLSearchParams({
    per_page: String(config.repositoryLimit),
    sort: "pushed",
    direction: "desc",
  });

  const response = await githubRequest(
    `/users/${encodeURIComponent(config.username)}/repos?${params}`,
  );

  return response.data;
}

export async function fetchEvents() {
  const params = new URLSearchParams({
    per_page: String(config.eventLimit),
  });

  const response = await githubRequest(
    `/users/${encodeURIComponent(config.username)}/events/public?${params}`,
  );

  return response.data;
}

export async function fetchRepositoryCommits(
  repository,
  since,
) {
  const params = new URLSearchParams({
    per_page: String(config.commitLimit),
    since,
  });

  const response = await githubRequest(
    `/repos/${repository}/commits?${params}`,
  );

  return response.data;
}

export async function searchPullRequests(since) {
  const query = [
    `author:${config.username}`,
    "is:pr",
    `created:>=${since.slice(0, 10)}`,
  ].join(" ");

  const params = new URLSearchParams({
    q: query,
    per_page: String(config.pullRequestLimit),
    sort: "updated",
    order: "desc",
  });

  const response = await githubRequest(
    `/search/issues?${params}`,
  );

  return response.data.items || [];
}
