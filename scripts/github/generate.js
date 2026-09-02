import fs from "node:fs/promises";
import path from "node:path";

import config from "./config.js";
import {
  fetchEvents,
  fetchProfile,
  fetchRepositories,
  fetchRepositoryCommits,
} from "./github.js";

import {
  normalizeActivities,
  normalizeCommits,
  normalizeProfile,
  normalizeRepositories,
} from "./normalize.js";

function isWithinPeriod(timestamp, sinceDate) {
  if (!timestamp) {
    return false;
  }

  return new Date(timestamp) >= sinceDate;
}

function getActiveRepositories(repositories) {
  return repositories
    .filter((repository) => repository.pushedAt)
    .sort(
      (a, b) =>
        new Date(b.pushedAt) -
        new Date(a.pushedAt),
    )
    .slice(0, config.commitRepositories);
}

function buildRecentWork(
  repositories,
  commitsByRepository,
) {
  return repositories
    .map((repository) => {
      const commits =
        commitsByRepository.get(repository.fullName) || [];

      return commits[0] || null;
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(b.timestamp || 0) -
        new Date(a.timestamp || 0),
    )
    .slice(0, config.recentWorkLimit);
}

async function generate() {
  const startedAt = Date.now();
  const sinceDate = new Date(
    Date.now() -
      config.days * 24 * 60 * 60 * 1000,
  );

  const since = sinceDate.toISOString();
  const outputPath = path.resolve(config.output);
  const outputDirectory = path.dirname(outputPath);

  console.log(
    `Generating GitHub data for ${config.username}...`,
  );

  const [
    profile,
    repositories,
    events,
  ] = await Promise.all([
    fetchProfile(),
    fetchRepositories(),
    fetchEvents(),
  ]);

  const normalizedProfile =
    normalizeProfile(profile);

  const normalizedRepositories =
    normalizeRepositories(repositories);

  const normalizedActivities =
    normalizeActivities(events)
      .filter((event) =>
        isWithinPeriod(
          event.timestamp,
          sinceDate,
        ),
      )
      .sort(
        (a, b) =>
          new Date(b.timestamp) -
          new Date(a.timestamp),
      )
      .slice(0, config.activityLimit);

  const activeRepositories =
    getActiveRepositories(
      normalizedRepositories,
    );

  const commitResults = await Promise.allSettled(
    activeRepositories.map(
      (repository) =>
        fetchRepositoryCommits(
          repository.fullName,
          since,
        ).then((commits) => ({
          repository: repository.fullName,
          commits: normalizeCommits(
            commits,
            repository.fullName,
          ),
        })),
    ),
  );

  const commitsByRepository = new Map();

  for (const result of commitResults) {
    if (result.status !== "fulfilled") {
      console.warn(
        "Failed to fetch repository commits:",
        result.reason?.message ||
          result.reason,
      );

      continue;
    }

    const { repository, commits } =
      result.value;

    commitsByRepository.set(
      repository,
      commits
        .filter((commit) =>
          isWithinPeriod(
            commit.timestamp,
            sinceDate,
          ),
        )
        .sort(
          (a, b) =>
            new Date(b.timestamp) -
            new Date(a.timestamp),
        ),
    );
  }

  const recentWork = buildRecentWork(
    activeRepositories,
    commitsByRepository,
  );

  const output = {
    generatedAt: new Date().toISOString(),

    period: {
      days: config.days,
      since,
    },

    profile: normalizedProfile,

    repositories:
      normalizedRepositories,

    activity:
      normalizedActivities,

    recentWork,
  };

  await fs.mkdir(outputDirectory, {
    recursive: true,
  });

  const temporaryPath =
    `${outputPath}.tmp`;

  await fs.writeFile(
    temporaryPath,
    `${JSON.stringify(output, null, 2)}\n`,
    "utf8",
  );

  await fs.rename(
    temporaryPath,
    outputPath,
  );

  console.log(
    `GitHub data generated in ${
      Date.now() - startedAt
    }ms`,
  );

  console.log(
    `Repositories: ${output.repositories.length}`,
  );

  console.log(
    `Activity: ${output.activity.length}`,
  );

  console.log(
    `Recent work: ${output.recentWork.length}`,
  );

  console.log(
    `Output: ${config.output}`,
  );
}

generate().catch((error) => {
  console.error(
    "Failed to generate GitHub data.",
  );

  console.error(error);

  process.exitCode = 1;
});
