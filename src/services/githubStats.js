import githubData from "../generated/github.json";
import githubHistory from "../generated/github-history.json";

function getRepositories() {
  return githubData.repositories || [];
}

function getHistoryRepositories() {
  return githubHistory.repositories || [];
}

function getActivity() {
  return githubData.activity || [];
}

function getRecentWork() {
  return githubData.recentWork || [];
}

function sortByDate(items, field) {
  return [...items].sort(
    (a, b) => new Date(b[field] || 0) - new Date(a[field] || 0),
  );
}

function getSourceRepositories() {
  return getRepositories().filter((repository) => !repository.fork);
}

function getForkRepositories() {
  return getRepositories().filter((repository) => repository.fork);
}

function getActiveRepositories() {
  const since = githubData.period?.since;

  if (!since) {
    return [];
  }

  const sinceDate = new Date(since);

  const recentRepositoryNames = new Set(
    getActivity()
      .filter(
        (activity) =>
          activity.timestamp && new Date(activity.timestamp) >= sinceDate,
      )
      .map((activity) => activity.repositoryFullName)
      .filter(Boolean),
  );

  return getRepositories().filter(
    (repository) =>
      recentRepositoryNames.has(repository.fullName) ||
      (repository.pushedAt && new Date(repository.pushedAt) >= sinceDate),
  );
}

function getLanguageBreakdown() {
  const counts = new Map();

  for (const repository of getRepositories()) {
    if (!repository.language) {
      continue;
    }

    counts.set(repository.language, (counts.get(repository.language) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([language, count]) => ({
      language,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.language.localeCompare(b.language));
}

function getLatestContribution() {
  return getRecentWork().reduce(
    (latest, item) =>
      !latest || new Date(item.timestamp || 0) > new Date(latest.timestamp || 0)
        ? item
        : latest,
    null,
  );
}

function getRecentRepositories() {
  return sortByDate(getRecentWork(), "timestamp");
}

function getValidHistories() {
  return getHistoryRepositories().filter(
    (repository) => repository.historyStatus === "ok",
  );
}

function getHistoryWeeks() {
  const weeks = githubHistory.weeks || [];

  const limit = githubHistory.period?.weeks || weeks.length;

  return [...weeks].sort((a, b) => new Date(a) - new Date(b)).slice(-limit);
}

function getContributionPulse() {
  const histories = getValidHistories();

  const daily = new Map();

  for (const repository of histories) {
    for (const week of repository.weeks || []) {
      const dailyCommits = Array.isArray(week.days) ? week.days : [];

      if (!dailyCommits.length) {
        continue;
      }

      const weekStart = new Date(week.week);

      for (let dayIndex = 0; dayIndex < dailyCommits.length; dayIndex += 1) {
        const commits = Number(dailyCommits[dayIndex]) || 0;

        if (commits <= 0) {
          continue;
        }

        const date = new Date(weekStart);

        date.setUTCDate(date.getUTCDate() + dayIndex);

        const dateKey = date.toISOString().slice(0, 10);

        let day = daily.get(dateKey);

        if (!day) {
          day = {
            date: dateKey,
            commits: 0,
            repositories: new Map(),
          };

          daily.set(dateKey, day);
        }

        day.commits += commits;

        day.repositories.set(repository.fullName, {
          name: repository.name,
          fullName: repository.fullName,
          fork: repository.fork,
          repositoryUrl: repository.repositoryUrl,
          commits,
        });
      }
    }
  }

  const days = [...daily.values()]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((day) => {
      const repositories = [...day.repositories.values()].sort(
        (a, b) => b.commits - a.commits || a.name.localeCompare(b.name),
      );

      return {
        date: day.date,
        commits: day.commits,
        repositoryCount: repositories.length,
        repositories,
      };
    });

  return {
    days,
    repositories: histories
      .map((repository) => ({
        name: repository.name,
        fullName: repository.fullName,
        fork: repository.fork,
        repositoryUrl: repository.repositoryUrl,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}

function buildEvolutionData() {
  const weeks = getHistoryWeeks();

  return getValidHistories().map((repository) => {
    const activityByWeek = new Map(
      (repository.weeks || []).map((week) => [week.week, week]),
    );

    let cumulativeCommits = 0;

    const series = weeks.map((week) => {
      const activity = activityByWeek.get(week) || {
        commits: 0,
        additions: 0,
        deletions: 0,
        churn: 0,
      };

      const commits = Number(activity.commits) || 0;

      cumulativeCommits += commits;

      return {
        week,
        commits: cumulativeCommits,
        weeklyCommits: commits,
        additions: Number(activity.additions) || 0,
        deletions: Number(activity.deletions) || 0,
        churn: Number(activity.churn) || 0,
      };
    });

    return {
      id: repository.id,
      name: repository.name,
      fullName: repository.fullName,
      fork: repository.fork,
      language: repository.language,
      topics: repository.topics || [],
      repositoryUrl: repository.repositoryUrl,
      historyStatus: repository.historyStatus,
      totalCommits: repository.totalCommits,
      totalAdditions: repository.totalAdditions,
      totalDeletions: repository.totalDeletions,
      totalChurn: repository.totalChurn,
      series,
    };
  });
}

function buildTechnologyGraph() {
  const nodes = [];
  const edges = [];
  const technologyNodes = new Map();

  for (const repository of getRepositories()) {
    nodes.push({
      id: repository.fullName,
      type: "repository",
      label: repository.name,
      repository: repository.fullName,
      fork: repository.fork,
      language: repository.language,
    });

    const values = new Set();

    if (repository.language) {
      values.add(repository.language);
    }

    for (const topic of repository.topics || []) {
      values.add(topic);
    }

    for (const technology of values) {
      let technologyNode = technologyNodes.get(technology);

      if (!technologyNode) {
        technologyNode = {
          id: `technology:${technology}`,
          type: "technology",
          label: technology,
          technology,
          count: 0,
        };

        technologyNodes.set(technology, technologyNode);

        nodes.push(technologyNode);
      }

      technologyNode.count += 1;

      edges.push({
        source: repository.fullName,
        target: technologyNode.id,
      });
    }
  }

  return {
    nodes,
    edges,
  };
}

function getPeriod() {
  const since = githubData.period?.since || githubHistory.period?.since;

  const until = githubData.period?.until || githubHistory.period?.until;

  const sinceDate = since ? new Date(since) : null;

  const untilDate = until ? new Date(until) : null;

  const days =
    sinceDate && untilDate
      ? Math.max(1, Math.round((untilDate - sinceDate) / (24 * 60 * 60 * 1000)))
      : null;

  return {
    since,
    until,
    days,
    weeks: githubHistory.period?.weeks || null,
  };
}

export function getGitHubStats() {
  return {
    generatedAt: githubData.generatedAt,

    historyGeneratedAt: githubHistory.generatedAt,

    period: getPeriod(),

    repositories: getRepositories(),

    sourceRepositories: getSourceRepositories(),

    forkRepositories: getForkRepositories(),

    activeRepositories: getActiveRepositories(),

    historyRepositories: getHistoryRepositories(),

    languageBreakdown: getLanguageBreakdown(),

    latestContribution: getLatestContribution(),

    recentRepositories: getRecentRepositories(),

    contributionPulse: getContributionPulse(),

    evolution: buildEvolutionData(),

    technologyGraph: buildTechnologyGraph(),
  };
}
