import { useCallback, useEffect, useState } from "react";

import {
  fetchGitHubActivity,
} from "../services/githubActivity";

const REFRESH_INTERVAL = 5 * 60 * 1000;

export default function useGitHubActivity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadActivity = useCallback(
    async (cancelledRef) => {
      try {
        const data =
          await fetchGitHubActivity(30);

        if (cancelledRef.cancelled) return;

        setActivity(data);
        setError(null);
      } catch (err) {
        if (cancelledRef.cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load GitHub activity"
        );
      } finally {
        if (!cancelledRef.cancelled) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    const cancelledRef = {
      cancelled: false,
    };

    loadActivity(cancelledRef);

    const interval = setInterval(() => {
      loadActivity(cancelledRef);
    }, REFRESH_INTERVAL);

    return () => {
      cancelledRef.cancelled = true;
      clearInterval(interval);
    };
  }, [loadActivity]);

  return {
    activity,
    loading,
    error,
  };
}
