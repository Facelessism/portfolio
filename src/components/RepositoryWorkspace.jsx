import RepositoryDeck from "./RepositoryDeck";

function RepositoryWorkspace() {
  return (
    <aside className="hero-workspace">
      <div className="workspace-window">

        <div className="workspace-header">
          <div className="workspace-controls">
            <span className="control red"></span>
            <span className="control yellow"></span>
            <span className="control green"></span>
          </div>

          <p className="workspace-title">
            ~/featured-repositories
          </p>
        </div>

        <div className="workspace-body">
          <RepositoryDeck />
        </div>

      </div>
    </aside>
  );
}

export default RepositoryWorkspace;
