import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import useRepositories from "../hooks/useRepositories";
import FeaturedRepositoryCard from "./FeaturedRepositoryCard";

function RepositoryDeck({ onCountChange }) {
  const { repositories, loading, error } = useRepositories();

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const pointerStart = useRef(null);
  const transitionTimer = useRef(null);

  const featuredRepositories = useMemo(
    () =>
      repositories
        .filter(
          (repository) =>
            repository.featured &&
            repository.homepageFeatured
        )
        .sort((a, b) => a.order - b.order),
    [repositories]
  );

  const total = featuredRepositories.length;

  useEffect(() => {
    onCountChange?.(total);
  }, [onCountChange, total]);

  useEffect(() => {
    return () => {
      clearTimeout(transitionTimer.current);
    };
  }, []);

  function changeIndex(nextDirection) {
    if (total <= 1 || direction !== 0) return;

    setDirection(nextDirection);

    transitionTimer.current = setTimeout(() => {
      setActiveIndex(
        (current) =>
          (current + nextDirection + total) % total
      );

      setDirection(0);
    }, 680);
  }

  function handlePointerDown(event) {
    if (direction !== 0) return;

    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handlePointerUp(event) {
    if (!pointerStart.current || direction !== 0) {
      return;
    }

    const start = pointerStart.current;
    pointerStart.current = null;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (
      Math.abs(deltaX) > 35 &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      changeIndex(deltaX < 0 ? 1 : -1);
      return;
    }

    const { left, width } =
      event.currentTarget.getBoundingClientRect();

    changeIndex(
      event.clientX < left + width / 2 ? -1 : 1
    );
  }

  if (loading) {
    return (
      <p className="repository-deck-status">
        Loading repositories...
      </p>
    );
  }

  if (error) {
    return (
      <p className="repository-deck-status">
        Unable to load featured repositories.
      </p>
    );
  }

  if (!total) {
    return (
      <p className="repository-deck-status">
        No featured repositories available.
      </p>
    );
  }

  const previousIndex =
    (activeIndex - 1 + total) % total;

  const nextIndex =
    (activeIndex + 1) % total;

  return (
    <div className="repository-deck">
      <div
        className="deck-stage"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        role="group"
        aria-label="Featured repositories"
      >
        <div
          className={`deck-carousel ${
            direction === -1
              ? "is-previous"
              : direction === 1
                ? "is-next"
                : ""
          }`}
        >
          <div className="deck-card deck-card-previous">
            <FeaturedRepositoryCard
              repository={
                featuredRepositories[previousIndex]
              }
            />
          </div>

          <div className="deck-card deck-card-active">
            <FeaturedRepositoryCard
              repository={
                featuredRepositories[activeIndex]
              }
            />
          </div>

          <div className="deck-card deck-card-next">
            <FeaturedRepositoryCard
              repository={
                featuredRepositories[nextIndex]
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepositoryDeck;
