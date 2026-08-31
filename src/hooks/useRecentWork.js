import { useEffect, useState } from "react";

import {
  fetchRecentWork,
} from "../services/githubActivity";

const WORK_LIMIT = 4;

export default function useRecentWork() {
  const [work, setWork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRecentWork() {
      try {
        setLoading(true);

        const activity =
          await fetchRecentWork();

        if (cancelled) return;

        setWork(activity.slice(0, WORK_LIMIT));
        setError(null);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load recent work"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecentWork();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    work,
    loading,
    error,
  };
}
