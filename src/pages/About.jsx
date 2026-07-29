import Button from "../components/Button";
import SectionHeader from "../components/SectionHeader";
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

        <SectionHeader
          title={aboutData.identity.heading}
        />


        {aboutData.identity.paragraphs.map(
          (paragraph) => (
            <p key={paragraph}>
              {paragraph}
            </p>
          )
        )}

      </section>



      <section
        id="principles"
        className="about-section"
      >

        <SectionHeader
          title="Engineering Principles"
        />


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

        <SectionHeader
          title="Engineering Domains"
        />


        <TopicSelector
          items={aboutData.domains.map(
            ([title, description]) => ({
              title,
              description,
            })
          )}
        />

      </section>



      <section
        id="exploration"
        className="about-section"
      >

        <SectionHeader
          title="Current Exploration"
        />


        <TopicSelector
          items={aboutData.exploration.map(
            ([title, description]) => ({
              title,
              description,
            })
          )}
        />

      </section>



      <section
        id="open-source"
        className="about-section"
      >

        <SectionHeader
          title={aboutData.openSource.heading}
        />


        {aboutData.openSource.paragraphs.map(
          (paragraph) => (
            <p key={paragraph}>
              {paragraph}
            </p>
          )
        )}


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

        <SectionHeader
          title={aboutData.collaboration.heading}
        />


        <p>
          {aboutData.collaboration.text}
        </p>

      </section>



      <section
        id="contact"
        className="about-section"
      >

        <SectionHeader
          title={aboutData.contact.heading}
        />


        <div className="contact-links">

          {aboutData.contact.links.map(
            (link) => (

              <Button
                key={link.label}
                href={link.href}
                variant="secondary"
                external
              >
                {link.label}
              </Button>

            )
          )}

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
