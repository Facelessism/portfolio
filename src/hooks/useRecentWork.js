import { getRecentWork } from "../services/githubData";

const WORK_LIMIT = 4;

export default function useRecentWork() {
  try {
    return {
      work: getRecentWork().slice(0, WORK_LIMIT),
      loading: false,
      error: null,
    };
  } catch (error) {
    return {
      work: [],
      loading: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load recent work",
    };
  }
}
