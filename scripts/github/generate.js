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

import { generateHistory } from "./history.js";

function isWithinPeriod(
  timestamp,
  sinceDate,
) {
  if (!timestamp) {
    return false;
  }

  return new Date(timestamp) >= sinceDate;
}

function getActiveRepositories(
  repositories,
) {
  return repositories
    .filter(
      (repository) =>
        repository.pushedAt,
    )
    .sort(
      (a, b) =>
        new Date(b.pushedAt) -
        new Date(a.pushedAt),
    )
    .slice(
      0,
      config.commitRepositories,
    );
}

function buildRecentWork(
  repositories,
  commitsByRepository,
) {
  return repositories
    .map((repository) => {
      const commits =
        commitsByRepository.get(
          repository.fullName,
        ) || [];

      return commits[0] || null;
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(b.timestamp || 0) -
        new Date(a.timestamp || 0),
    )
    .slice(
      0,
      config.recentWorkLimit,
    );
}

async function writeJson(
  outputPath,
  data,
) {
  const resolvedPath =
    path.resolve(outputPath);

  await fs.mkdir(
    path.dirname(resolvedPath),
    {
      recursive: true,
    },
  );

  const temporaryPath =
    `${resolvedPath}.tmp`;

  await fs.writeFile(
    temporaryPath,
    `${JSON.stringify(
      data,
      null,
      2,
    )}\n`,
    "utf8",
  );

  await fs.rename(
    temporaryPath,
    resolvedPath,
  );
}

async function writeJsonIfChanged(
  outputPath,
  data,
) {
  const resolvedPath =
    path.resolve(outputPath);

  let existing = null;

  try {
    existing =
      JSON.parse(
        await fs.readFile(
          resolvedPath,
          "utf8",
        ),
      );
  } catch {
    // Ignoring missing or invalid JSON
  }

  const currentComparable = {
    ...data,
    generatedAt: null,
  };

  const existingComparable =
    existing
      ? {
          ...existing,
          generatedAt: null,
        }
      : null;

  if (
    existingComparable &&
    JSON.stringify(
      existingComparable,
    ) ===
      JSON.stringify(
        currentComparable,
      )
  ) {
    return false;
  }

  await writeJson(
    resolvedPath,
    data,
  );

  return true;
}

async function generate() {
  const startedAt = Date.now();

  const sinceDate = new Date(
    Date.now() -
      config.days *
        24 *
        60 *
        60 *
        1000,
  );

  const since =
    sinceDate.toISOString();

  console.log(
    `Generating GitHub data for ${config.username}...`,
  );

  if (!config.token) {
    console.warn(
      "GITHUB_TOKEN is not set. Requests are unauthenticated.",
    );
  }

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
    normalizeRepositories(
      repositories,
    );

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
      .slice(
        0,
        config.activityLimit,
      );

  const activeRepositories =
    getActiveRepositories(
      normalizedRepositories,
    );

  console.log(
    `Fetching recent commits for ${activeRepositories.length} repositories...`,
  );

  const commitResults =
    await Promise.allSettled(
      activeRepositories.map(
        (repository) =>
          fetchRepositoryCommits(
            repository.fullName,
            since,
          ).then((commits) => ({
            repository:
              repository.fullName,

            commits:
              normalizeCommits(
                commits,
                repository.fullName,
              ),
          })),
      ),
    );

  const commitsByRepository =
    new Map();

  for (const result of commitResults) {
    if (
      result.status !==
      "fulfilled"
    ) {
      console.warn(
        "Failed to fetch repository commits:",
        result.reason?.message ||
          result.reason,
      );

      continue;
    }

    const {
      repository,
      commits,
    } = result.value;

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

  const recentWork =
    buildRecentWork(
      activeRepositories,
      commitsByRepository,
    );

  const generatedAt =
    new Date().toISOString();

  const output = {
    generatedAt,

    period: {
      days: config.days,
      since,
    },

    profile:
      normalizedProfile,

    repositories:
      normalizedRepositories,

    activity:
      normalizedActivities,

    recentWork,
  };

  const githubChanged =
    await writeJsonIfChanged(
      config.output,
      output,
    );

  console.log(
    githubChanged
      ? "GitHub data updated."
      : "GitHub data unchanged.",
  );

  console.log(
    "Generating repository history...",
  );

  const history =
    await generateHistory(
      normalizedRepositories,
    );

  const historyChanged =
    await writeJsonIfChanged(
      config.historyOutput,
      history,
    );

  console.log(
    historyChanged
      ? "Repository history updated."
      : "Repository history unchanged.",
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
    `History repositories: ${history.repositories.length}`,
  );

  console.log(
    `GitHub data generated in ${
      Date.now() - startedAt
    }ms`,
  );

  console.log(
    `Current data: ${config.output}`,
  );

  console.log(
    `History data: ${config.historyOutput}`,
  );
}

generate().catch((error) => {
  console.error(
    "Failed to generate GitHub data.",
  );

  console.error(error);

  process.exitCode = 1;
});
