import Container from "./Container";
import Button from "./Button";
import RepositoryWorkspace from "./RepositoryWorkspace";

function Hero() {
  return (
    <section className="hero">
      <Container>
        <div className="hero-content">
          <p className="hero-eyebrow">
            Backend • Developer Tools • Open Source
          </p>

          <h1 className="hero-title">
            Building today,
            <br />
            Improving tomorrow.
          </h1>

          <p className="hero-description">
            Primarily focused on backend development, developer tooling,
            and open source contributions.
          </p>

          <div className="hero-actions">
            <Button
              to="/github"
              variant="primary"
            >
              Explore my Works
            </Button>
          </div>
        </div>

        <RepositoryWorkspace />
      </Container>
    </section>
  );
}

export default Hero;
