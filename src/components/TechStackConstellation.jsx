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

function getRepositoryRadius(node, edgeCount) {
  return Math.min(
    6 + Math.sqrt(edgeCount + 1) * 1.8,
    13,
  );
}

function getTechnologyRadius(node) {
  return Math.min(
    12 + Math.sqrt(node.count || 0) * 4,
    27,
  );
}

function buildLayout(graph) {
  const repositories = graph.nodes.filter(
    (node) => node.type === "repository",
  );

  const technologies = graph.nodes
    .filter(
      (node) => node.type === "technology",
    )
    .sort(
      (a, b) =>
        (b.count || 0) -
        (a.count || 0),
    );

  const edgeCounts = new Map();

  for (const edge of graph.edges) {
    edgeCounts.set(
      edge.source,
      (edgeCounts.get(edge.source) || 0) + 1,
    );

    edgeCounts.set(
      edge.target,
      (edgeCounts.get(edge.target) || 0) + 1,
    );
  }

  const repositoryNodes = repositories.map(
    (node, index) => {
      const seed = hash(node.id);

      const angle =
        (index /
          Math.max(repositories.length, 1)) *
          Math.PI *
          2 +
        (seed % 100) / 1000;

      const radius =
        226 + (seed % 46);

      return {
        ...node,
        x:
          CENTER_X +
          Math.cos(angle) * radius,
        y:
          CENTER_Y +
          Math.sin(angle) * radius,
        radius: getRepositoryRadius(
          node,
          edgeCounts.get(node.id) || 0,
        ),
      };
    },
  );

  const technologyNodes = technologies.map(
    (node, index) => {
      const seed = hash(node.id);

      const angle =
        (index /
          Math.max(technologies.length, 1)) *
          Math.PI *
          2 +
        (seed % 23) / 23;

      const radius =
        76 +
        Math.min(node.count || 0, 12) * 5;

      return {
        ...node,
        x:
          CENTER_X +
          Math.cos(angle) * radius,
        y:
          CENTER_Y +
          Math.sin(angle) * radius,
        radius: getTechnologyRadius(node),
        rotation: (seed % 12) - 6,
      };
    },
  );

  const nodes = [
    ...repositoryNodes,
    ...technologyNodes,
  ];

  const nodeMap = new Map(
    nodes.map((node) => [node.id, node]),
  );

  const edges = graph.edges
    .map((edge) => ({
      ...edge,
      from: nodeMap.get(edge.source),
      to: nodeMap.get(edge.target),
    }))
    .filter(
      (edge) =>
        edge.from &&
        edge.to,
    );

  return {
    nodes,
    edges,
  };
}

function getConnectedIds(edges, selected) {
  if (!selected) return new Set();

  const ids = new Set([selected]);

  for (const edge of edges) {
    if (edge.source === selected) {
      ids.add(edge.target);
    }

    if (edge.target === selected) {
      ids.add(edge.source);
    }
  }

  return ids;
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(value || 0);
}

function TechStackConstellation({
  technologyGraph = {
    nodes: [],
    edges: [],
  },
}) {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const graph = useMemo(
    () => buildLayout(technologyGraph),
    [technologyGraph],
  );

  const connectedIds = useMemo(
    () =>
      getConnectedIds(
        graph.edges,
        selected,
      ),
    [graph.edges, selected],
  );

  const selectedNode = graph.nodes.find(
    (node) => node.id === selected,
  );

  const hoveredNode = graph.nodes.find(
    (node) => node.id === hovered,
  );

  const detailNode =
    hoveredNode || selectedNode;

  const detailEdges = detailNode
    ? graph.edges.filter(
        (edge) =>
          edge.source === detailNode.id ||
          edge.target === detailNode.id,
      )
    : [];

  const repositoryCount =
    graph.nodes.filter(
      (node) => node.type === "repository",
    ).length;

  const technologyCount =
    graph.nodes.filter(
      (node) => node.type === "technology",
    ).length;

  const selectedTechnologyCount =
    selectedNode?.type === "repository"
      ? detailEdges.length
      : 0;

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
    <section className="tech-stack-constellation">
      <StatsSectionHeader
        number="04"
        title="Tech Stack Constellation"
        description="Declared languages and technologies connected to the repositories where they appear."
      />

      <div className="tech-stack-constellation-stage">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Repository and declared technology relationships"
        >
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="76"
            className="tech-stack-orbit"
          />

          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="154"
            className="tech-stack-orbit tech-stack-orbit-wide"
          />

          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="2.5"
            className="tech-stack-core"
          />

          {graph.edges.map(
            (edge, index) => {
              const source = edge.source;
              const target = edge.target;

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
                  className={`tech-stack-edge ${
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
                />
              );
            },
          )}

          {graph.nodes.map(
            (node, index) => {
              const isTechnology =
                node.type === "technology";

              const active =
                !selected ||
                connectedIds.has(node.id);

              const isSelected =
                selected === node.id;

              const isHovered =
                hovered === node.id;

              return (
                <g
                  key={node.id}
                  className={`tech-stack-node ${
                    isTechnology
                      ? "tech-stack-node-technology"
                      : "tech-stack-node-repository"
                  } ${
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
                  aria-label={`Inspect ${node.label}`}
                  onMouseEnter={() =>
                    setHovered(node.id)
                  }
                  onMouseLeave={() =>
                    setHovered(null)
                  }
                  onFocus={() =>
                    setHovered(node.id)
                  }
                  onBlur={() =>
                    setHovered(null)
                  }
                  onClick={() =>
                    toggleSelection(node.id)
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(
                      event,
                      node.id,
                    )
                  }
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius + 11}
                    className="tech-stack-hit"
                  />

                  {isTechnology && (
                    <>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius + 7}
                        className="tech-stack-node-ring"
                        style={{
                          "--technology-delay": `${
                            index * 45
                          }ms`,
                        }}
                      />

                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius + 12}
                        className="tech-stack-node-ring-outer"
                      />
                    </>
                  )}

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius}
                    className="tech-stack-node-dot"
                  />

                  <text
                    x={
                      node.x +
                      node.radius +
                      11
                    }
                    y={node.y + 4}
                    className="tech-stack-label"
                  >
                    {node.label}
                  </text>
                </g>
              );
            },
          )}
        </svg>

        {detailNode && (
          <div className="tech-stack-detail">
            <span className="tech-stack-detail-kicker">
              {selectedNode
                ? "Selected node"
                : "Node"}
            </span>

            <strong>
              {detailNode.label}
            </strong>

            {detailNode.type ===
            "technology" ? (
              <>
                <span>
                  Declared by{" "}
                  {formatNumber(
                    detailNode.count,
                  )}{" "}
                  repositories
                </span>

                <span>
                  {detailEdges.length} repository
                  connection
                  {detailEdges.length === 1
                    ? ""
                    : "s"}
                </span>
              </>
            ) : (
              <>
                <span>
                  {formatNumber(
                    selectedTechnologyCount,
                  )}{" "}
                  declared technolog
                  {selectedTechnologyCount ===
                  1
                    ? "y"
                    : "ies"}
                </span>

                <span>
                  Repository node
                </span>
              </>
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

      <div className="tech-stack-legend">
        <span>
          <i className="is-repository" />
          repository
        </span>

        <span>
          <i className="is-technology" />
          declared technology
        </span>

        <span>
          {repositoryCount} repositories
        </span>

        <span>
          {technologyCount} technologies
        </span>
      </div>
    </section>
  );
}

export default TechStackConstellation;
