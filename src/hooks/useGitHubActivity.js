import { getGitHubActivity } from "../services/githubData";

export default function useGitHubActivity() {
  try {
    return {
      activity: getGitHubActivity(),
      loading: false,
      error: null,
    };
  } catch (error) {
    return {
      activity: [],
      loading: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load GitHub activity",
    };
  }
}
