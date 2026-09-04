import { useMemo, useRef, useState } from "react";

import StatsSectionHeader from "./StatsSectionHeader";

const WIDTH = 1000;
const HEIGHT = 500;

const PAD_LEFT = 76;
const PAD_RIGHT = 28;
const PAD_TOP = 34;
const PAD_BOTTOM = 64;

const MAX_REPOSITORIES = 14;
const MIN_ZOOM_WEEKS = 4;

const MODES = [
  ["all", "ALL"],
  ["source", "SOURCE"],
  ["forks", "FORKS"],
];

const METRICS = [
  ["commits", "COMMITS"],
  ["churn", "CHURN"],
];

const COLORS = [
  "#7dd3fc",
  "#a78bfa",
  "#f9a8d4",
  "#86efac",
  "#fcd34d",
  "#fb923c",
  "#67e8f9",
  "#c4b5fd",
  "#fda4af",
  "#bef264",
  "#fde68a",
  "#93c5fd",
  "#d8b4fe",
  "#5eead4",
];

const WEEK_MS =
  7 * 24 * 60 * 60 * 1000;

function timestamp(value) {
  return new Date(value).getTime();
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(
    value || 0,
  );
}

function formatDate(value) {
  if (!value) return "";

  return new Date(value).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAxisDate(value, compact) {
  if (!value) return "";

  return new Date(value).toLocaleDateString([], {
    day: compact ? "numeric" : undefined,
    month: "short",
    year: compact ? undefined : "numeric",
  });
}

function formatAxisValue(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }

  return formatNumber(value);
}

function getMetricValue(entry, metric) {
  if (!entry) return 0;

  return metric === "churn"
    ? entry.churn || 0
    : entry.commits || 0;
}

function niceMax(value) {
  if (value <= 1) return 1;

  const magnitude =
    10 ** Math.floor(Math.log10(value));

  const normalized = value / magnitude;

  if (normalized <= 1) {
    return magnitude;
  }

  if (normalized <= 2) {
    return 2 * magnitude;
  }

  if (normalized <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
}

function getColor(index) {
  return COLORS[index % COLORS.length];
}

function buildPath(points) {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
    )
    .join(" ");
}

function getCandidates(
  evolution,
  repositories,
  mode,
  metric,
) {
  const repositoryMap = new Map(
    repositories.map((repository) => [
      repository.fullName,
      repository,
    ]),
  );

  return evolution
    .map((history) => ({
      ...history,
      repository:
        repositoryMap.get(history.fullName) ||
        history,
    }))
    .filter(
      (history) =>
        history.series?.length,
    )
    .filter((history) => {
      if (mode === "source") {
        return !history.repository.fork;
      }

      if (mode === "forks") {
        return history.repository.fork;
      }

      return true;
    })
    .sort((a, b) => {
      const first =
        metric === "commits"
          ? a.totalCommits || 0
          : a.totalChurn || 0;

      const second =
        metric === "commits"
          ? b.totalCommits || 0
          : b.totalChurn || 0;

      return second - first;
    })
    .slice(0, MAX_REPOSITORIES);
}

function getTimeline(candidates) {
  return [...new Set(
    candidates.flatMap((repository) =>
      repository.series.map(
        (entry) => entry.week,
      ),
    ),
  )].sort(
    (a, b) =>
      timestamp(a) - timestamp(b),
  );
}

function getVisibleTimeline(
  timeline,
  domain,
) {
  return timeline.filter((week) => {
    const value = timestamp(week);

    return (
      value >= domain[0] &&
      value <= domain[1]
    );
  });
}

function getAxisTicks(maxValue) {
  return [4, 3, 2, 1, 0].map(
    (position) =>
      (maxValue / 4) * position,
  );
}

function getDateTicks(timeline, domain) {
  const visible =
    getVisibleTimeline(
      timeline,
      domain,
    );

  if (visible.length <= 6) {
    return visible;
  }

  const count = 6;
  const step =
    (visible.length - 1) /
    (count - 1);

  return Array.from(
    { length: count },
    (_, index) =>
      visible[
        Math.round(index * step)
      ],
  );
}

function clamp(value, min, max) {
  return Math.min(
    Math.max(value, min),
    max,
  );
}

