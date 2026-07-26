import { useEffect, useState } from "react";
import { fetchUserRepositories } from "../services/githubProfile";

export default function useGitHubRepositories() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRepositories() {
      try {
        const data =
          await fetchUserRepositories(
            "Facelessism"
          );

        setRepositories(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadRepositories();
  }, []);

  return {
    repositories,
    loading,
    error,
  };
}
