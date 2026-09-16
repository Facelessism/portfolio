import { useState } from "react";

import Container from "./Container";
import RepositoryDeck from "./RepositoryDeck";

function RepositoryWorkspace() {
  const [featuredCount, setFeaturedCount] = useState(0);

  return (
    <section
      className="hero-workspace"
      aria-labelledby="featured-repositories-title"
    >
      <Container>
        <header className="workspace-section-header">
          <div className="workspace-section-heading">
            <span
              className="workspace-section-indicator"
              aria-hidden="true"
            />

            <div>
              <p className="workspace-section-path">
                ~/featured-repositories
              </p>

              <h2
                id="featured-repositories-title"
                className="workspace-section-title"
              >
                Featured works
              </h2>
            </div>
          </div>

          <span className="workspace-section-count">
            {String(featuredCount).padStart(2, "0")} repos
          </span>
        </header>

        <div className="workspace-window">
          <div className="workspace-header">
            <span className="workspace-header-label">
              repository index
            </span>

            <span className="workspace-header-status">
              indexed
            </span>
          </div>

          <div className="workspace-body">
            <RepositoryDeck
              onCountChange={setFeaturedCount}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default RepositoryWorkspace;
