import {
  useEffect,
  useMemo,
  useState,
} from "react";

import useRepositories from "../hooks/useRepositories";
import FeaturedRepositoryCard from "./FeaturedRepositoryCard";


function RepositoryDeck() {
  const {
    repositories,
    loading,
    error,
  } = useRepositories();


  const [activeIndex, setActiveIndex] =
    useState(0);


  const featuredRepositories = useMemo(
    () =>
      repositories
        .filter(
          (repository) =>
            repository.featured &&
            repository.homepageFeatured
        )
        .sort(
          (a, b) =>
            a.order - b.order
        ),
    [repositories]
  );


  const total =
    featuredRepositories.length;


  useEffect(() => {
    setActiveIndex((current) =>
      current >= total
        ? 0
        : current
    );
  }, [total]);


  const visibleRepositories =
    useMemo(() => {
      if (!total) {
        return [];
      }

      const count = Math.min(
        4,
        total
      );


      return Array.from(
        { length: count },
        (_, index) =>
          featuredRepositories[
            (activeIndex + index) %
              total
          ]
      );

    }, [
      activeIndex,
      featuredRepositories,
      total,
    ]);


  function changeIndex(direction) {
    if (total <= 1) {
      return;
    }

    setActiveIndex((current) =>
      (current + direction + total) %
      total
    );
  }


  if (loading) {
    return (
      <p className="deck-status">
        Loading repositories...
      </p>
    );
  }


  if (error || total === 0) {
    return (
      <p className="deck-status">
        No featured repositories available.
      </p>
    );
  }


  return (
    <div className="repository-deck">

      <div className="deck-controls">

        <button
          type="button"
          onClick={() => changeIndex(-1)}
          aria-label="Previous repository"
        >
          ←
        </button>


        <span className="deck-counter">
          {activeIndex + 1} / {total}
        </span>


        <button
          type="button"
          onClick={() => changeIndex(1)}
          aria-label="Next repository"
        >
          →
        </button>

      </div>


      <div className="deck-stack">
        {visibleRepositories.map(
          (repository, index) => (
            <div
              key={repository.id}
              className={
                `deck-layer layer-${index}`
              }
            >
              <FeaturedRepositoryCard
                repository={repository}
              />
            </div>
          )
        )}
      </div>

    </div>
  );
}


export default RepositoryDeck;
