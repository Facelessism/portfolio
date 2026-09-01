const config = {
  username: process.env.GITHUB_USERNAME || "Facelessism",
  token: process.env.GITHUB_TOKEN || "",
  apiUrl:
    process.env.GITHUB_API_URL ||
    "https://api.github.com",
  requestTimeout:
    Number(process.env.GITHUB_REQUEST_TIMEOUT) ||
    10000,
  repositoryLimit:
    Number(process.env.GITHUB_REPOSITORY_LIMIT) ||
    100,
  activityLimit:
    Number(process.env.GITHUB_ACTIVITY_LIMIT) ||
    150,
};

export default config;
