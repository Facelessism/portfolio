import Container from "./Container";

function About() {
  return (
    <section id="about" className="about">
      <Container>
        <div className="section-header">
          <p className="section-eyebrow">
            About
          </p>

          <h2 className="section-title">
            The engineer behind all the work.
          </h2>

          <p className="section-description">
            The skills, certifications, experience, goals and more will be introduced here.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default About;
