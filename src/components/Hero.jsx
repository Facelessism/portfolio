function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container">
        <p className="hero-tag">
          Just another Engineering geek
        </p>

        <h1>
          Building software
          <br />
          for World!
        </h1>

        <p className="hero-description">
          I will add this soon
        </p>

        <div className="hero-actions">
          <a href="#projects">Explore my Projects</a>

          <a
            href="https://github.com/Facelessism"
            target="_blank"
            rel="noopener noreferrer"
          >
            My GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
