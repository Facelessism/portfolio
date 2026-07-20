import Container from "./Container";

function Hero() {
  return (
    <section id="hero" className="hero">
      <Container>
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
            I design and build developer tools, automation, backend systems,
            and engineering products focused on performance, maintainability,
            and developer experience.
          </p>

          <div className="hero-actions">
            <a href="#work" className="button-primary">
              Explore Work
            </a>

            <a
              href="https://github.com/Facelessism"
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary"
            >
              View GitHub
            </a>
          </div>

          <a href="#work" className="hero-scroll">
            ↓ Explore Featured Work
          </a>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
