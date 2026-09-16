import Container from "./Container";
import Button from "./Button";

import { getResumeUrl } from "../services/resume";

function Hero() {
  const resumeUrl = getResumeUrl();

  return (
    <section className="hero">
      <Container>
        <div className="hero-layout">
          <div className="hero-content">
            <div className="hero-intro">
              <h1 className="hero-title">
                Backend • Dev-Tooling • Open Source
              </h1>

              <p className="hero-description">
                Building backend systems, developer tools and open-source
                software.
              </p>
            </div>

            <div className="hero-actions">
              <Button to="/github" variant="primary">
                Explore my work
              </Button>

              {resumeUrl && (
                <Button
                  href={resumeUrl}
                  variant="secondary"
                  download
                >
                  Download resume
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
