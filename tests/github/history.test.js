import { describe, expect, it, vi } from "vitest";

const mockConfig = vi.hoisted(() => ({
  username: "Facelessism",
  historyWeeks: 1,
  historyRepositories: 2,
  historyConcurrency: 2,
}));

const mockGitHub = vi.hoisted(() => ({
  fetchRepositoryCommits: vi.fn(),
  fetchRepositoryContributorStats: vi.fn(),
}));

vi.mock("../../scripts/github/config.js", () => ({
  default: mockConfig,
}));

vi.mock("../../scripts/github/github.js", () => mockGitHub);

import { generateHistory } from "../../scripts/github/history.js";

describe("GitHub history generation", () => {
  it("selects recent repositories and aggregates contributor weeks with daily commits", async () => {
    const nowSeconds = Math.floor(Date.now() / 1000);

    const weekTimestamp = nowSeconds - 24 * 60 * 60;

    const weekDate = new Date(weekTimestamp * 1000).toISOString();

    mockGitHub.fetchRepositoryContributorStats.mockResolvedValue([
      {
        author: {
          login: "facelessism",
        },
        weeks: [
          {
            w: weekTimestamp,
            c: 3,
            a: 10,
            d: 4,
          },
        ],
      },
    ]);

    mockGitHub.fetchRepositoryCommits.mockResolvedValue([
      {
        commit: {
          author: {
            date: weekDate,
          },
        },
      },
      {
        commit: {
          author: {
            date: weekDate,
          },
        },
      },
    ]);

    const histories = await generateHistory([
      {
        id: 1,
        name: "old",
        fullName: "Facelessism/old",
        pushedAt: "2026-01-01T00:00:00Z",
        fork: false,
        language: "JavaScript",
        topics: [],
        repositoryUrl: "https://github.com/Facelessism/old",
      },
      {
        id: 2,
        name: "new",
        fullName: "Facelessism/new",
        pushedAt: new Date(Date.now() - 1000).toISOString(),
        fork: false,
        language: "JavaScript",
        topics: [],
        repositoryUrl: "https://github.com/Facelessism/new",
      },
      {
        id: 3,
        name: "newest",
        fullName: "Facelessism/newest",
        pushedAt: new Date().toISOString(),
        fork: false,
        language: "TypeScript",
        topics: ["tooling"],
        repositoryUrl: "https://github.com/Facelessism/newest",
      },
    ]);

    expect(histories.repositories).toHaveLength(2);

    expect(histories.repositories.map((repository) => repository.name)).toEqual(
      ["newest", "new"],
    );

    const first = histories.repositories[0];

    expect(first.historyStatus).toBe("ok");

    expect(first.contributorFound).toBe(true);

    expect(first.totalCommits).toBe(3);
    expect(first.totalAdditions).toBe(10);
    expect(first.totalDeletions).toBe(4);
    expect(first.totalChurn).toBe(14);

    expect(first.weeks[0]).toEqual(
      expect.objectContaining({
        week: weekDate,
        commits: 3,
        additions: 10,
        deletions: 4,
        churn: 14,
        netChange: 6,
      }),
    );

    expect(first.weeks[0].days.reduce((sum, value) => sum + value, 0)).toBe(2);
  });

  it("marks a repository as no-contribution when the configured user is absent", async () => {
    mockGitHub.fetchRepositoryContributorStats.mockResolvedValue([
      {
        author: {
          login: "someone-else",
        },
        weeks: [],
      },
    ]);

    mockGitHub.fetchRepositoryCommits.mockResolvedValue([]);

    const [repository] = (
      await generateHistory([
        {
          id: 1,
          name: "tool",
          fullName: "Facelessism/tool",
          pushedAt: new Date().toISOString(),
          fork: false,
          language: "JavaScript",
          topics: [],
          repositoryUrl: "https://github.com/Facelessism/tool",
        },
      ])
    ).repositories;

    expect(repository.historyStatus).toBe("no-contribution");

    expect(repository.contributorFound).toBe(false);

    expect(repository.weeks).toEqual([]);
  });
});
