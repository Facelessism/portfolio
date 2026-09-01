import config from "./config.js";

const baseHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

function getHeaders() {
  return {
    ...baseHeaders,
    ...(config.token
      ? {
          Authorization: `Bearer ${config.token}`,
        }
      : {}),
  };
}

export async function githubRequest(
  path,
  options = {}
) {
  const controller =
    new AbortController();

  const timeout = setTimeout(
    () =>
      controller.abort(),
    config.requestTimeout
  );

  const url =
    `${config.apiUrl}${path}`;

  try {
    const response =
      await fetch(url, {
        ...options,

        headers: {
          ...getHeaders(),
          ...(options.headers || {}),
        },

        signal:
          controller.signal,
      });

    const remaining =
      response.headers.get(
        "x-ratelimit-remaining"
      );

    const reset =
      response.headers.get(
        "x-ratelimit-reset"
      );

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    const body =
      contentType.includes(
        "application/json"
      )
        ? await response.json().catch(
            () => null
          )
        : await response.text().catch(
            () => ""
          );

    if (!response.ok) {
      const error =
        new Error(
          body?.message ||
            `GitHub request failed: ${response.status}`
        );

      error.status =
        response.status;

      error.url = url;

      error.rateLimitRemaining =
        remaining;

      error.rateLimitReset =
        reset;

      error.documentationUrl =
        body?.documentation_url ||
        null;

      error.errors =
        body?.errors || null;

      console.error(
        `GitHub request failed: ${response.status} ${url}`
      );

      if (body?.message) {
        console.error(
          `GitHub: ${body.message}`
        );
      }

      if (body?.errors) {
        console.error(
          "GitHub validation errors:",
          JSON.stringify(
            body.errors,
            null,
            2
          )
        );
      }

      throw error;
    }

    return {
      data: body,

      rateLimitRemaining:
        remaining,

      rateLimitReset:
        reset,

      etag:
        response.headers.get(
          "etag"
        ),

      lastModified:
        response.headers.get(
          "last-modified"
        ),
    };
  } catch (error) {
    if (
      error.name ===
      "AbortError"
    ) {
      const timeoutError =
        new Error(
          `GitHub request timed out: ${url}`,
          {
            cause: error,
          }
        );

      timeoutError.url =
        url;

      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchProfile() {
  return githubRequest(
    `/users/${encodeURIComponent(
      config.username
    )}`
  );
}

export async function fetchRepositories() {
  const params =
    new URLSearchParams({
      per_page: String(
        config.repositoryLimit
      ),
      sort: "pushed",
      direction: "desc",
    });

  return githubRequest(
    `/users/${encodeURIComponent(
      config.username
    )}/repos?${params}`
  );
}

export async function fetchEvents() {
  const params =
    new URLSearchParams({
      per_page: String(
        config.eventLimit || 100
      ),
    });

  return githubRequest(
    `/users/${encodeURIComponent(
      config.username
    )}/events/public?${params}`
  );
}

export async function fetchRepositoryCommits(
  repository,
  since
) {
  const params =
    new URLSearchParams({
      author:
        config.username,
      since,
      per_page: String(
        config.commitLimit || 100
      ),
    });

  return githubRequest(
    `/repos/${repository}/commits?${params}`
  );
}

export async function searchPullRequests(
  since
) {
  const date =
    new Date(since)
      .toISOString()
      .slice(0, 10);

  const query = [
    `author:${config.username}`,
    "is:pr",
    `created:>=${date}`,
  ].join(" ");

  const params =
    new URLSearchParams({
      q: query,
      sort: "created",
      order: "desc",
      per_page: String(
        config.pullRequestLimit || 100
      ),
    });

  return githubRequest(
    `/search/issues?${params}`
  );
}

export async function searchCommits(
  since
) {
  const date =
    new Date(since)
      .toISOString()
      .slice(0, 10);

  const query = [
    `author:${config.username}`,
    `committer-date:>=${date}`,
  ].join(" ");

  const params =
    new URLSearchParams({
      q: query,
      sort: "committer-date",
      order: "desc",
      per_page: String(
        config.commitLimit || 100
      ),
    });

  return githubRequest(
    `/search/commits?${params}`,
    {
      headers: {
        Accept:
          "application/vnd.github+json",
      },
    }
  );
}
