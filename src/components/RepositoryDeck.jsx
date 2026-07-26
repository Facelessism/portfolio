import { useMemo, useState } from "react";

import useRepositories from "../hooks/useRepositories";
import RepositoryCard from "./RepositoryCard";

function RepositoryDeck() {
  const {
    repositories,
    loading,
    error,
  } = useRepositories();

  const [activeIndex, setActiveIndex] = useState(0);

  const featuredRepositories = useMemo(() => {
    return repositories
      .filter(
        (repository) =>
          repository.featured &&
          repository.homepageFeatured
      )
      .sort((a, b) => a.order - b.order);
  }, [repositories]);

  const totalRepositories = featuredRepositories.length;

  const visibleRepositories = useMemo(() => {
    if (totalRepositories === 0) {
      return [];
    }

    const visibleCount = Math.min(
      4,
      totalRepositories
    );

    return Array.from(
      { length: visibleCount },
      (_, offset) =>
        featuredRepositories[
          (activeIndex + offset) %
            totalRepositories
        ]
    );
  }, [
    activeIndex,
    featuredRepositories,
    totalRepositories,
  ]);

  function nextCard() {
    if (totalRepositories <= 1) {
      return;
    }

    setActiveIndex((current) =>
      (current + 1) % totalRepositories
    );
  }

  function previousCard() {
    if (totalRepositories <= 1) {
      return;
    }

    setActiveIndex((current) =>
      (current - 1 + totalRepositories) %
      totalRepositories
    );
  }

  if (loading) {
    return (
      <p className="deck-status">
        Loading repositories...
      </p>
    );
  }

  if (error) {
    return (
      <p className="deck-status">
        Unable to load repositories.
      </p>
    );
  }

  if (totalRepositories === 0) {
    return (
      <p className="deck-status">
        No featured repositories found.
      </p>
    );
  }

  return (
    <div className="repository-deck">
      <div className="deck-controls">
        <button
          type="button"
          onClick={previousCard}
          aria-label="Previous repository"
        >
          ↑
        </button>

        <span className="deck-counter">
          {activeIndex + 1} / {totalRepositories}
        </span>

        <button
          type="button"
          onClick={nextCard}
          aria-label="Next repository"
        >
          ↓
        </button>
      </div>

      <div className="deck-stack">
        {visibleRepositories.map(
          (repository, index) => (
            <div
              key={repository.id}
              className={`deck-layer layer-${index}`}
            >
              <RepositoryCard
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
