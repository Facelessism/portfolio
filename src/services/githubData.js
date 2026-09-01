import githubData from "../generated/github.json";

function getData() {
  return githubData;
}

export function getGitHubData() {
  return getData();
}

export function getGitHubProfile() {
  return getData().profile ?? null;
}

export function getGitHubRepositories() {
  return getData().repositories ?? [];
}

export function getGitHubActivity() {
  return getData().activity ?? [];
}

export function getRecentWork() {
  return getData().recentWork ?? [];
}

export function getGitHubGeneratedAt() {
  return getData().generatedAt ?? null;
}

export function getGitHubPeriod() {
  return (
    getData().period ?? {
      days: 0,
      since: null,
    }
  );
}
