import Button from "../components/Button";
import TopicSelector from "../components/TopicSelector";

import aboutData from "../data/aboutData";

function About() {
  return (
    <main className="about-page">

      <section
        id="hero"
        className="about-section about-hero"
      >

        <blockquote className="hero-quote">
          {aboutData.hero.quote}
        </blockquote>

        <p className="hero-support">
          {aboutData.hero.support}
        </p>

      </section>


      <section
        id="identity"
        className="about-section"
      >

        <h2 className="about-heading">
          {aboutData.identity.heading}
        </h2>

        {aboutData.identity.paragraphs.map((paragraph) => (

          <p key={paragraph}>
            {paragraph}
          </p>

        ))}

      </section>


      <section
        id="principles"
        className="about-section"
      >

        <h2 className="about-heading">
          Engineering Principles
        </h2>

        <ul className="principles-list">

          {aboutData.principles.map(
            (principle, index) => (

              <li key={principle}>

                <span className="principle-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p>
                  {principle}
                </p>

              </li>

            )
          )}

        </ul>

      </section>


      <section
        id="domains"
        className="about-section"
      >

        <h2 className="about-heading">
          Engineering Domains
        </h2>

        <TopicSelector
          items={aboutData.domains.map(
            ([title, content]) => ({
              title,
              content,
            })
          )}
        />

      </section>


      <section
        id="exploration"
        className="about-section"
      >

        <h2 className="about-heading">
          Current Exploration
        </h2>

        <TopicSelector
          items={aboutData.exploration.map(
            ([title, content]) => ({
              title,
              content,
            })
          )}
        />

      </section>


      <section
        id="open-source"
        className="about-section"
      >

        <h2 className="about-heading">
          {aboutData.openSource.heading}
        </h2>

        {aboutData.openSource.paragraphs.map((paragraph) => (

          <p key={paragraph}>
            {paragraph}
          </p>

        ))}

        <Button
          to={aboutData.openSource.button.to}
        >
          {aboutData.openSource.button.label}
        </Button>

      </section>


      <section
        id="collaboration"
        className="about-section"
      >

        <h2 className="about-heading">
          {aboutData.collaboration.heading}
        </h2>

        <p>
          {aboutData.collaboration.text}
        </p>

      </section>


      <section
        id="contact"
        className="about-section"
      >

        <h2 className="about-heading">
          {aboutData.contact.heading}
        </h2>

        <div className="contact-links">

          {aboutData.contact.links.map((link) => (

            <Button
              key={link.label}
              href={link.href}
              variant="secondary"
              external
            >
              {link.label}
            </Button>

          ))}

        </div>

        <Button
          to={aboutData.contact.certificates.to}
        >
          {aboutData.contact.certificates.label}
        </Button>

      </section>

    </main>
  );
}

export default About;
