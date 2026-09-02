function normalizeProfileData(profile) {
  return {
    login: profile.login,
    name: profile.name,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    company: profile.company,
    location: profile.location,
    repositories: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
    gists: profile.public_gists,
    profileUrl: profile.html_url,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

function normalizeRepository(repository) {
  return {
    id: repository.id,
    name: repository.name,
    fullName: repository.full_name,
    description: repository.description,
    private: repository.private,
    fork: repository.fork,
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    watchers: repository.watchers_count,
    openIssues: repository.open_issues_count,
    language: repository.language,
    topics: repository.topics || [],
    defaultBranch: repository.default_branch,
    repositoryUrl: repository.html_url,
    homepage: repository.homepage,
    createdAt: repository.created_at,
    updatedAt: repository.updated_at,
    pushedAt: repository.pushed_at,
  };
}

function normalizeCommit(commit, repository) {
  return {
    id: `commit:${repository}:${commit.sha}`,
    type: "commit",
    repository:
      commit.repository?.name ||
      repository.split("/")[1],
    repositoryFullName: repository,
    sha: commit.sha,
    timestamp:
      commit.commit?.author?.date ||
      null,
    details:
      commit.commit?.message?.split("\n")[0] ||
      "",
    author:
      commit.author?.login ||
      commit.commit?.author?.name ||
      null,
    url:
      commit.html_url ||
      `https://github.com/${repository}/commit/${commit.sha}`,
  };
}

function normalizePullRequest(pullRequest) {
  const repositoryFullName =
    pullRequest.repository_url
      ?.replace(
        "https://api.github.com/repos/",
        "",
      ) || null;

  return {
    id: `pull-request:${pullRequest.id}`,
    type: "pull_request",
    repository:
      repositoryFullName?.split("/").pop() ||
      null,
    repositoryFullName,
    timestamp:
      pullRequest.updated_at ||
      pullRequest.created_at ||
      null,
    details: pullRequest.title || "",
    state: pullRequest.merged_at
      ? "merged"
      : pullRequest.state,
    merged: Boolean(pullRequest.merged_at),
    url: pullRequest.html_url,
  };
}

function normalizeActivity(event) {
  const repositoryFullName =
    event.repo?.name ||
    null;

  let type = "activity";
  let details = "";

  switch (event.type) {
    case "PushEvent": {
      type = "push";

      const count =
        event.payload?.commits?.length || 0;

      details =
        `${count} commit${count === 1 ? "" : "s"} pushed`;

      break;
    }

    case "CreateEvent":
      type = "create";
      details =
        `Created ${event.payload?.ref_type || "resource"}`;
      break;

    case "PullRequestEvent":
      type = "pull_request";
      details =
        event.payload?.pull_request?.title ||
        "Pull request activity";
      break;

    case "IssuesEvent":
      type = "issue";
      details =
        event.payload?.issue?.title ||
        "Issue activity";
      break;

    case "IssueCommentEvent":
      type = "comment";
      details =
        event.payload?.issue?.title ||
        "Issue comment";
      break;

    case "ReleaseEvent":
      type = "release";
      details =
        event.payload?.release?.name ||
        event.payload?.release?.tag_name ||
        "Release activity";
      break;

    default:
      break;
  }

  return {
    id: `activity:${event.id}`,
    type,
    repository:
      repositoryFullName?.split("/").pop() ||
      null,
    repositoryFullName,
    timestamp: event.created_at,
    details,
    url: repositoryFullName
      ? `https://github.com/${repositoryFullName}`
      : null,
  };
}

export function normalizeProfile(profile) {
  return normalizeProfileData(profile);
}

export function normalizeRepositories(repositories) {
  return repositories.map(normalizeRepository);
}

export function normalizeCommits(commits, repository) {
  return commits.map((commit) =>
    normalizeCommit(commit, repository),
  );
}

export function normalizePullRequests(pullRequests) {
  return pullRequests.map(normalizePullRequest);
}

export function normalizeActivities(events) {
  return events.map(normalizeActivity);
}
