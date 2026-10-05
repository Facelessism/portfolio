import githubData from "../generated/github.json";

export function getGitHubRepositories() {
  return githubData.repositories ?? [];
}

export function getGitHubActivity() {
  return githubData.activity ?? [];
}

export function getRecentWork() {
  return githubData.recentWork ?? [];
}
