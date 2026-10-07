import { describe, expect, it } from "vitest";

import {
  normalizeActivities,
  normalizeCommits,
  normalizeProfile,
  normalizePullRequests,
  normalizeRepositories,
} from "../../scripts/github/normalize.js";

describe("GitHub normalization", () => {
  it("normalizes profile fields to the portfolio schema", () => {
    expect(
      normalizeProfile({
        login: "Facelessism",
        name: "Bighna",
        avatar_url: "https://example.com/avatar.png",
        bio: "Builder",
        company: "Example",
        location: "India",
        public_repos: 12,
        followers: 7,
        following: 4,
        public_gists: 2,
        html_url: "https://github.com/Facelessism",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      }),
    ).toEqual({
      login: "Facelessism",
      name: "Bighna",
      avatarUrl: "https://example.com/avatar.png",
      bio: "Builder",
      company: "Example",
      location: "India",
      repositories: 12,
      followers: 7,
      following: 4,
      gists: 2,
      profileUrl: "https://github.com/Facelessism",
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    });
  });

  it("normalizes repositories and preserves an empty topic list", () => {
    const [repository] = normalizeRepositories([
      {
        id: 1,
        name: "portfolio",
        full_name: "Facelessism/portfolio",
        description: null,
        private: false,
        fork: false,
        stargazers_count: 3,
        forks_count: 2,
        watchers_count: 4,
        open_issues_count: 1,
        language: "JavaScript",
        topics: undefined,
        default_branch: "main",
        html_url: "https://github.com/Facelessism/portfolio",
        homepage: "https://example.com",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-02T00:00:00Z",
        pushed_at: "2026-01-03T00:00:00Z",
      },
    ]);

    expect(repository).toEqual({
      id: 1,
      name: "portfolio",
      fullName: "Facelessism/portfolio",
      description: null,
      private: false,
      fork: false,
      stars: 3,
      forks: 2,
      watchers: 4,
      openIssues: 1,
      language: "JavaScript",
      topics: [],
      defaultBranch: "main",
      repositoryUrl: "https://github.com/Facelessism/portfolio",
      homepage: "https://example.com",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
      pushedAt: "2026-01-03T00:00:00Z",
    });
  });

  it("normalizes commits with a stable repository-scoped id", () => {
    expect(
      normalizeCommits(
        [
          {
            sha: "abc123",
            commit: {
              author: {
                date: "2026-01-03T10:00:00Z",
                name: "Bighna",
              },
              message: "Fix bug\n\nDetails",
            },
            author: {
              login: "Facelessism",
            },
            html_url: "https://github.com/example/commit/abc123",
          },
        ],
        "Facelessism/portfolio",
      ),
    ).toEqual([
      {
        id: "commit:Facelessism/portfolio:abc123",
        type: "commit",
        repository: "portfolio",
        repositoryFullName: "Facelessism/portfolio",
        sha: "abc123",
        timestamp: "2026-01-03T10:00:00Z",
        details: "Fix bug",
        author: "Facelessism",
        url: "https://github.com/example/commit/abc123",
      },
    ]);
  });

  it("falls back to the commit author's name when the GitHub user is absent", () => {
    const [commit] = normalizeCommits(
      [
        {
          sha: "abc123",
          commit: {
            author: {
              date: "2026-01-03T10:00:00Z",
              name: "Bighna",
            },
            message: "Initial commit",
          },
        },
      ],
      "Facelessism/tool",
    );

    expect(commit.author).toBe("Bighna");

    expect(commit.url).toBe(
      "https://github.com/Facelessism/tool/commit/abc123",
    );
  });

  it("normalizes pull requests and detects merged state", () => {
    expect(
      normalizePullRequests([
        {
          id: 42,
          repository_url: "https://api.github.com/repos/Facelessism/tool",
          updated_at: "2026-01-03T10:00:00Z",
          created_at: "2026-01-02T10:00:00Z",
          title: "Improve parser",
          state: "closed",
          merged_at: "2026-01-03T09:00:00Z",
          html_url: "https://github.com/Facelessism/tool/pull/42",
        },
      ]),
    ).toEqual([
      {
        id: "pull-request:42",
        type: "pull_request",
        repository: "tool",
        repositoryFullName: "Facelessism/tool",
        timestamp: "2026-01-03T10:00:00Z",
        details: "Improve parser",
        state: "merged",
        merged: true,
        url: "https://github.com/Facelessism/tool/pull/42",
      },
    ]);
  });

  it("normalizes activity event types and fallback details", () => {
    expect(
      normalizeActivities([
        {
          id: "1",
          type: "PushEvent",
          repo: {
            name: "Facelessism/tool",
          },
          payload: {
            commits: [{}, {}],
          },
          created_at: "2026-01-03T10:00:00Z",
        },
        {
          id: "2",
          type: "ReleaseEvent",
          repo: {
            name: "Facelessism/tool",
          },
          payload: {
            release: {},
          },
          created_at: "2026-01-03T11:00:00Z",
        },
        {
          id: "3",
          type: "UnknownEvent",
          repo: null,
          payload: {},
          created_at: "2026-01-03T12:00:00Z",
        },
      ]),
    ).toEqual([
      {
        id: "activity:1",
        type: "push",
        repository: "tool",
        repositoryFullName: "Facelessism/tool",
        timestamp: "2026-01-03T10:00:00Z",
        details: "2 commits pushed",
        url: "https://github.com/Facelessism/tool",
      },
      {
        id: "activity:2",
        type: "release",
        repository: "tool",
        repositoryFullName: "Facelessism/tool",
        timestamp: "2026-01-03T11:00:00Z",
        details: "Release activity",
        url: "https://github.com/Facelessism/tool",
      },
      {
        id: "activity:3",
        type: "activity",
        repository: null,
        repositoryFullName: null,
        timestamp: "2026-01-03T12:00:00Z",
        details: "",
        url: null,
      },
    ]);
  });
});
