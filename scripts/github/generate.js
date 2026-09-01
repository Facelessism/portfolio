import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import config from "./config.js";

import {
  fetchProfile,
  fetchRepositories,
  fetchEvents,
  fetchRepositoryCommits,
  searchPullRequests,
} from "./github.js";

import {
  normalizeProfile,
  normalizeRepository,
  normalizeActivity,
  normalizeCommit,
  normalizePullRequest,
  isUsefulActivity,
} from "./normalize.js";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const root =
  path.resolve(__dirname, "../..");

const outputPath =
  path.resolve(root, config.output);

const DAY_MS =
  24 * 60 * 60 * 1000;

const sinceDate =
  new Date(
    Date.now() -
      config.days * DAY_MS
  );

const since =
  sinceDate.toISOString();

async function generate() {
  const startedAt =
    Date.now();

  console.log(
    `Generating GitHub data for ${config.username}...`
  );

  const [
    profileResult,
    repositoriesResult,
    eventsResult,
    pullRequestResult,
  ] = await Promise.all([
    fetchProfile(),
    fetchRepositories(),
    fetchEvents(),
    searchPullRequests(since),
  ]);

  const profile =
    normalizeProfile(
      profileResult.data
    );

  const repositories =
    normalizeRepositories(
      repositoriesResult.data
    );

  const activity =
    buildActivity(
      eventsResult.data
    );

  const recentWork =
    await buildRecentWork(
      repositories,
      pullRequestResult.data
    );

  const payload = {
    generatedAt:
      new Date().toISOString(),

    username:
      config.username,

    period: {
      days:
        config.days,
      since,
    },

    profile,

    repositories,

    activity,

    recentWork,
  };

  await writeOutput(payload);

  const elapsed =
    Date.now() - startedAt;

  printSummary(
    repositories,
    activity,
    recentWork,
    elapsed
  );
}

function normalizeRepositories(
  repositories = []
) {
  return repositories
    .map(normalizeRepository)
    .filter(
      (repository) =>
        repository?.fullName
    );
}

function buildActivity(
  events = []
) {
  return events
    .filter(isUsefulActivity)
    .filter(
      (event) =>
        isWithinPeriod(
          event?.created_at
        )
    )
    .map(normalizeActivity)
    .filter(
      (event) =>
        event?.timestamp
    )
    .sort(sortByDate)
    .slice(
      0,
      config.activityLimit
    );
}

async function buildRecentWork(
  repositories,
  pullRequestData
) {
  const activeRepositories =
    repositories
      .filter(
        (repository) =>
          isWithinPeriod(
            repository?.pushedAt
          )
      )
      .slice(
        0,
        config.commitRepositories
      );

  console.log(
    `Fetching commits from ${activeRepositories.length} active repositories...`
  );

  const commitResults =
    await Promise.allSettled(
      activeRepositories.map(
        (repository) =>
          fetchRepositoryCommits(
            repository.fullName,
            since
          )
      )
    );

  const commits =
    collectCommits(
      activeRepositories,
      commitResults
    );

  const pullRequests =
    (pullRequestData?.items || [])
      .map(
        normalizePullRequest
      )
      .filter(
        (pullRequest) =>
          pullRequest?.timestamp
      );

  return deduplicate(
    [
      ...commits,
      ...pullRequests,
    ]
  )
    .sort(sortByDate)
    .slice(
      0,
      config.recentWorkLimit
    );
}

function collectCommits(
  repositories,
  results
) {
  const commits = [];

  results.forEach(
    (result, index) => {
      if (
        result.status !==
        "fulfilled"
      ) {
        console.warn(
          `Skipping commits for ${repositories[index].fullName}: ${result.reason?.message || "request failed"}`
        );

        return;
      }

      const repository =
        repositories[index];

      const data =
        result.value?.data || [];

      for (
        const commit of data
      ) {
        const normalized =
          normalizeCommit(
            commit,
            repository.fullName
          );

        if (
          normalized?.timestamp
        ) {
          commits.push(
            normalized
          );
        }
      }
    }
  );

  return commits;
}

function isWithinPeriod(
  value
) {
  if (!value) {
    return false;
  }

  const timestamp =
    new Date(value).getTime();

  return (
    Number.isFinite(timestamp) &&
    timestamp >=
      sinceDate.getTime()
  );
}

function deduplicate(
  items
) {
  const seen =
    new Set();

  return items.filter(
    (item) => {
      if (!item?.id) {
        return false;
      }

      if (
        seen.has(item.id)
      ) {
        return false;
      }

      seen.add(item.id);

      return true;
    }
  );
}

function sortByDate(
  a,
  b
) {
  return (
    new Date(
      b.timestamp
    ).getTime() -
    new Date(
      a.timestamp
    ).getTime()
  );
}

async function writeOutput(
  payload
) {
  const directory =
    path.dirname(
      outputPath
    );

  await fs.mkdir(
    directory,
    {
      recursive: true,
    }
  );

  const temporaryPath =
    `${outputPath}.tmp`;

  await fs.writeFile(
    temporaryPath,
    `${JSON.stringify(
      payload,
      null,
      2
    )}\n`,
    "utf8"
  );

  await fs.rename(
    temporaryPath,
    outputPath
  );
}

function printSummary(
  repositories,
  activity,
  recentWork,
  elapsed
) {
  console.log(
    `GitHub data generated in ${elapsed}ms`
  );

  console.log(
    `Repositories: ${repositories.length}`
  );

  console.log(
    `Activity: ${activity.length}`
  );

  console.log(
    `Recent work: ${recentWork.length}`
  );

  console.log(
    `Output: ${path.relative(
      root,
      outputPath
    )}`
  );
}

generate().catch(
  (error) => {
    console.error(
      "\nGitHub data generation failed."
    );

    console.error(
      error.message
    );

    if (
      error.status !==
      undefined
    ) {
      console.error(
        `HTTP status: ${error.status}`
      );
    }

    if (
      error.rateLimitRemaining !==
      undefined
    ) {
      console.error(
        `Rate limit remaining: ${error.rateLimitRemaining}`
      );
    }

    if (
      error.rateLimitReset
    ) {
      const reset =
        Number(
          error.rateLimitReset
        );

      if (
        Number.isFinite(reset)
      ) {
        console.error(
          `Rate limit reset: ${new Date(
            reset * 1000
          ).toISOString()}`
        );
      }
    }

    process.exit(1);
  }
);
