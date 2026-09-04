import { useState } from "react";

import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";
import Container from "../components/Container";

import GitHubOverview from "../components/GitHubOverview";
import GitHubRepositoryList from "../components/GitHubRepositoryList";
import GitHubStats from "../components/GitHubStats";

function GitHub() {
  const [repositoriesOpen, setRepositoriesOpen] =
    useState(false);

  const [statsOpen, setStatsOpen] =
    useState(false);

  function toggleRepositories() {
    setRepositoriesOpen(
      (current) => !current,
    );
  }

  function toggleStats() {
    setStatsOpen(
      (current) => !current,
    );
  }

  return (
    <div className="github-page">
      <PageHeader
        eyebrow="GitHub"
        title="My Activity on GitHub"
        description={
          <>
            Every repository here represents a problem explored, a tool built or an idea experimented with.{" "}
            This page stays in sync with my GitHub and reflects my ongoing work.
          </>
        }
      />

      <Container>
        <GitHubOverview />

        <SectionHeader
          path="~/repositories"
          title="Everything I've Built"
          description="Developer tools, backend systems, automation projects, experiments and open-source contributions."
          action={
            <button
              type="button"
              className={`repository-list-toggle ${
                repositoriesOpen
                  ? "is-open"
                  : ""
              }`}
              onClick={
                toggleRepositories
              }
              aria-expanded={
                repositoriesOpen
              }
              aria-controls="github-repositories"
            >
              <span>
                {repositoriesOpen
                  ? "Hide all repositories"
                  : "See all repositories"}
              </span>

              <span
                className="repository-list-toggle-icon"
                aria-hidden="true"
              >
                <span />
                <span />
              </span>
            </button>
          }
        />

        <div
          id="github-repositories"
          className={`github-repository-list-collapse ${
            repositoriesOpen
              ? "is-open"
              : ""
          }`}
          aria-hidden={
            !repositoriesOpen
          }
        >
          <div className="github-repository-list-collapse-inner">
            <GitHubRepositoryList />
          </div>
        </div>

        <SectionHeader
          path="~/my-stats"
          title="My Stats"
          description="A visual history of how I build, experiment and connect projects."
          action={
            <button
              type="button"
              className={`repository-list-toggle ${
                statsOpen
                  ? "is-open"
                  : ""
              }`}
              onClick={toggleStats}
              aria-expanded={statsOpen}
              aria-controls="github-stats"
            >
              <span>
                {statsOpen
                  ? "Hide all stats"
                  : "See all my stats"}
              </span>

              <span
                className="repository-list-toggle-icon"
                aria-hidden="true"
              >
                <span />
                <span />
              </span>
            </button>
          }
        />

        <div
          id="github-stats"
          className={`github-repository-list-collapse ${
            statsOpen
              ? "is-open"
              : ""
          }`}
          aria-hidden={!statsOpen}
        >
          <div className="github-repository-list-collapse-inner">
            <GitHubStats />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default GitHub;
