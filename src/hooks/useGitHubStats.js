import {
  useMemo,
} from "react";

import {
  getGitHubStats,
} from "../services/githubStats";

function useGitHubStats() {
  return useMemo(
    () => getGitHubStats(),
    [],
  );
}

export default useGitHubStats;
