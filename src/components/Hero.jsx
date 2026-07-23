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

          <a href="#work" className="hero-scroll">
            ↓ Explore Featured Work
          </a>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
