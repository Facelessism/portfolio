import { useState } from "react";

import PageHeader from "../components/PageHeader";
import SectionHeader from "../components/SectionHeader";
import Container from "../components/Container";

import GitHubOverview from "../components/GitHubOverview";
import GitHubRepositoryList from "../components/GitHubRepositoryList";

function GitHub() {
  const [repositoriesOpen, setRepositoriesOpen] =
    useState(false);

  function toggleRepositories() {
    setRepositoriesOpen((current) => !current);
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
                repositoriesOpen ? "is-open" : ""
              }`}
              onClick={toggleRepositories}
              aria-expanded={repositoriesOpen}
              aria-controls="github-repositories"
            >
              <span>See all repositories</span>

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
            repositoriesOpen ? "is-open" : ""
          }`}
          aria-hidden={!repositoriesOpen}
        >
          <div className="github-repository-list-collapse-inner">
            <GitHubRepositoryList />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default GitHub;
