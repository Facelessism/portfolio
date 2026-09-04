import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import StatsSectionHeader from "./StatsSectionHeader";

const WIDTH = 1200;
const HEIGHT = 360;

const PAD = {
  top: 30,
  right: 24,
  bottom: 42,
  left: 48,
};

const DEFAULT_WINDOW = 90;
const MIN_WINDOW = 7;
const MAX_WINDOW = 364;

const ZOOM_PRESETS = [
  {
    label: "1Y",
    days: 364,
  },
  {
    label: "6M",
    days: 182,
  },
  {
    label: "90D",
    days: 90,
  },
  {
    label: "30D",
    days: 30,
  },
  {
    label: "14D",
    days: 14,
  },
];

function formatNumber(value) {
  return new Intl.NumberFormat().format(
    value || 0,
  );
}

function formatDate(value, options = {}) {
  return new Date(value).toLocaleDateString(
    [],
    {
      day: "2-digit",
      month: "short",
      ...options,
    },
  );
}

function formatLongDate(value) {
  return new Date(value).toLocaleDateString(
    [],
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}

function clamp(value, min, max) {
  return Math.min(
    Math.max(value, min),
    max,
  );
}

function getNiceMax(value) {
  if (value <= 5) return 5;
  if (value <= 10) return 10;
  if (value <= 20) return 20;
  if (value <= 50) return 50;
  if (value <= 100) return 100;

  const magnitude = Math.pow(
    10,
    Math.floor(Math.log10(value)),
  );

  return Math.ceil(
    value / magnitude,
  ) * magnitude;
}

function buildGeometry(days, maxCommits) {
  if (!days.length) {
    return [];
  }

  const usableWidth =
    WIDTH -
    PAD.left -
    PAD.right;

  const usableHeight =
    HEIGHT -
    PAD.top -
    PAD.bottom;

  const step =
    usableWidth /
    Math.max(days.length - 1, 1);

  const repositoryMax = Math.max(
    ...days.map(
      (day) =>
        day.repositoryCount || 0,
    ),
    1,
  );

  return days.map((day, index) => {
    const x =
      days.length === 1
        ? WIDTH / 2
        : PAD.left + index * step;

    const commits =
      day.commits || 0;

    const commitRatio =
      commits /
      Math.max(maxCommits, 1);

    const repositoryRatio =
      (day.repositoryCount || 0) /
      repositoryMax;

    return {
      ...day,
      x,
      step,
      commitY:
        HEIGHT -
        PAD.bottom -
        commitRatio *
          usableHeight,
      repositoryY:
        HEIGHT -
        PAD.bottom -
        repositoryRatio *
          usableHeight,
      barHeight:
        commits > 0
          ? Math.max(
              2,
              commitRatio *
                usableHeight,
            )
          : 1,
    };
  });
}

function buildLinePath(
  geometry,
  maxCommits,
) {
  if (!geometry.length) {
    return "";
  }

  const usableHeight =
    HEIGHT -
    PAD.top -
    PAD.bottom;

  return geometry
    .map((point, index) => {
      const value =
        point.commits || 0;

      const y =
        HEIGHT -
        PAD.bottom -
        (value /
          Math.max(
            maxCommits,
            1,
          )) *
          usableHeight;

      return `${
        index === 0 ? "M" : "L"
      } ${point.x} ${y}`;
    })
    .join(" ");
}

function getDateIndex(days, date) {
  if (!days.length || !date) {
    return -1;
  }

  return days.findIndex(
    (day) => day.date === date,
  );
}

function getDateFromPointer(
  event,
  svg,
  geometry,
) {
  if (!geometry.length) {
    return null;
  }

  const rect =
    svg.getBoundingClientRect();

  const scaleX =
    WIDTH / rect.width;

  const x =
    (event.clientX - rect.left) *
    scaleX;

  const first =
    geometry[0].x;

  const step =
    geometry[0].step ||
    WIDTH;

  const index = clamp(
    Math.round(
      (x - first) /
        Math.max(step, 1),
    ),
    0,
    geometry.length - 1,
  );

  return geometry[index]?.date || null;
}

function ContributionPulse({
  stats,
}) {
  const allDays =
    stats.contributionPulse?.days ||
    [];

  const repositoryOptions =
    stats.contributionPulse
      ?.repositories || [];

  const [windowSize, setWindowSize] =
    useState(
      Math.min(
        DEFAULT_WINDOW,
        allDays.length || DEFAULT_WINDOW,
      ),
    );

  const [windowEnd, setWindowEnd] =
    useState(
      Math.max(
        allDays.length - 1,
        0,
      ),
    );

  const [
    repositoryFilter,
    setRepositoryFilter,
  ] = useState("all");

  const [hoveredDate, setHoveredDate] =
    useState(null);

  const [selectedDate, setSelectedDate] =
    useState(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const dragRef = useRef({
    startX: 0,
    startEnd: 0,
    moved: false,
  });

  const svgRef = useRef(null);

  useEffect(() => {
    if (!allDays.length) {
      setWindowEnd(0);
      return;
    }

    const maxEnd =
      allDays.length - 1;

    const minEnd = Math.min(
      windowSize - 1,
      maxEnd,
    );

    setWindowEnd((current) =>
      clamp(
        current,
        minEnd,
        maxEnd,
      ),
    );
  }, [
    allDays.length,
    windowSize,
  ]);

  const filteredDays = useMemo(() => {
    if (
      repositoryFilter === "all"
    ) {
      return allDays;
    }

    return allDays.map((day) => {
      const repositories =
        (day.repositories || []).filter(
          (repository) =>
            repository.fullName ===
            repositoryFilter,
        );

      const commits =
        repositories.reduce(
          (total, repository) =>
            total +
            (repository.commits || 0),
          0,
        );

      return {
        ...day,
        commits,
        repositoryCount:
          repositories.length,
        repositories,
      };
    });
  }, [
    allDays,
    repositoryFilter,
  ]);

  const visibleDays = useMemo(() => {
    if (!filteredDays.length) {
      return [];
    }

    const end = clamp(
      windowEnd,
      0,
      filteredDays.length - 1,
    );

    const start = Math.max(
      0,
      end - windowSize + 1,
    );

    return filteredDays.slice(
      start,
      end + 1,
    );
  }, [
    filteredDays,
    windowEnd,
    windowSize,
  ]);

  const maxCommits = useMemo(
    () =>
      getNiceMax(
        Math.max(
          ...visibleDays.map(
            (day) =>
              day.commits || 0,
          ),
          1,
        ),
      ),
    [visibleDays],
  );

  const geometry = useMemo(
    () =>
      buildGeometry(
        visibleDays,
        maxCommits,
      ),
    [
      visibleDays,
      maxCommits,
    ],
  );

  const hoveredPoint =
    hoveredDate
      ? geometry.find(
          (point) =>
            point.date ===
            hoveredDate,
        ) || null
      : null;

  const selectedPoint =
    selectedDate
      ? geometry.find(
          (point) =>
            point.date ===
            selectedDate,
        ) || null
      : null;

  const inspectorPoint =
    hoveredPoint ||
    selectedPoint ||
    null;

  const inspectorPinned =
    Boolean(selectedPoint);

  const inspectorRepositories =
    inspectorPoint?.repositories ||
    [];

  const totals = useMemo(
    () =>
      visibleDays.reduce(
        (total, day) => ({
          commits:
            total.commits +
            (day.commits || 0),
          activeDays:
            total.activeDays +
            (day.commits > 0
              ? 1
              : 0),
        }),
        {
          commits: 0,
          activeDays: 0,
        },
      ),
    [visibleDays],
  );

  const uniqueRepositories =
    useMemo(() => {
      const repositories =
        new Set();

      for (const day of visibleDays) {
        for (const repository of
          day.repositories || []) {
          repositories.add(
            repository.fullName,
          );
        }
      }

      return repositories;
    }, [visibleDays]);

  const peakDay = useMemo(
    () =>
      visibleDays.reduce(
        (peak, day) =>
          (day.commits || 0) >
          (peak?.commits || 0)
            ? day
            : peak,
        null,
      ),
    [visibleDays],
  );

  const linePath = buildLinePath(
    geometry,
    maxCommits,
  );

  function setPreset(days) {
    const nextSize = clamp(
      days,
      MIN_WINDOW,
      Math.min(
        MAX_WINDOW,
        allDays.length ||
          MAX_WINDOW,
      ),
    );

    setWindowSize(nextSize);
    setWindowEnd(
      Math.max(
        allDays.length - 1,
        0,
      ),
    );
    setHoveredDate(null);
    setSelectedDate(null);
  }

  function zoomAroundIndex(
    factor,
    anchorIndex,
  ) {
    const available = Math.min(
      MAX_WINDOW,
      allDays.length ||
        MAX_WINDOW,
    );

    const nextSize = clamp(
      Math.round(
        windowSize * factor,
      ),
      MIN_WINDOW,
      available,
    );

    if (
      nextSize === windowSize
    ) {
      return;
    }

    const visibleStart =
      windowEnd -
      windowSize +
      1;

    const anchor =
      visibleStart +
      anchorIndex;

    const relative =
      anchorIndex /
      Math.max(
        windowSize - 1,
        1,
      );

    const nextStart =
      anchor -
      Math.round(
        relative *
          (nextSize - 1),
      );

    setWindowSize(nextSize);

    setWindowEnd(
      clamp(
        nextStart +
          nextSize -
          1,
        nextSize - 1,
        allDays.length - 1,
      ),
    );
  }

  function handleWheel(event) {
    event.preventDefault();

    if (!geometry.length) {
      return;
    }

    const rect =
      svgRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const x =
      ((event.clientX -
        rect.left) /
        rect.width) *
      WIDTH;

    const step =
      geometry[0].step ||
      WIDTH;

    const anchorIndex = clamp(
      Math.round(
        (x -
          geometry[0].x) /
          Math.max(step, 1),
      ),
      0,
      geometry.length - 1,
    );

    zoomAroundIndex(
      event.deltaY > 0
        ? 1.2
        : 0.8,
      anchorIndex,
    );
  }

  function handleBackgroundPointerDown(
    event,
  ) {
    if (
      event.pointerType ===
        "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    dragRef.current = {
      startX: event.clientX,
      startEnd: windowEnd,
      moved: false,
    };

    setIsDragging(true);

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  }

  function handleBackgroundPointerMove(
    event,
  ) {
    if (!isDragging) {
      return;
    }

    const delta =
      event.clientX -
      dragRef.current.startX;

    if (Math.abs(delta) > 4) {
      dragRef.current.moved = true;
    }

    const width =
      event.currentTarget.getBoundingClientRect()
        .width;

    const pixelsPerDay =
      width /
      Math.max(
        visibleDays.length - 1,
        1,
      );

    const dayDelta =
      Math.round(
        delta /
          Math.max(
            pixelsPerDay,
            1,
          ),
      );

    setWindowEnd(
      clamp(
        dragRef.current.startEnd -
          dayDelta,
        windowSize - 1,
        allDays.length - 1,
      ),
    );
  }

  function handleBackgroundPointerUp(
    event,
  ) {
    setIsDragging(false);

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

  function handleDayEnter(date) {
    if (isDragging) {
      return;
    }

    setHoveredDate(date);
  }

  function handleDayLeave() {
    setHoveredDate(null);
  }

  function toggleSelected(date) {
    setSelectedDate((current) =>
      current === date
        ? null
        : date,
    );
  }

  function handleDayKeyDown(
    event,
    point,
  ) {
    const index =
      getDateIndex(
        geometry,
        point.date,
      );

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      toggleSelected(point.date);
      return;
    }

    if (
      event.key === "Escape"
    ) {
      setHoveredDate(null);
      setSelectedDate(null);
      return;
    }

    if (
      event.key === "ArrowRight" &&
      index < geometry.length - 1
    ) {
      event.preventDefault();
      setHoveredDate(
        geometry[index + 1].date,
      );
      return;
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      event.preventDefault();
      setHoveredDate(
        geometry[index - 1].date,
      );
    }
  }

  function handleInspectorClose() {
    setSelectedDate(null);
    setHoveredDate(null);
  }

  if (!allDays.length) {
    return (
      <section className="contribution-pulse">
        <StatsSectionHeader
          number=""
          title="Contribution Pulse"
          description="Daily contribution activity across the tracked repository history."
        />

        <div className="contribution-pulse-empty">
          Contribution history is not
          available yet.
        </div>
      </section>
    );
  }

  return (
    <section className="contribution-pulse">
      <StatsSectionHeader
        number=""
        title="Contribution Pulse"
        description="Daily contribution activity across the tracked repository history."
      />

      <div className="contribution-pulse-shell">
        <header className="contribution-pulse-toolbar">
          <div className="contribution-pulse-toolbar-group">
            <span className="contribution-pulse-label">
              Range
            </span>

            <div className="contribution-pulse-presets">
              {ZOOM_PRESETS.map(
                (preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className={
                      windowSize ===
                      Math.min(
                        preset.days,
                        allDays.length,
                      )
                        ? "is-active"
                        : ""
                    }
                    onClick={() =>
                      setPreset(
                        preset.days,
                      )
                    }
                  >
                    {preset.label}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="contribution-pulse-toolbar-group">
            <label
              className="contribution-pulse-filter"
              htmlFor="contribution-repository-filter"
            >
              <span>
                Repository
              </span>

              <select
                id="contribution-repository-filter"
                value={
                  repositoryFilter
                }
                onChange={(event) => {
                  setRepositoryFilter(
                    event.target.value,
                  );
                  setSelectedDate(null);
                  setHoveredDate(null);
                }}
              >
                <option value="all">
                  All repositories
                </option>

                {repositoryOptions.map(
                  (repository) => (
                    <option
                      key={
                        repository.fullName
                      }
                      value={
                        repository.fullName
                      }
                    >
                      {repository.name}
                    </option>
                  ),
                )}
              </select>
            </label>

            <button
              type="button"
              className="contribution-pulse-reset"
              onClick={() => {
                setWindowSize(
                  Math.min(
                    DEFAULT_WINDOW,
                    allDays.length,
                  ),
                );
                setWindowEnd(
                  Math.max(
                    allDays.length - 1,
                    0,
                  ),
                );
                setRepositoryFilter(
                  "all",
                );
                setSelectedDate(null);
                setHoveredDate(null);
              }}
            >
              Reset
            </button>
          </div>
        </header>

        <div className="contribution-pulse-summary">
          <div>
            <span>Activity</span>
            <strong>
              {formatDate(
                visibleDays[0].date,
              )}{" "}
              →{" "}
              {formatDate(
                visibleDays.at(-1).date,
              )}
            </strong>
          </div>

          <div>
            <span>Commits</span>
            <strong>
              {formatNumber(
                totals.commits,
              )}
            </strong>
          </div>

          <div>
            <span>Active days</span>
            <strong>
              {formatNumber(
                totals.activeDays,
              )}
            </strong>
          </div>

          <div>
            <span>Repositories</span>
            <strong>
              {formatNumber(
                uniqueRepositories.size,
              )}
            </strong>
          </div>

          {peakDay && (
            <div className="contribution-pulse-summary-peak">
              <span>Peak</span>
              <strong>
                {formatDate(
                  peakDay.date,
                )}{" "}
                ·{" "}
                {formatNumber(
                  peakDay.commits,
                )}{" "}
                commits
              </strong>
            </div>
          )}
        </div>

        <div
          className={`contribution-pulse-viewport ${
            isDragging
              ? "is-dragging"
              : ""
          }`}
          onWheel={handleWheel}
          onPointerDown={
            handleBackgroundPointerDown
          }
          onPointerMove={
            handleBackgroundPointerMove
          }
          onPointerUp={
            handleBackgroundPointerUp
          }
          onPointerCancel={
            handleBackgroundPointerUp
          }
        >
          <svg
            ref={svgRef}
            className="contribution-pulse-graph"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label="Daily GitHub contribution activity"
          >
            <g className="contribution-pulse-grid">
              {[0, 0.25, 0.5, 0.75, 1].map(
                (ratio) => {
                  const y =
                    HEIGHT -
                    PAD.bottom -
                    ratio *
                      (HEIGHT -
                        PAD.top -
                        PAD.bottom);

                  return (
                    <g key={ratio}>
                      <line
                        x1={PAD.left}
                        y1={y}
                        x2={
                          WIDTH -
                          PAD.right
                        }
                        y2={y}
                        className="contribution-pulse-gridline"
                      />

                      <text
                        x={
                          PAD.left - 10
                        }
                        y={y + 3}
                        textAnchor="end"
                        className="contribution-pulse-y-label"
                      >
                        {Math.round(
                          maxCommits *
                            ratio,
                        )}
                      </text>
                    </g>
                  );
                },
              )}
            </g>

            {geometry.map(
              (point) => {
                const selected =
                  point.date ===
                  selectedDate;

                const hovered =
                  point.date ===
                  hoveredDate;

                const active =
                  selected || hovered;

                const width =
                  Math.max(
                    3,
                    Math.min(
                      20,
                      point.step *
                        0.72,
                    ),
                  );

                return (
                  <g
                    key={point.date}
                    className={`contribution-pulse-day ${
                      active
                        ? "is-active"
                        : ""
                    } ${
                      selected
                        ? "is-selected"
                        : ""
                    }`}
                  >
                    <rect
                      x={
                        point.x -
                        width / 2
                      }
                      y={PAD.top}
                      width={width}
                      height={
                        HEIGHT -
                        PAD.top -
                        PAD.bottom
                      }
                      className="contribution-pulse-hit"
                      tabIndex={0}
                      role="button"
                      aria-label={`${formatLongDate(
                        point.date,
                      )}: ${formatNumber(
                        point.commits,
                      )} commits across ${
                        point.repositoryCount
                      } repositories`}
                      aria-pressed={
                        selected
                      }
                      onPointerDown={(event) =>
                        event.stopPropagation()
                      }
                      onPointerMove={(event) =>
                        event.stopPropagation()
                      }
                      onPointerUp={(event) =>
                        event.stopPropagation()
                      }
                      onMouseEnter={() =>
                        handleDayEnter(
                          point.date,
                        )
                      }
                      onMouseLeave={
                        handleDayLeave
                      }
                      onFocus={() =>
                        handleDayEnter(
                          point.date,
                        )
                      }
                      onBlur={() =>
                        handleDayLeave()
                      }
                      onClick={() =>
                        toggleSelected(
                          point.date,
                        )
                      }
                      onKeyDown={(event) =>
                        handleDayKeyDown(
                          event,
                          point,
                        )
                      }
                    />

                    <rect
                      x={
                        point.x -
                        Math.max(
                          1,
                          Math.min(
                            7,
                            point.step *
                              0.25,
                          ),
                        )
                      }
                      y={
                        HEIGHT -
                        PAD.bottom -
                        point.barHeight
                      }
                      width={Math.max(
                        2,
                        Math.min(
                          14,
                          point.step *
                            0.52,
                        ),
                      )}
                      height={
                        point.barHeight
                      }
                      rx="2"
                      className={`contribution-pulse-bar ${
                        point.commits ===
                        0
                          ? "is-empty"
                          : ""
                      }`}
                    />

                    {active && (
                      <circle
                        cx={point.x}
                        cy={point.commitY}
                        r={
                          selected
                            ? 5
                            : 4
                        }
                        className="contribution-pulse-point is-active"
                      />
                    )}
                  </g>
                );
              },
            )}

            <path
              d={linePath}
              className="contribution-pulse-line"
            />

            {inspectorPoint && (
              <>
                <line
                  x1={
                    inspectorPoint.x
                  }
                  y1={PAD.top}
                  x2={
                    inspectorPoint.x
                  }
                  y2={
                    HEIGHT -
                    PAD.bottom
                  }
                  className="contribution-pulse-cursor"
                />

                <line
                  x1={
                    inspectorPoint.x - 5
                  }
                  y1={
                    inspectorPoint.commitY
                  }
                  x2={
                    inspectorPoint.x + 5
                  }
                  y2={
                    inspectorPoint.commitY
                  }
                  className="contribution-pulse-crosshair"
                />
              </>
            )}
          </svg>

          {inspectorPoint && (
            <aside
              className={`contribution-pulse-inspector ${
                inspectorPinned
                  ? "is-pinned"
                  : ""
              }`}
              aria-live="polite"
              onPointerDown={(event) =>
                event.stopPropagation()
              }
            >
              <header>
                <div>
                  <span>
                    {inspectorPinned
                      ? "Pinned day"
                      : "Inspecting day"}
                  </span>

                  <strong>
                    {formatLongDate(
                      inspectorPoint.date,
                    )}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={
                    handleInspectorClose
                  }
                  aria-label={
                    inspectorPinned
                      ? "Unpin day"
                      : "Close day details"
                  }
                >
                  ×
                </button>
              </header>

              <div className="contribution-pulse-inspector-stats">
                <div>
                  <strong>
                    {formatNumber(
                      inspectorPoint.commits,
                    )}
                  </strong>
                  <span>commits</span>
                </div>

                <div>
                  <strong>
                    {formatNumber(
                      inspectorPoint.repositoryCount,
                    )}
                  </strong>
                  <span>
                    repositories
                  </span>
                </div>
              </div>

              {inspectorRepositories.length >
              0 ? (
                <div className="contribution-pulse-repositories">
                  <div className="contribution-pulse-repositories-heading">
                    Repository distribution
                  </div>

                  {inspectorRepositories
                    .slice(0, 6)
                    .map(
                      (repository) => {
                        const percentage =
                          inspectorPoint.commits
                            ? Math.round(
                                (repository.commits /
                                  inspectorPoint.commits) *
                                  100,
                              )
                            : 0;

                        return (
                          <div
                            key={
                              repository.fullName
                            }
                            className="contribution-pulse-repository"
                          >
                            <div className="contribution-pulse-repository-header">
                              <span>
                                {
                                  repository.name
                                }
                              </span>

                              <strong>
                                {
                                  repository.commits
                                }
                              </strong>
                            </div>

                            <div className="contribution-pulse-repository-track">
                              <span
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      },
                    )}

                  {inspectorRepositories.length >
                    6 && (
                    <span className="contribution-pulse-more">
                      +
                      {inspectorRepositories.length -
                        6}{" "}
                      more repositories
                    </span>
                  )}
                </div>
              ) : (
                <div className="contribution-pulse-no-activity">
                  No commits recorded.
                </div>
              )}
            </aside>
          )}
        </div>

        <div className="contribution-pulse-axis">
          <span>
            {formatDate(
              visibleDays[0].date,
            )}
          </span>

          {visibleDays.length > 14 && (
            <span>
              {formatDate(
                visibleDays[
                  Math.floor(
                    visibleDays.length / 2,
                  )
                ].date,
              )}
            </span>
          )}

          <span>
            {formatDate(
              visibleDays.at(-1).date,
            )}
          </span>
        </div>

        <footer className="contribution-pulse-footer">
          <span>
            Scroll to zoom
          </span>

          <span>
            Drag to pan
          </span>

          <span>
            Hover to inspect
          </span>

          <span>
            Click to pin
          </span>

          {repositoryFilter !==
            "all" && (
            <span className="is-filtered">
              filtered to{" "}
              {
                repositoryOptions.find(
                  (repository) =>
                    repository.fullName ===
                    repositoryFilter,
                )?.name
              }
            </span>
          )}
        </footer>
      </div>
    </section>
  );
}

export default ContributionPulse;
