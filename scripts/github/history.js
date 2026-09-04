import config from "./config.js";

import {
  fetchRepositoryCommits,
  fetchRepositoryContributorStats,
} from "./github.js";

function createSemaphore(limit) {
  let active = 0;
  const queue = [];

  async function acquire() {
    if (active < limit) {
      active += 1;
      return;
    }

    await new Promise((resolve) =>
      queue.push(resolve),
    );

    active += 1;
  }

  function release() {
    active -= 1;

    const resolve = queue.shift();

    if (resolve) {
      resolve();
    }
  }

  return {
    async run(task) {
      await acquire();

      try {
        return await task();
      } finally {
        release();
      }
    },
  };
}

function toDate(timestamp) {
  return new Date(
    Number(timestamp) * 1000,
  ).toISOString();
}

function getUserContributorStats(contributors) {
  if (!Array.isArray(contributors)) {
    return null;
  }

  const username =
    config.username.toLowerCase();

  return (
    contributors.find(
      (contributor) =>
        contributor.author?.login?.toLowerCase() ===
        username,
    ) || null
  );
}

function buildWeeks(
  contributor,
  sinceTimestamp,
) {
  const userWeeks = Array.isArray(
    contributor?.weeks,
  )
    ? contributor.weeks
    : [];

  return userWeeks
    .filter(
      (week) =>
        Number(week.w) >= sinceTimestamp,
    )
    .map((week) => {
      const commits =
        Number(week.c) || 0;

      const additions =
        Number(week.a) || 0;

      const deletions =
        Number(week.d) || 0;

      return {
        week: toDate(week.w),
        commits,
        additions,
        deletions,
        churn:
          additions + deletions,
        netChange:
          additions - deletions,
        days: [],
      };
    });
}

function buildDailyCommitMap(
  commits,
) {
  const daily = new Map();

  if (!Array.isArray(commits)) {
    return daily;
  }

  for (const commit of commits) {
    const timestamp =
      commit.commit?.author?.date ||
      commit.committer?.date;

    if (!timestamp) {
      continue;
    }

    const date =
      new Date(timestamp)
        .toISOString()
        .slice(0, 10);

    daily.set(
      date,
      (daily.get(date) || 0) + 1,
    );
  }

  return daily;
}

function addDailyCommits(
  weeks,
  dailyCommits,
) {
  if (!weeks.length) {
    return;
  }

  for (const week of weeks) {
    const weekDate =
      new Date(week.week);

    const days = [];

    for (
      let dayIndex = 0;
      dayIndex < 7;
      dayIndex += 1
    ) {
      const date =
        new Date(weekDate);

      date.setUTCDate(
        date.getUTCDate() +
          dayIndex,
      );

      const dateKey =
        date
          .toISOString()
          .slice(0, 10);

      days.push(
        dailyCommits.get(
          dateKey,
        ) || 0,
      );
    }

    week.days = days;
  }
}

function buildRepositoryHistory(
  repository,
  contributor,
  dailyCommits,
  sinceTimestamp,
  historyStatus = "ok",
) {
  const weeks =
    buildWeeks(
      contributor,
      sinceTimestamp,
    );

  addDailyCommits(
    weeks,
    dailyCommits,
  );

  return {
    id: repository.id,
    name: repository.name,
    fullName: repository.fullName,
    fork: repository.fork,
    language: repository.language,
    topics: repository.topics || [],
    repositoryUrl:
      repository.repositoryUrl,
    createdAt: repository.createdAt,
    pushedAt: repository.pushedAt,
    historyStatus,
    contributorFound:
      Boolean(contributor),

    totalCommits:
      weeks.reduce(
        (total, week) =>
          total + week.commits,
        0,
      ),

    totalAdditions:
      weeks.reduce(
        (total, week) =>
          total + week.additions,
        0,
      ),

    totalDeletions:
      weeks.reduce(
        (total, week) =>
          total + week.deletions,
        0,
      ),

    totalChurn:
      weeks.reduce(
        (total, week) =>
          total + week.churn,
        0,
      ),

    weeks,
  };
}

async function fetchHistoryForRepository(
  repository,
  semaphore,
  sinceTimestamp,
) {
  return semaphore.run(async () => {
    try {
      const [
        contributors,
        commits,
      ] = await Promise.all([
        fetchRepositoryContributorStats(
          repository.fullName,
        ),
        fetchRepositoryCommits(
          repository.fullName,
          toDate(sinceTimestamp),
        ),
      ]);

      const contributor =
        getUserContributorStats(
          contributors,
        );

      const dailyCommits =
        buildDailyCommitMap(
          commits,
        );

      if (!contributor) {
        console.warn(
          `No contributor history found for ${repository.fullName}`,
        );

        return buildRepositoryHistory(
          repository,
          null,
          dailyCommits,
          sinceTimestamp,
          "no-contribution",
        );
      }

      return buildRepositoryHistory(
        repository,
        contributor,
        dailyCommits,
        sinceTimestamp,
      );
    } catch (error) {
      console.warn(
        `History unavailable for ${repository.fullName}: ${error.message}`,
      );

      return buildRepositoryHistory(
        repository,
        null,
        new Map(),
        sinceTimestamp,
        "unavailable",
      );
    }
  });
}

function selectRepositories(
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
      config.historyRepositories,
    );
}

export async function generateHistory(
  repositories,
) {
  const selectedRepositories =
    selectRepositories(
      repositories,
    );

  const semaphore =
    createSemaphore(
      config.historyConcurrency,
    );

  const untilTimestamp =
    Math.floor(
      Date.now() / 1000,
    );

  const sinceTimestamp =
    untilTimestamp -
    config.historyWeeks *
      7 *
      24 *
      60 *
      60;

  console.log(
    `History candidates: ${selectedRepositories.length}`,
  );

  const histories =
    await Promise.all(
      selectedRepositories.map(
        (repository) =>
          fetchHistoryForRepository(
            repository,
            semaphore,
            sinceTimestamp,
          ),
      ),
    );

  const weeks =
    Array.from(
      new Set(
        histories.flatMap(
          (history) =>
            history.weeks.map(
              (week) =>
                week.week,
            ),
        ),
      ),
    ).sort();

  return {
    generatedAt:
      new Date().toISOString(),

    period: {
      weeks:
        config.historyWeeks,
      since:
        toDate(
          sinceTimestamp,
        ),
      until:
        toDate(
          untilTimestamp,
        ),
    },

    repositories:
      histories,

    weeks,
  };
}
