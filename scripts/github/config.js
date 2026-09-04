const config = {
  username:
    process.env.GITHUB_USERNAME || "Facelessism",

  token:
    process.env.GITHUB_TOKEN || "",

  apiUrl:
    process.env.GITHUB_API_URL ||
    "https://api.github.com",

  output:
    process.env.GITHUB_OUTPUT ||
    "src/generated/github.json",

  historyOutput:
    process.env.GITHUB_HISTORY_OUTPUT ||
    "src/generated/github-history.json",

  days:
    Number(process.env.GITHUB_DAYS) || 30,

  historyWeeks:
    Number(process.env.GITHUB_HISTORY_WEEKS) || 52,

  requestTimeout:
    Number(
      process.env.GITHUB_REQUEST_TIMEOUT,
    ) || 10000,

  repositoryLimit:
    Number(
      process.env.GITHUB_REPOSITORY_LIMIT,
    ) || 100,

  eventLimit:
    Number(process.env.GITHUB_EVENT_LIMIT) || 100,

  commitRepositories:
    Number(
      process.env.GITHUB_COMMIT_REPOSITORIES,
    ) || 20,

  commitLimit:
    Number(process.env.GITHUB_COMMIT_LIMIT) || 100,

  activityLimit:
    Number(
      process.env.GITHUB_ACTIVITY_LIMIT,
    ) || 150,

  recentWorkLimit:
    Number(
      process.env.GITHUB_RECENT_WORK_LIMIT,
    ) || 5,

  historyRepositories:
    Number(
      process.env.GITHUB_HISTORY_REPOSITORIES,
    ) || 20,

  historyConcurrency:
    Number(
      process.env.GITHUB_HISTORY_CONCURRENCY,
    ) || 2,

  statsRetryCount:
    Number(
      process.env.GITHUB_STATS_RETRY_COUNT,
    ) || 3,

  statsRetryDelay:
    Number(
      process.env.GITHUB_STATS_RETRY_DELAY,
    ) || 2000,
};

export default config;
