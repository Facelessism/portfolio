import { fetchRecentCommits } from "./githubCommits";
import {
  fetchRecentPullRequests,
} from "./githubPullRequests";

const DEFAULT_DAYS = 30;
const MAX_ACTIVITY = 150;
const MAX_RECENT_WORK = 4;

export async function fetchGitHubActivity(
  days = DEFAULT_DAYS
) {
  const results =
    await Promise.allSettled([
      fetchRecentCommits(days),
      fetchRecentPullRequests(days),
    ]);

  const activity = results
    .filter(
      (result) =>
        result.status === "fulfilled"
    )
    .flatMap(
      (result) => result.value
    );

  if (!activity.length) {
    throw new Error(
      "Unable to load GitHub activity"
    );
  }

  return activity
    .filter(isValidActivity)
    .sort(
      (a, b) =>
        new Date(b.timestamp) -
        new Date(a.timestamp)
    )
    .slice(0, MAX_ACTIVITY);
}

export async function fetchRecentWork(
  days = DEFAULT_DAYS
) {
  const commits =
    await fetchRecentCommits(days);

  const repositories = new Map();

  commits
    .filter(isValidActivity)
    .forEach((commit) => {
      const key =
        commit.repositoryFullName;

      if (!key) return;

      const existing =
        repositories.get(key);

      if (!existing) {
        repositories.set(key, {
          id: key,
          repository:
            commit.repository,
          repositoryFullName: key,
          description:
            commit.description || "",
          language:
            commit.language || "",
          commitCount: 1,
          timestamp: commit.timestamp,
          url:
            commit.repositoryUrl ||
            commit.url,
        });

        return;
      }

      existing.commitCount += 1;

      if (
        new Date(commit.timestamp) >
        new Date(existing.timestamp)
      ) {
        existing.timestamp =
          commit.timestamp;
      }
    });

  return Array.from(
    repositories.values()
  )
    .sort(
      (a, b) =>
        new Date(b.timestamp) -
        new Date(a.timestamp)
    )
    .slice(0, MAX_RECENT_WORK);
}

function isValidActivity(
  activity
) {
  return Boolean(
    activity?.id &&
    activity?.repository &&
    activity?.timestamp
  );
}
