import RepositoryDeck from "./RepositoryDeck";

function RepositoryWorkspace() {
  return (
    <div
      className="hero-workspace"
      aria-label="Featured repositories preview"
    >
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

          <p className="workspace-title">
            ~/featured-repositories
          </p>
        </div>

        <div className="workspace-body">
          <RepositoryDeck />
        </div>

      </div>
    </div>
  );
}

export default RepositoryWorkspace;
