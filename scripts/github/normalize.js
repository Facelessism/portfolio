export function normalizeProfile(
  profile
) {
  return {
    login: profile.login,
    name: profile.name,
    avatar: profile.avatar_url,
    bio: profile.bio,
    company: profile.company,
    location: profile.location,
    repositories:
      profile.public_repos ?? 0,
    followers:
      profile.followers ?? 0,
    following:
      profile.following ?? 0,
    gists:
      profile.public_gists ?? 0,
    profileUrl:
      profile.html_url,
    createdAt:
      profile.created_at,
    updatedAt:
      profile.updated_at,
  };
}

export function normalizeRepository(
  repository
) {
  return {
    id: repository.id,
    name: repository.name,
    fullName:
      repository.full_name,
    description:
      repository.description ||
      "No description provided.",
    private:
      Boolean(repository.private),
    fork:
      Boolean(repository.fork),
    stars:
      repository.stargazers_count ?? 0,
    forks:
      repository.forks_count ?? 0,
    watchers:
      repository.watchers_count ?? 0,
    openIssues:
      repository.open_issues_count ?? 0,
    language:
      repository.language || null,
    topics:
      repository.topics ?? [],
    defaultBranch:
      repository.default_branch ||
      "main",
    repositoryUrl:
      repository.html_url,
    homepage:
      repository.homepage || null,
    createdAt:
      repository.created_at,
    updatedAt:
      repository.updated_at,
    pushedAt:
      repository.pushed_at,
  };
}

export function normalizeCommit(
  commit,
  repository
) {
  const message =
    commit.commit?.message
      ?.split("\n")[0]
      ?.trim() || "Commit";

  return {
    id: `commit-${commit.sha}`,
    type: "COMMIT",
    repository:
      repository.split("/").pop(),
    repositoryFullName:
      repository,
    sha: commit.sha,
    timestamp:
      commit.commit?.author?.date ||
      commit.commit?.committer?.date ||
      null,
    details: message,
    author:
      commit.author?.login ||
      commit.commit?.author?.name ||
      null,
    url:
      commit.html_url ||
      `https://github.com/${repository}/commit/${commit.sha}`,
  };
}

export function normalizePullRequest(
  pullRequest
) {
  const repository =
    pullRequest.repository_url
      ?.split("/repos/")
      .pop() || "";

  return {
    id: `pr-${pullRequest.id}`,
    type: "PR",
    repository:
      repository.split("/").pop() ||
      "unknown",
    repositoryFullName:
      repository,
    timestamp:
      pullRequest.created_at,
    details:
      pullRequest.title ||
      "Pull request",
    state:
      pullRequest.state || null,
    merged:
      pullRequest.pull_request
        ?.merged_at != null,
    url:
      pullRequest.html_url ||
      null,
  };
}

export function normalizeActivity(
  event
) {
  const repository =
    event.repo?.name || "";

  return {
    id: event.id,
    type:
      getActivityType(event),
    repository:
      repository.split("/").pop() ||
      "unknown",
    repositoryFullName:
      repository,
    timestamp:
      event.created_at,
    details:
      getActivityDetails(event),
    url:
      getActivityUrl(
        event,
        repository
      ),
  };
}

function getActivityType(event) {
  switch (event.type) {
    case "PushEvent":
      return "PUSH";

    case "CreateEvent":
      if (
        event.payload?.ref_type ===
        "branch"
      ) {
        return "BRANCH";
      }

      if (
        event.payload?.ref_type ===
        "tag"
      ) {
        return "TAG";
      }

      return "CREATE";

    case "PullRequestEvent":
      return `PR ${String(
        event.payload?.action ||
          "UPDATE"
      ).toUpperCase()}`;

    case "IssuesEvent":
      return `ISSUE ${String(
        event.payload?.action ||
          "UPDATE"
      ).toUpperCase()}`;

    case "IssueCommentEvent":
      return "COMMENT";

    case "ReleaseEvent":
      return "RELEASE";

    default:
      return "ACTIVITY";
  }
}

function getActivityDetails(event) {
  switch (event.type) {
    case "PushEvent": {
      const commits =
        event.payload?.commits
          ?.length || 0;

      return `${commits} ${
        commits === 1
          ? "commit"
          : "commits"
      }`;
    }

    case "CreateEvent":
      return (
        event.payload?.ref_name ||
        event.payload?.ref_type ||
        "created"
      );

    case "PullRequestEvent":
      return (
        event.payload?.pull_request
          ?.title ||
        "Pull request activity"
      );

    case "IssuesEvent":
      return (
        event.payload?.issue?.title ||
        "Issue activity"
      );

    case "IssueCommentEvent":
      return (
        event.payload?.issue?.title ||
        "Issue comment"
      );

    case "ReleaseEvent":
      return (
        event.payload?.release
          ?.tag_name ||
        "Release"
      );

    default:
      return "";
  }
}

function getActivityUrl(
  event,
  repository
) {
  if (!repository) {
    return null;
  }

  switch (event.type) {
    case "PushEvent": {
      const commits =
        event.payload?.commits || [];

      const latestCommit =
        commits[commits.length - 1];

      if (latestCommit?.sha) {
        return (
          latestCommit.url ||
          `https://github.com/${repository}/commit/${latestCommit.sha}`
        );
      }

      return `https://github.com/${repository}`;
    }

    case "PullRequestEvent":
      return (
        event.payload?.pull_request
          ?.html_url ||
        `https://github.com/${repository}/pulls`
      );

    case "IssuesEvent":
    case "IssueCommentEvent":
      return (
        event.payload?.issue
          ?.html_url ||
        `https://github.com/${repository}/issues`
      );

    case "ReleaseEvent":
      return (
        event.payload?.release
          ?.html_url ||
        `https://github.com/${repository}/releases`
      );

    default:
      return `https://github.com/${repository}`;
  }
}

export function isUsefulActivity(
  event
) {
  return [
    "PushEvent",
    "CreateEvent",
    "PullRequestEvent",
    "IssuesEvent",
    "IssueCommentEvent",
    "ReleaseEvent",
  ].includes(event.type);
}
