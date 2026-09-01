import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import featuredRepositoryConfig from "../data/repositories";
import useRepositories from "../hooks/useRepositories";
import FeaturedRepositoryCard from "./FeaturedRepositoryCard";

const SWIPE_THRESHOLD = 35;
const TRANSITION_DURATION = 680;

function getFeaturedRepositories(repositories) {
  const configByRepository = new Map(
    featuredRepositoryConfig.map((item) => [
      `${item.owner}/${item.repo}`.toLowerCase(),
      item,
    ])
  );

  return repositories
    .map((repository) => {
      if (!repository?.fullName) {
        return null;
      }

      const config = configByRepository.get(
        repository.fullName.toLowerCase()
      );

      return config
        ? { ...repository, ...config }
        : null;
    })
    .filter(
      (repository) =>
        repository?.featured &&
        repository?.homepageFeatured
    )
    .sort(
      (a, b) =>
        (a.order ?? 0) - (b.order ?? 0)
    );
}

function getAdjacentIndex(index, direction, total) {
  return (
    (index + direction + total) % total
  );
}

function RepositoryDeck({ onCountChange }) {
  const { repositories, loading, error } =
    useRepositories();

  const [activeIndex, setActiveIndex] =
    useState(0);
  const [direction, setDirection] =
    useState(0);

  const pointerStart = useRef(null);
  const transitionTimer = useRef(null);

  const featuredRepositories = useMemo(
    () => getFeaturedRepositories(repositories),
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

  useEffect(() => {
    if (total === 0) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex(
      (current) => current % total
    );
  }, [total]);

  function changeIndex(nextDirection) {
    if (total <= 1 || direction !== 0) {
      return;
    }

    setDirection(nextDirection);

    transitionTimer.current = setTimeout(() => {
      setActiveIndex(
        (current) =>
          getAdjacentIndex(
            current,
            nextDirection,
            total
          )
      );

      setDirection(0);
    }, TRANSITION_DURATION);
  }

  function handlePointerDown(event) {
    if (direction !== 0) {
      return;
    }

    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handlePointerUp(event) {
    if (
      !pointerStart.current ||
      direction !== 0
    ) {
      return;
    }

    const { x, y } = pointerStart.current;

    pointerStart.current = null;

    const deltaX = event.clientX - x;
    const deltaY = event.clientY - y;

    const isSwipe =
      Math.abs(deltaX) > SWIPE_THRESHOLD &&
      Math.abs(deltaX) > Math.abs(deltaY);

    if (isSwipe) {
      changeIndex(deltaX < 0 ? 1 : -1);
      return;
    }

    const { left, width } =
      event.currentTarget.getBoundingClientRect();

    changeIndex(
      event.clientX < left + width / 2
        ? -1
        : 1
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

  if (total === 0) {
    return (
      <p className="repository-deck-status">
        No featured repositories available.
      </p>
    );
  }

  const previousIndex = getAdjacentIndex(
    activeIndex,
    -1,
    total
  );

  const nextIndex = getAdjacentIndex(
    activeIndex,
    1,
    total
  );

  const carouselClass =
    direction === -1
      ? "is-previous"
      : direction === 1
        ? "is-next"
        : "";

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
          className={`deck-carousel ${carouselClass}`}
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
