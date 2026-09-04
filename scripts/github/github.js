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
          Accept:
            "application/vnd.github+json",
          "X-GitHub-Api-Version":
            "2022-11-28",
          ...(config.token
            ? {
                Authorization:
                  `Bearer ${config.token}`,
              }
            : {}),
          ...(options.headers || {}),
        },
      },
    );

    const contentType =
      response.headers.get(
        "content-type",
      ) || "";

    const body =
      contentType.includes("application/json")
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

    return body;
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

function sleep(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms),
  );
}

async function githubStatsRequest(
  path,
  attempt = 0,
) {
  try {
    return await githubRequest(path);
  } catch (error) {
    if (error.status === 204) {
      return [];
    }

    if (error.status === 422) {
      return [];
    }

    if (error.status !== 202) {
      throw error;
    }

    if (
      attempt >= config.statsRetryCount
    ) {
      throw error;
    }

    const delay =
      config.statsRetryDelay *
      Math.pow(2, attempt);

    await sleep(delay);

    return githubStatsRequest(
      path,
      attempt + 1,
    );
  }
}

export async function fetchProfile() {
  return githubRequest(
    `/users/${encodeURIComponent(
      config.username,
    )}`,
  );
}

export async function fetchRepositories() {
  const params = new URLSearchParams({
    per_page: String(
      config.repositoryLimit,
    ),
    sort: "pushed",
    direction: "desc",
  });

  return githubRequest(
    `/users/${encodeURIComponent(
      config.username,
    )}/repos?${params}`,
  );
}

export async function fetchEvents() {
  const params = new URLSearchParams({
    per_page: String(config.eventLimit),
  });

  return githubRequest(
    `/users/${encodeURIComponent(
      config.username,
    )}/events/public?${params}`,
  );
}

export async function fetchRepositoryCommits(
  repository,
  since,
) {
  const params = new URLSearchParams({
    per_page: String(config.commitLimit),
    since,
    author: config.username,
  });

  return githubRequest(
    `/repos/${repository}/commits?${params}`,
  );
}

export async function fetchRepositoryContributorStats(
  repository,
) {
  return githubStatsRequest(
    `/repos/${repository}/stats/contributors`,
  );
}
