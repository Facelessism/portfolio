import Container from "./Container";

function Writing() {
  return (
    <section id="writing" className="writing">
      <Container>
        <div className="section-header">
          <p className="section-eyebrow">
            Writing
          </p>

          <h2 className="section-title">
            Thoughts on software engineering...
          </h2>

          <p className="section-description">
            Articles, architecture notes and technical write ups will be published here.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default Writing;
