import { useEffect, useState } from "react";
import repositories from "../data/repositories";
import { fetchRepository } from "../services/github";
import { mapRepository } from "../services/repositoryMapper";

export default function useRepositories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRepositories() {
      try {
        const result = await Promise.all(
          repositories.map(async (config) => {
            const repository = await fetchRepository(
              config.owner,
              config.repo
            );

            return mapRepository(repository, config);
          })
        );

        result.sort(
          (a, b) => a.order - b.order
        );

        setItems(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadRepositories();
  }, []);

  return {
    repositories: items,

    loading,

    error,
  };
}
