import { getGitHubRepositories } from "../services/githubData";

export default function useRepositories() {
  try {
    return {
      repositories: getGitHubRepositories(),
      loading: false,
      error: null,
    };
  } catch (error) {
    return {
      repositories: [],
      loading: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load repositories",
    };
  }
}
