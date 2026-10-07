import { afterEach, describe, expect, it, vi } from "vitest";

const mockConfig = vi.hoisted(() => ({
  username: "Facelessism",
  token: "test-token",
  apiUrl: "https://api.github.test",
  requestTimeout: 1000,
  repositoryLimit: 100,
  eventLimit: 100,
  commitLimit: 100,
  statsRetryCount: 1,
  statsRetryDelay: 0,
}));

vi.mock("../../scripts/github/config.js", () => ({
  default: mockConfig,
}));

import {
  fetchEvents,
  fetchProfile,
  fetchRepositories,
  fetchRepositoryCommits,
  fetchRepositoryContributorStats,
} from "../../scripts/github/github.js";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("GitHub API client", () => {
  it("retries a 202 contributor-stat response", async () => {
    let calls = 0;

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        calls += 1;

        if (calls === 1) {
          return new Response(null, {
            status: 202,
          });
        }

        return new Response("[]", {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        });
      }),
    );

    await expect(
      fetchRepositoryContributorStats("Facelessism/portfolio"),
    ).resolves.toEqual([]);

    expect(calls).toBe(2);
  });

  it("stops retrying after the configured 202 retry count", async () => {
    let calls = 0;

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        calls += 1;

        return new Response(null, {
          status: 202,
        });
      }),
    );

    await expect(
      fetchRepositoryContributorStats("Facelessism/portfolio"),
    ).rejects.toMatchObject({
      status: 202,
    });

    expect(calls).toBe(2);
  });

  it("does not retry non-202 errors", async () => {
    let calls = 0;

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        calls += 1;

        return new Response(
          JSON.stringify({
            message: "Forbidden",
          }),
          {
            status: 403,
            headers: {
              "content-type": "application/json",
            },
          },
        );
      }),
    );

    await expect(
      fetchRepositoryContributorStats("Facelessism/portfolio"),
    ).rejects.toMatchObject({
      status: 403,
    });

    expect(calls).toBe(1);
  });

  it("returns JSON from successful requests", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              login: "Facelessism",
            }),
            {
              status: 200,
              headers: {
                "content-type": "application/json",
              },
            },
          ),
      ),
    );

    await expect(fetchProfile()).resolves.toEqual({
      login: "Facelessism",
    });
  });

  it("uses the configured API paths", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response("[]", {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await fetchRepositories();

    await fetchEvents();

    await fetchRepositoryCommits(
      "Facelessism/portfolio",
      "2026-10-01T00:00:00.000Z",
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("/users/Facelessism/repos?"),
      expect.any(Object),
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("/users/Facelessism/events/public?"),
      expect.any(Object),
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining("/repos/Facelessism/portfolio/commits?"),
      expect.any(Object),
    );
  });
});
