import { describe, expect, it } from "vitest";

import { getGitHubStats } from "../../src/services/githubStats.js";

describe("GitHub statistics service", () => {
  it("returns the complete statistics contract", () => {
    const stats = getGitHubStats();

    expect(stats).toEqual(
      expect.objectContaining({
        generatedAt: expect.any(String),

        historyGeneratedAt: expect.any(String),

        period: expect.objectContaining({
          since: expect.any(String),

          until: expect.any(String),

          days: expect.any(Number),
        }),

        repositories: expect.any(Array),

        sourceRepositories: expect.any(Array),

        forkRepositories: expect.any(Array),

        activeRepositories: expect.any(Array),

        historyRepositories: expect.any(Array),

        languageBreakdown: expect.any(Array),

        contributionPulse: expect.objectContaining({
          days: expect.any(Array),

          repositories: expect.any(Array),
        }),

        evolution: expect.any(Array),

        technologyGraph: expect.objectContaining({
          nodes: expect.any(Array),

          edges: expect.any(Array),
        }),
      }),
    );
  });

  it("keeps fork and source repository sets disjoint", () => {
    const stats = getGitHubStats();

    const sourceIds = new Set(
      stats.sourceRepositories.map((repository) => repository.fullName),
    );

    for (const repository of stats.forkRepositories) {
      expect(sourceIds.has(repository.fullName)).toBe(false);
    }
  });

  it("sorts language breakdown by count and then name", () => {
    const { languageBreakdown } = getGitHubStats();

    for (let index = 1; index < languageBreakdown.length; index += 1) {
      const previous = languageBreakdown[index - 1];

      const current = languageBreakdown[index];

      expect(
        previous.count > current.count ||
          (previous.count === current.count &&
            previous.language.localeCompare(current.language) <= 0),
      ).toBe(true);
    }
  });
});