function getDomainX(
  value,
  domain,
) {
  const span = Math.max(
    domain[1] - domain[0],
    1,
  );

  return (
    PAD_LEFT +
    ((value - domain[0]) /
      span) *
      (WIDTH -
        PAD_LEFT -
        PAD_RIGHT)
  );
}

function getDomainValue(
  x,
  domain,
) {
  const usableWidth =
    WIDTH -
    PAD_LEFT -
    PAD_RIGHT;

  const ratio = clamp(
    (x - PAD_LEFT) /
      usableWidth,
    0,
    1,
  );

  return (
    domain[0] +
    ratio *
      (domain[1] - domain[0])
  );
}

function getPoints(
  repository,
  timeline,
  domain,
  maxValue,
  metric,
) {
  const entries = new Map(
    repository.series.map(
      (entry) => [
        entry.week,
        entry,
      ],
    ),
  );

  return getVisibleTimeline(
    timeline,
    domain,
  ).map((week) => {
    const entry = entries.get(week);
    const value = getMetricValue(
      entry,
      metric,
    );

    const x = getDomainX(
      timestamp(week),
      domain,
    );

    const usableHeight =
      HEIGHT -
      PAD_TOP -
      PAD_BOTTOM;

    const y =
      HEIGHT -
      PAD_BOTTOM -
      (value /
        Math.max(maxValue, 1)) *
        usableHeight;

    return {
      x,
      y,
      week,
      value,
      weeklyCommits:
        entry?.weeklyCommits || 0,
      additions:
        entry?.additions || 0,
      deletions:
        entry?.deletions || 0,
      churn:
        entry?.churn || 0,
    };
  });
}

function findNearestWeek(
  timeline,
  value,
) {
  if (!timeline.length) {
    return null;
  }

  let nearest =
    timeline[0];

  let distance = Math.abs(
    timestamp(nearest) -
      value,
  );

  for (const week of timeline) {
    const nextDistance =
      Math.abs(
        timestamp(week) -
          value,
      );

    if (nextDistance < distance) {
      nearest = week;
      distance = nextDistance;
    }
  }

  return nearest;
}

function findNearestRepository(
  repositories,
  week,
  pointerY,
) {
  let nearest = null;
  let distance = Infinity;

  for (const repository of repositories) {
    const point =
      repository.points.find(
        (item) =>
          item.week === week,
      );

    if (!point) continue;

    const currentDistance =
      Math.abs(
        point.y - pointerY,
      );

    if (
      currentDistance <
      distance
    ) {
      distance = currentDistance;
      nearest = repository;
    }
  }

  return nearest;
}

