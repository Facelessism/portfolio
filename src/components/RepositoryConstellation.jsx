import { useMemo, useState } from "react";

import StatsSectionHeader from "./StatsSectionHeader";

const WIDTH = 1000;
const HEIGHT = 620;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;

function hash(value) {
  let result = 0;

  for (let index = 0; index < value.length; index += 1) {
    result =
      (result << 5) -
      result +
      value.charCodeAt(index);

    result |= 0;
  }

  return Math.abs(result);
}

function getActivityScore(repository) {
  return (
    (repository.totalCommits || 0) * 1.4 +
    Math.log10((repository.totalChurn || 0) + 1) * 2
  );
}

function getRadius(repository) {
  return Math.min(
    7 + Math.sqrt(getActivityScore(repository)) * 1.8,
    22,
  );
}

function buildNodes(repositories) {
  const candidates = [...repositories]
    .filter(
      (repository) =>
        repository.historyStatus === "ok" &&
        repository.weeks?.length,
    )
    .sort(
      (a, b) =>
        getActivityScore(b) -
        getActivityScore(a),
    );

  const rings = [92, 150, 208, 266];

  return candidates.map((repository, index) => {
    const seed = hash(repository.fullName);
    const ring = rings[index % rings.length];
    const count = Math.ceil(
      candidates.length / rings.length,
    );
    const position = Math.floor(index / rings.length);

    const angle =
      ((position + (seed % 17) / 17) / count) *
      Math.PI *
      2;

    const radiusJitter =
      ((seed % 31) - 15) * 0.8;

    return {
      repository,
      x:
        CENTER_X +
        Math.cos(angle) *
          (ring + radiusJitter),
      y:
        CENTER_Y +
        Math.sin(angle) *
          (ring + radiusJitter),
      radius: getRadius(repository),
    };
  });
}

function buildEdgeData(nodes) {
  const edges = [];

  for (let first = 0; first < nodes.length; first += 1) {
    for (
      let second = first + 1;
      second < nodes.length;
      second += 1
    ) {
      const firstRepository =
        nodes[first].repository;
      const secondRepository =
        nodes[second].repository;

      const firstWeeks = new Map(
        (firstRepository.weeks || []).map(
          (week) => [week.week, week],
        ),
      );

      let overlap = 0;
      let intensity = 0;

      for (const week of secondRepository.weeks || []) {
        const firstWeek = firstWeeks.get(week.week);

        if (
          !firstWeek ||
          firstWeek.commits <= 0 ||
          week.commits <= 0
        ) {
          continue;
        }

        overlap += 1;

        intensity += Math.min(
          firstWeek.commits,
          week.commits,
        );
      }

      if (!overlap) continue;

      const strength = Math.min(
        1,
        overlap / 18 + intensity / 140,
      );

      if (strength < 0.08) continue;

      edges.push({
        from: nodes[first],
        to: nodes[second],
        overlap,
        intensity,
        strength,
      });
    }
  }

  return edges.sort(
    (a, b) => b.strength - a.strength,
  );
}

function getConnectedIds(edges, selected) {
  if (!selected) return new Set();

  const ids = new Set([selected]);

  for (const edge of edges) {
    const source = edge.from.repository.fullName;
    const target = edge.to.repository.fullName;

    if (source === selected) {
      ids.add(target);
    }

    if (target === selected) {
      ids.add(source);
    }
  }

  return ids;
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(value || 0);
}

