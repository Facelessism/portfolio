import { useEffect, useMemo, useRef, useState } from "react";

import featuredRepositoryConfig from "../data/repositories";
import useRepositories from "../hooks/useRepositories";
import FeaturedRepositoryCard from "./FeaturedRepositoryCard";

const SWIPE_THRESHOLD = 52;
const DRAG_ACTIVATION = 8;
const TRANSITION_DURATION = 460;

function getFeaturedRepositories(repositories) {
  const configByRepository = new Map(
    featuredRepositoryConfig.map((item) => [
      `${item.owner}/${item.repo}`.toLowerCase(),
      item,
    ]),
  );

  return repositories
    .map((repository) => {
      if (!repository?.fullName) return null;

      const config = configByRepository.get(
        repository.fullName.toLowerCase(),
      );

      return config ? { ...repository, ...config } : null;
    })
    .filter(
      (repository) =>
        repository?.featured &&
        repository?.homepageFeatured,
    )
    .sort(
      (a, b) =>
        (a.order ?? 0) - (b.order ?? 0),
    );
}

function getWrappedOffset(index, activeIndex, total) {
  let offset = index - activeIndex;

  if (offset > total / 2) {
    offset -= total;
  }

  if (offset < -total / 2) {
    offset += total;
  }

  return offset;
}

function RepositoryDeck({ onCountChange }) {
  const { repositories, loading, error } = useRepositories();

  const [activeIndex, setActiveIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const stageRef = useRef(null);
  const pointerRef = useRef(null);

  const featuredRepositories = useMemo(
    () => getFeaturedRepositories(repositories),
    [repositories],
  );

  const total = featuredRepositories.length;

  useEffect(() => {
    onCountChange?.(total);
  }, [onCountChange, total]);

  useEffect(() => {
    if (total === 0) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((current) => current % total);
  }, [total]);

  function move(direction) {
    if (total <= 1) return;

    setDragX(0);

    setActiveIndex((current) => {
      const next = current + direction;

      if (next < 0) return total - 1;
      if (next >= total) return 0;

      return next;
    });
  }

  function handlePointerDown(event) {
    if (loading || error || total <= 1) {
      return;
    }

    pointerRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      captured: false,
    };

    setIsDragging(false);
  }

  function handlePointerMove(event) {
    const pointer = pointerRef.current;

    if (!pointer || pointer.id !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - pointer.startX;
    const deltaY = event.clientY - pointer.startY;

    if (
      !pointer.captured &&
      Math.abs(deltaX) < DRAG_ACTIVATION
    ) {
      return;
    }

    if (
      !pointer.captured &&
      Math.abs(deltaY) > Math.abs(deltaX)
    ) {
      pointerRef.current = null;
      return;
    }

    if (!pointer.captured) {
      pointer.captured = true;

      event.currentTarget.setPointerCapture(
        event.pointerId,
      );

      setIsDragging(true);
    }

    const width =
      stageRef.current?.clientWidth || 360;

    const limit = width * 0.34;

    setDragX(
      Math.max(
        -limit,
        Math.min(limit, deltaX),
      ),
    );
  }

  function handlePointerUp(event) {
    const pointer = pointerRef.current;

    if (!pointer || pointer.id !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - pointer.startX;
    const wasCaptured = pointer.captured;

    pointerRef.current = null;

    if (wasCaptured) {
      event.currentTarget.releasePointerCapture?.(
        event.pointerId,
      );
    }

    setIsDragging(false);

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      move(deltaX < 0 ? 1 : -1);
      return;
    }

    setDragX(0);
  }

  function handlePointerCancel(event) {
    if (
      pointerRef.current?.id !== event.pointerId
    ) {
      return;
    }

    pointerRef.current = null;
    setDragX(0);
    setIsDragging(false);
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  }

  if (loading) {
    return (
      <div className="deck-state">
        <span>Loading repositories</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="deck-state">
        <span>Unable to load repositories</span>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="deck-state">
        <span>No featured repositories</span>
      </div>
    );
  }

  const stageWidth =
    stageRef.current?.clientWidth || 1000;

  const dragRatio = dragX / stageWidth;

  return (
    <div
      ref={stageRef}
      className={`deck-stage ${
        isDragging ? "is-dragging" : ""
      }`}
      tabIndex={0}
      role="region"
      aria-label="Featured repository deck"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
    >
      {featuredRepositories.map(
        (repository, index) => {
          const offset = getWrappedOffset(
            index,
            activeIndex,
            total,
          );

          if (Math.abs(offset) > 1) {
            return null;
          }

          const isActive = offset === 0;
          const distance = Math.abs(offset);

          const translateX =
            offset * 100 +
            dragRatio * 100;

          const translateY =
            distance * 17;

          const rotateY =
            offset * -7 +
            (isActive ? dragRatio * -8 : 0);

          const rotateZ =
            offset * -1.4 +
            (isActive ? dragRatio * -3 : 0);

          const scale =
            isActive
              ? 1
              : distance === 1
                ? 0.88
                : 0.8;

          const opacity =
            isActive
              ? 1
              : distance === 1
                ? 0.42
                : 0.2;

          return (
            <div
              key={`${repository.owner}/${repository.repo}`}
              className={`deck-card ${
                isActive ? "is-active" : ""
              } ${
                offset < 0
                  ? "is-previous"
                  : offset > 0
                    ? "is-next"
                    : ""
              }`}
              style={{
                transform: `
                  translate3d(
                    calc(-50% + ${translateX}%),
                    calc(-50% + ${translateY}px),
                    ${isActive ? "30px" : "0"}
                  )
                  perspective(1200px)
                  rotateY(${rotateY}deg)
                  rotateZ(${rotateZ}deg)
                  scale(${scale})
                `,
                opacity,
                zIndex: 20 - distance,
                transition: isDragging
                  ? "none"
                  : `
                    transform
                    ${TRANSITION_DURATION}ms
                    var(--ease-emphasized),
                    opacity
                    ${TRANSITION_DURATION}ms
                    var(--ease-standard)
                  `,
              }}
              aria-hidden={!isActive}
            >
              <FeaturedRepositoryCard
                repository={repository}
              />
            </div>
          );
        },
      )}

      <span
        className="deck-live-status"
        aria-live="polite"
      >
        <span className="deck-live-dot" />
        {String(activeIndex + 1).padStart(2, "0")}
        {" / "}
        {String(total).padStart(2, "0")}
      </span>

      <div className="deck-progress" aria-hidden="true">
        {featuredRepositories.map((repository, index) => (
          <span
            key={`${repository.owner}-${repository.repo}-progress`}
            className={
              index === activeIndex
                ? "is-active"
                : ""
            }
          />
        ))}
      </div>
    </div>
  );
}

export default RepositoryDeck;