function RepositoryEvolution({
  evolution = [],
  repositories = [],
}) {
  const [mode, setMode] =
    useState("all");

  const [metric, setMetric] =
    useState("commits");

  const [
    selectedRepository,
    setSelectedRepository,
  ] = useState(null);

  const [
    hoveredRepository,
    setHoveredRepository,
  ] = useState(null);

  const [hoveredWeek, setHoveredWeek] =
    useState(null);

  const [zoomDomain, setZoomDomain] =
    useState(null);

  const dragRef =
    useRef(null);

  const candidates = useMemo(
    () =>
      getCandidates(
        evolution,
        repositories,
        mode,
        metric,
      ),
    [
      evolution,
      repositories,
      mode,
      metric,
    ],
  );

  const timeline = useMemo(
    () =>
      getTimeline(candidates),
    [candidates],
  );

  const fullDomain = useMemo(
    () => {
      if (!timeline.length) {
        return [0, 1];
      }

      return [
        timestamp(timeline[0]),
        timestamp(
          timeline.at(-1),
        ),
      ];
    },
    [timeline],
  );

  const domain =
    zoomDomain || fullDomain;

  const visibleTimeline =
    useMemo(
      () =>
        getVisibleTimeline(
          timeline,
          domain,
        ),
      [timeline, domain],
    );

  const selectedData =
    candidates.find(
      (repository) =>
        repository.fullName ===
        selectedRepository,
    );

  const maxValue = useMemo(() => {
    const values =
      candidates.flatMap(
        (repository) =>
          repository.series
            .filter((entry) => {
              const value =
                timestamp(
                  entry.week,
                );

              return (
                value >= domain[0] &&
                value <= domain[1]
              );
            })
            .map((entry) =>
              getMetricValue(
                entry,
                metric,
              ),
            ),
      );

    if (
      selectedData
    ) {
      const selectedValues =
        selectedData.series
          .filter((entry) => {
            const value =
              timestamp(
                entry.week,
              );

            return (
              value >= domain[0] &&
              value <= domain[1]
            );
          })
          .map((entry) =>
            getMetricValue(
              entry,
              metric,
            ),
          );

      return niceMax(
        Math.max(
          ...selectedValues,
          1,
        ),
      );
    }

    return niceMax(
      Math.max(
        ...values,
        1,
      ),
    );
  }, [
    candidates,
    selectedData,
    domain,
    metric,
  ]);

  const repositoryPoints =
    useMemo(
      () =>
        candidates.map(
          (
            repository,
            index,
          ) => ({
            ...repository,
            color:
              getColor(index),
            points:
              getPoints(
                repository,
                timeline,
                domain,
                maxValue,
                metric,
              ),
          }),
        ),
      [
        candidates,
        timeline,
        domain,
        maxValue,
        metric,
      ],
    );

  const visibleRepositories =
    selectedRepository
      ? repositoryPoints.filter(
          (repository) =>
            repository.fullName ===
            selectedRepository,
        )
      : repositoryPoints;

  const activeRepository =
    repositoryPoints.find(
      (repository) =>
        repository.fullName ===
        hoveredRepository,
    ) ||
    selectedData;

  const hoveredPoint =
    activeRepository &&
    hoveredWeek
      ? activeRepository.points.find(
          (point) =>
            point.week ===
            hoveredWeek,
        )
      : null;

  const dateTicks =
    getDateTicks(
      timeline,
      domain,
    );

  function resetInteraction() {
    setHoveredRepository(
      null,
    );
    setHoveredWeek(null);
  }

  function handleMetricChange(
    nextMetric,
  ) {
    setMetric(nextMetric);
    setSelectedRepository(null);
    resetInteraction();
  }

  function handleModeChange(
    nextMode,
  ) {
    setMode(nextMode);
    setSelectedRepository(null);
    resetInteraction();
  }

  function toggleRepository(
    fullName,
  ) {
    setSelectedRepository(
      (current) =>
        current === fullName
          ? null
          : fullName,
    );

    setHoveredRepository(
      null,
    );
    setHoveredWeek(null);
  }

  function getPointerPosition(
    event,
  ) {
    const svg =
      event.currentTarget;

    const rect =
      svg.getBoundingClientRect();

    const scaleX =
      WIDTH / rect.width;

    const scaleY =
      HEIGHT / rect.height;

    return {
      x:
        (event.clientX -
          rect.left) *
        scaleX,
      y:
        (event.clientY -
          rect.top) *
        scaleY,
    };
  }

  function handlePointerMove(
    event,
  ) {
    const {
      x,
      y,
    } = getPointerPosition(event);

    if (dragRef.current) {
      const {
        startX,
        startDomain,
      } = dragRef.current;

      const rect =
        event.currentTarget.getBoundingClientRect();

      const pixelsPerViewBox =
        rect.width / WIDTH;

      const deltaX =
        (event.clientX -
          startX) /
        pixelsPerViewBox;

      const timeSpan =
        startDomain[1] -
        startDomain[0];

      const timeDelta =
        (deltaX /
          (WIDTH -
            PAD_LEFT -
            PAD_RIGHT)) *
        timeSpan;

      const span =
        startDomain[1] -
        startDomain[0];

      let nextStart =
        startDomain[0] -
        timeDelta;

      let nextEnd =
        startDomain[1] -
        timeDelta;

      if (
        nextStart <
        fullDomain[0]
      ) {
        nextStart =
          fullDomain[0];
        nextEnd =
          nextStart + span;
      }

      if (
        nextEnd >
        fullDomain[1]
      ) {
        nextEnd =
          fullDomain[1];
        nextStart =
          nextEnd - span;
      }

      setZoomDomain([
        nextStart,
        nextEnd,
      ]);

      return;
    }

    const value =
      getDomainValue(
        x,
        domain,
      );

    const week =
      findNearestWeek(
        visibleTimeline,
        value,
      );

    if (!week) {
      resetInteraction();
      return;
    }

    const repository =
      findNearestRepository(
        visibleRepositories,
        week,
        y,
      );

    setHoveredWeek(week);
    setHoveredRepository(
      repository?.fullName ||
        null,
    );
  }

  function handlePointerDown(
    event,
  ) {
    if (event.button !== 0) {
      return;
    }

    if (
      !zoomDomain ||
      fullDomain[1] -
        fullDomain[0] <=
        WEEK_MS *
          MIN_ZOOM_WEEKS
    ) {
      return;
    }

    dragRef.current = {
      startX:
        event.clientX,
      startDomain: domain,
    };

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  }

  function handlePointerUp(
    event,
  ) {
    dragRef.current = null;

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }
  }

  function handlePointerLeave() {
    if (!dragRef.current) {
      resetInteraction();
    }
  }

  function handleWheel(event) {
    if (!timeline.length) {
      return;
    }

    event.preventDefault();

    const {
      x,
    } = getPointerPosition(event);

    const pointerTime =
      getDomainValue(
        x,
        domain,
      );

    const currentSpan =
      domain[1] -
      domain[0];

    const fullSpan =
      fullDomain[1] -
      fullDomain[0];

    if (fullSpan <= 0) {
      return;
    }

    const minimumSpan =
      Math.max(
        WEEK_MS *
          MIN_ZOOM_WEEKS,
        fullSpan /
          Math.max(
            timeline.length,
            MIN_ZOOM_WEEKS,
          ),
      );

    const factor =
      event.deltaY > 0
        ? 1.25
        : .8;

    const nextSpan = clamp(
      currentSpan * factor,
      minimumSpan,
      fullSpan,
    );

    if (
      nextSpan >=
      fullSpan * .999
    ) {
      setZoomDomain(null);
      return;
    }

    const ratio =
      (pointerTime -
        domain[0]) /
      Math.max(
        currentSpan,
        1,
      );

    let nextStart =
      pointerTime -
      ratio * nextSpan;

    let nextEnd =
      nextStart +
      nextSpan;

    if (
      nextStart <
      fullDomain[0]
    ) {
      nextStart =
        fullDomain[0];
      nextEnd =
        nextStart + nextSpan;
    }

    if (
      nextEnd >
      fullDomain[1]
    ) {
      nextEnd =
        fullDomain[1];
      nextStart =
        nextEnd - nextSpan;
    }

    setZoomDomain([
      nextStart,
      nextEnd,
    ]);
  }

  return (
    <section
      className="repository-evolution"
      aria-labelledby="repository-evolution-title"
    >
      <StatsSectionHeader
        number="02"
        title="Repository Evolution"
        description="Cumulative commits and weekly code churn aligned across one shared contribution timeline."
      />

      <div className="repository-evolution-toolbar">
        <div className="repository-evolution-control-group">
          <span>Metric</span>

          {METRICS.map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                className={
                  metric === value
                    ? "is-active"
                    : ""
                }
                onClick={() =>
                  handleMetricChange(
                    value,
                  )
                }
              >
                {label}
              </button>
            ),
          )}
        </div>

        <div className="repository-evolution-control-group">
          <span>Scope</span>

          {MODES.map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                className={
                  mode === value
                    ? "is-active"
                    : ""
                }
                onClick={() =>
                  handleModeChange(
                    value,
                  )
                }
              >
                {label}
              </button>
            ),
          )}
        </div>

        {zoomDomain && (
          <button
            type="button"
            className="repository-evolution-reset"
            onClick={() =>
              setZoomDomain(null)
            }
          >
            RESET ZOOM
          </button>
        )}
      </div>

      {selectedData && (
        <div
          className="repository-evolution-selected"
          style={{
            "--repo-color":
              repositoryPoints.find(
                (repository) =>
                  repository.fullName ===
                  selectedRepository,
              )?.color ||
              "var(--color-text)",
          }}
        >
          <span className="repository-evolution-selected-dot" />

          <strong>
            {selectedData.repository.name}
          </strong>

          <span>
            {formatNumber(
              selectedData.totalCommits,
            )}{" "}
            cumulative commits
          </span>

          <span>
            {formatNumber(
              selectedData.totalChurn,
            )}{" "}
            total changes
          </span>

          <button
            type="button"
            onClick={() =>
              setSelectedRepository(
                null,
              )
            }
          >
            CLEAR
          </button>
        </div>
      )}

      {repositoryPoints.length ? (
        <div
          className={`repository-evolution-chart ${
            dragRef.current
              ? "is-panning"
              : ""
          }`}
          onWheel={handleWheel}
        >
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={`Repository evolution by ${metric}`}
            onPointerMove={
              handlePointerMove
            }
            onPointerDown={
              handlePointerDown
            }
            onPointerUp={
              handlePointerUp
            }
            onPointerCancel={
              handlePointerUp
            }
            onPointerLeave={
              handlePointerLeave
            }
          >
            {getAxisTicks(
              maxValue,
            ).map(
              (value, index) => {
                const y =
                  PAD_TOP +
                  (index / 4) *
                    (HEIGHT -
                      PAD_TOP -
                      PAD_BOTTOM);

                return (
                  <g
                    key={`y-${index}`}
                  >
                    <line
                      x1={PAD_LEFT}
                      y1={y}
                      x2={
                        WIDTH -
                        PAD_RIGHT
                      }
                      y2={y}
                      className="repository-evolution-gridline"
                    />

                    <text
                      x={
                        PAD_LEFT - 12
                      }
                      y={y + 4}
                      textAnchor="end"
                      className="repository-evolution-axis-value"
                    >
                      {formatAxisValue(
                        value,
                      )}
                    </text>
                  </g>
                );
              },
            )}

            {dateTicks.map(
              (week) => {
                const x =
                  getDomainX(
                    timestamp(week),
                    domain,
                  );

                return (
                  <g
                    key={week}
                  >
                    <line
                      x1={x}
                      y1={PAD_TOP}
                      x2={x}
                      y2={
                        HEIGHT -
                        PAD_BOTTOM
                      }
                      className="repository-evolution-weekline"
                    />

                    <text
                      x={x}
                      y={
                        HEIGHT -
                        PAD_BOTTOM +
                        25
                      }
                      textAnchor="middle"
                      className="repository-evolution-axis-value repository-evolution-axis-date"
                    >
                      {formatAxisDate(
                        week,
                        domain[1] -
                          domain[0] <
                          fullDomain[1] -
                            fullDomain[0] *
                              .45,
                      )}
                    </text>
                  </g>
                );
              },
            )}

            <text
              x="16"
              y={
                HEIGHT / 2
              }
              textAnchor="middle"
              transform={`rotate(-90 16 ${
                HEIGHT / 2
              })`}
              className="repository-evolution-axis-title"
            >
              {metric === "commits"
                ? "CUMULATIVE COMMITS"
                : "WEEKLY CHURN"}
            </text>

            <text
              x={
                WIDTH / 2
              }
              y={
                HEIGHT - 12
              }
              textAnchor="middle"
              className="repository-evolution-axis-title"
            >
              CONTRIBUTION WEEK
            </text>

            {visibleRepositories.map(
              (repository) => {
                const isSelected =
                  selectedRepository ===
                  repository.fullName;

                const isHovered =
                  hoveredRepository ===
                  repository.fullName;

                const isActive =
                  !selectedRepository ||
                  isSelected ||
                  isHovered;

                return (
                  <path
                    key={
                      repository.fullName
                    }
                    d={buildPath(
                      repository.points,
                    )}
                    className={`repository-evolution-line ${
                      isActive
                        ? "is-active"
                        : "is-muted"
                    } ${
                      isHovered
                        ? "is-hovered"
                        : ""
                    } ${
                      isSelected
                        ? "is-selected"
                        : ""
                    }`}
                    style={{
                      "--repo-color":
                        repository.color,
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${repository.repository.name} evolution`}
                    onClick={(event) => {
                      event.stopPropagation();

                      toggleRepository(
                        repository.fullName,
                      );
                    }}
                    onFocus={() =>
                      setHoveredRepository(
                        repository.fullName,
                      )
                    }
                    onBlur={() =>
                      setHoveredRepository(
                        null,
                      )
                    }
                  />
                );
              },
            )}

            {hoveredWeek && (
              <line
                x1={getDomainX(
                  timestamp(
                    hoveredWeek,
                  ),
                  domain,
                )}
                y1={PAD_TOP}
                x2={getDomainX(
                  timestamp(
                    hoveredWeek,
                  ),
                  domain,
                )}
                y2={
                  HEIGHT -
                  PAD_BOTTOM
                }
                className="repository-evolution-crosshair"
              />
            )}

            {hoveredPoint &&
              activeRepository && (
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="5"
                  className="repository-evolution-focus-point"
                  style={{
                    "--repo-color":
                      repositoryPoints.find(
                        (repository) =>
                          repository.fullName ===
                          activeRepository.fullName,
                      )?.color ||
                      "var(--color-text)",
                  }}
                />
              )}
          </svg>

          {hoveredWeek &&
            activeRepository &&
            hoveredPoint && (
              <div className="repository-evolution-tooltip">
                <div className="repository-evolution-tooltip-date">
                  {formatDate(
                    hoveredWeek,
                  )}
                </div>

                <div className="repository-evolution-tooltip-name">
                  <i
                    style={{
                      background:
                        repositoryPoints.find(
                          (repository) =>
                            repository.fullName ===
                            activeRepository.fullName,
                        )?.color,
                    }}
                  />

                  {activeRepository.repository.name}
                </div>

                <div className="repository-evolution-tooltip-grid">
                  <span>
                    <strong>
                      {formatNumber(
                        hoveredPoint.value,
                      )}
                    </strong>
                    {metric ===
                    "commits"
                      ? " cumulative commits"
                      : " weekly churn"}
                  </span>

                  <span>
                    <strong>
                      {formatNumber(
                        hoveredPoint.weeklyCommits,
                      )}
                    </strong>
                    {" commits this week"}
                  </span>

                  <span>
                    <strong>
                      +
                      {formatNumber(
                        hoveredPoint.additions,
                      )}
                    </strong>
                    {" additions"}
                  </span>

                  <span>
                    <strong>
                      −
                      {formatNumber(
                        hoveredPoint.deletions,
                      )}
                    </strong>
                    {" deletions"}
                  </span>

                  <span>
                    <strong>
                      {formatNumber(
                        hoveredPoint.churn,
                      )}
                    </strong>
                    {" total churn"}
                  </span>
                </div>
              </div>
            )}

          {zoomDomain && (
            <div className="repository-evolution-zoom-label">
              {formatDate(
                zoomDomain[0],
              )}{" "}
              →{" "}
              {formatDate(
                zoomDomain[1],
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="github-stats-state">
          No contribution history is available for
          this filter.
        </div>
      )}

      <div className="repository-evolution-help">
        <span>
          HOVER TO INSPECT
        </span>

        <span>
          CLICK A REPOSITORY TO ISOLATE
        </span>

        <span>
          SCROLL TO ZOOM
        </span>

        <span>
          DRAG TO PAN
        </span>
      </div>

      <div className="repository-evolution-legend">
        {repositoryPoints.map(
          (repository) => (
            <button
              key={
                repository.fullName
              }
              type="button"
              className={
                selectedRepository ===
                repository.fullName
                  ? "is-active"
                  : ""
              }
              style={{
                "--repo-color":
                  repository.color,
              }}
              onClick={() =>
                toggleRepository(
                  repository.fullName,
                )
              }
              onMouseEnter={() =>
                setHoveredRepository(
                  repository.fullName,
                )
              }
              onMouseLeave={() =>
                setHoveredRepository(
                  null,
                )
              }
              onFocus={() =>
                setHoveredRepository(
                  repository.fullName,
                )
              }
              onBlur={() =>
                setHoveredRepository(
                  null,
                )
              }
            >
              <span className="repository-evolution-dot" />

              <span>
                {
                  repository.repository
                    .name
                }
              </span>

              {selectedRepository ===
                repository.fullName && (
                <small>
                  selected
                </small>
              )}
            </button>
          ),
        )}
      </div>
    </section>
  );
}

export default RepositoryEvolution;
