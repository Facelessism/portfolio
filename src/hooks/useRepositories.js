import {
  useEffect,
  useState,
} from "react";

import repositories from "../data/repositories";
import { fetchRepository } from "../services/github";
import { mapRepository } from "../services/repositoryMapper";


export default function useRepositories() {
  const [items, setItems] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  useEffect(() => {
    let cancelled = false;


    async function loadRepositories() {
      try {

        const result =
          await Promise.all(
            repositories.map(
              async (config) => {
                const repository =
                  await fetchRepository(
                    config.owner,
                    config.repo
                  );

                return mapRepository(
                  repository,
                  config
                );
              }
            )
          );


        result.sort(
          (a, b) =>
            a.order - b.order
        );


        if (!cancelled) {
          setItems(result);
        }


      } catch (error) {

        if (!cancelled) {
          setError(
            error.message ||
            "Unable to load repositories"
          );
        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }
    }


    loadRepositories();


    return () => {
      cancelled = true;
    };

  }, []);


  return {
    repositories: items,

    loading,

    error,
  };
}
