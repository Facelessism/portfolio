import Container from "./Container";
import Button from "./Button";

function Hero() {
  return (
    <section className="hero">
      <Container>
        <div className="hero-layout">
          <div className="hero-content">
            <p className="hero-eyebrow">
              Developer Tooling • Open Source • Backend Engineering
            </p>

            <h1 className="hero-title">
              Building software
              <br />
              that helps developers build.
            </h1>

            <p className="hero-description">
              I design and build developer tools, automation, backend systems and engineering products focused on performance, maintainability and developer experience.
            </p>

            <div className="hero-actions">
              <Button
                to="/projects"
                variant="primary"
              >
                ↓ Explore Featured Work
              </Button>
            </div>
          </div>

          <div className="hero-visual">
            {/* GitHub / Terminal UI goes here */}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
