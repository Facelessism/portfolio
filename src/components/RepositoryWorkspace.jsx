import { useState } from "react";

import RepositoryDeck from "./RepositoryDeck";

function RepositoryWorkspace() {
  const [featuredCount, setFeaturedCount] = useState(0);

  return (
    <section
      className="hero-workspace"
      aria-labelledby="featured-repositories-title"
    >
      <header className="workspace-section-header">
        <p className="workspace-section-path">
          ~/featured-repositories ({featuredCount} repos)
        </p>

        <h2
          id="featured-repositories-title"
          className="workspace-section-title"
        >
          Featured projects
        </h2>
      </header>

      <div className="workspace-window">
        <div className="workspace-header">
          <div
            className="workspace-controls"
            aria-hidden="true"
          >
            <span className="control red" />
            <span className="control yellow" />
            <span className="control green" />
          </div>
        </div>

        <div className="workspace-body">
          <RepositoryDeck
            onCountChange={setFeaturedCount}
          />
        </div>
      </div>
    </section>
  );
}

export default RepositoryWorkspace;