function RepositoryConstellation({
  historyRepositories = [],
}) {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const nodes = useMemo(
    () => buildNodes(historyRepositories),
    [historyRepositories],
  );

  const edges = useMemo(
    () => buildEdgeData(nodes),
    [nodes],
  );

  const connectedIds = useMemo(
    () => getConnectedIds(edges, selected),
    [edges, selected],
  );

  const selectedNode = nodes.find(
    (node) => node.repository.fullName === selected,
  );

  const hoveredNode = nodes.find(
    (node) => node.repository.fullName === hovered,
  );

  const detailNode = hoveredNode || selectedNode;

  const detailEdges = detailNode
    ? edges.filter(
        (edge) =>
          edge.from.repository.fullName ===
            detailNode.repository.fullName ||
          edge.to.repository.fullName ===
            detailNode.repository.fullName,
      )
    : [];

  function toggleSelection(id) {
    setSelected((current) =>
      current === id ? null : id,
    );
  }

  function handleKeyDown(event, id) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      toggleSelection(id);
    }

    if (event.key === "Escape") {
      setSelected(null);
    }
  }

  return (
    <section className="repository-constellation">
      <StatsSectionHeader
        number="03"
        title="Repository Constellation"
        description="Repositories connected with contribution activities"
      />

      <div className="repository-constellation-stage">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Repository contribution constellation"
        >
          <defs>
            <radialGradient id="repository-core">
              <stop
                offset="0%"
                className="repository-core-inner"
              />
              <stop
                offset="100%"
                className="repository-core-outer"
              />
            </radialGradient>
          </defs>

          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="118"
            className="repository-constellation-orbit"
          />

          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="188"
            className="repository-constellation-orbit repository-constellation-orbit-wide"
          />

          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="2.5"
            fill="url(#repository-core)"
            className="repository-constellation-core"
          />

          {edges.map((edge, index) => {
            const source =
              edge.from.repository.fullName;
            const target =
              edge.to.repository.fullName;

            const active =
              !selected ||
              source === selected ||
              target === selected;

            const hoveredEdge =
              hovered &&
              (source === hovered ||
                target === hovered);

            const selectedEdge =
              selected &&
              (source === selected ||
                target === selected);

            return (
              <line
                key={`${source}-${target}-${index}`}
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                className={`repository-constellation-edge ${
                  active
                    ? "is-active"
                    : "is-muted"
                } ${
                  hoveredEdge
                    ? "is-hovered"
                    : ""
                } ${
                  selectedEdge
                    ? "is-selected"
                    : ""
                }`}
                style={{
                  "--edge-strength": edge.strength,
                }}
              />
            );
          })}

          {nodes.map((node, index) => {
            const id = node.repository.fullName;

            const connected =
              selected &&
              connectedIds.has(id);

            const active =
              !selected || connected;

            const isSelected = selected === id;
            const isHovered = hovered === id;

            return (
              <g
                key={id}
                className={`repository-constellation-node ${
                  active
                    ? "is-active"
                    : "is-muted"
                } ${
                  isSelected
                    ? "is-selected"
                    : ""
                } ${
                  isHovered
                    ? "is-hovered"
                    : ""
                }`}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`Inspect ${node.repository.name}`}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(id)}
                onBlur={() => setHovered(null)}
                onClick={() =>
                  toggleSelection(id)
                }
                onKeyDown={(event) =>
                  handleKeyDown(event, id)
                }
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius + 12}
                  className="repository-constellation-hit"
                />

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius + 5}
                  className="repository-constellation-node-halo"
                  style={{
                    "--node-delay": `${index * 35}ms`,
                  }}
                />

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  className="repository-constellation-node-dot"
                />

                <text
                  x={node.x + node.radius + 11}
                  y={node.y + 4}
                  className="repository-constellation-label"
                >
                  {node.repository.name}
                </text>
              </g>
            );
          })}
        </svg>

        {detailNode && (
          <div className="repository-constellation-detail">
            <span className="repository-constellation-detail-kicker">
              {selectedNode
                ? "Selected repository"
                : "Repository"}
            </span>

            <strong>
              {detailNode.repository.name}
            </strong>

            <span>
              {formatNumber(
                detailNode.repository.totalCommits,
              )} commits
            </span>

            <span>
              {formatNumber(
                detailNode.repository.totalChurn,
              )} lines changed
            </span>

            {detailEdges.length > 0 && (
              <span>
                {detailEdges.length} overlapping
                connection
                {detailEdges.length === 1
                  ? ""
                  : "s"}
              </span>
            )}

            {selectedNode && (
              <small>
                Click again to restore the full
                constellation.
              </small>
            )}
          </div>
        )}
      </div>

      <div className="repository-constellation-meta">
        <span>
          {nodes.length} tracked repositories
        </span>

        <span>
          {edges.length} contribution connections
        </span>
      </div>
    </section>
  );
}

export default RepositoryConstellation;
