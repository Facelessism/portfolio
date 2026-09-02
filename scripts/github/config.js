const config = {
  username: process.env.GITHUB_USERNAME || "Facelessism",
  token: process.env.GITHUB_TOKEN || "",
  apiUrl: process.env.GITHUB_API_URL || "https://api.github.com",
  output: process.env.GITHUB_OUTPUT || "src/generated/github.json",
  days: Number(process.env.GITHUB_DAYS) || 30,
  requestTimeout: Number(process.env.GITHUB_REQUEST_TIMEOUT) || 10000,
  repositoryLimit: Number(process.env.GITHUB_REPOSITORY_LIMIT) || 100,
  eventLimit: Number(process.env.GITHUB_EVENT_LIMIT) || 100,
  commitRepositories: Number(process.env.GITHUB_COMMIT_REPOSITORIES) || 20,
  commitLimit: Number(process.env.GITHUB_COMMIT_LIMIT) || 100,
  activityLimit: Number(process.env.GITHUB_ACTIVITY_LIMIT) || 150,
  recentWorkLimit: Number(process.env.GITHUB_RECENT_WORK_LIMIT) || 5,
};

export default config;

