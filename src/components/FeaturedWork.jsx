import Container from "./Container";

function FeaturedWork() {
  return (
    <section id="work" className="featured-work">
      <Container>
        <div className="section-header">
          <p className="section-eyebrow">
            Featured Work
          </p>

          <h2 className="section-title">
            Building products, not just projects!
          </h2>

          <p className="section-description">
            A curated collection of my engineering works will live here.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default FeaturedWork;
