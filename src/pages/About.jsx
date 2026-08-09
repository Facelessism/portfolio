import { useMemo, useState } from "react";

import Button from "../components/Button";
import SectionNavigator from "../components/SectionNavigator";
import TerminalCard from "../components/TerminalCard";
import TopicSelector from "../components/TopicSelector";

function About() {
  const sections = useMemo(
    () => [
      {
        id: "identity",
        label: "Identity",
      },
      {
        id: "domains",
        label: "Domains",
      },
      {
        id: "exploration",
        label: "Exploration",
      },
      {
        id: "open-source",
        label: "Open Source",
      },
      {
        id: "contact",
        label: "Contact",
      },
    ],
    []
  );

  const [activeSection, setActiveSection] =
    useState("identity");

  const panels = useMemo(
    () => ({
      identity: {
        title: aboutData.identity.heading,

        content: (
          <TerminalCard
            title="~/portfolio/about"
            shell="main"
            variant="blue"
            commands={aboutData.identity.terminal}
          />
        ),
      },

      domains: {
        title: "Engineering Domains",

        content: (
          <TopicSelector
            items={aboutData.domains.map(
              ([title, description]) => ({
                title,
                description,
              })
            )}
          />
        ),
      },

      exploration: {
        title: "Current Exploration",

        content: (
          <TopicSelector
            items={aboutData.exploration.map(
              ([title, description]) => ({
                title,
                description,
              })
            )}
          />
        ),
      },

      "open-source": {
        title: aboutData.openSource.heading,

        content: (
          <>
            <TerminalCard
              title="~/portfolio/open-source"
              shell="community"
              variant="amber"
              commands={
                aboutData.openSource.terminal
              }
            />

            <div className="terminal-actions">
              <Button
                to={
                  aboutData.openSource.button.to
                }
              >
                {
                  aboutData.openSource.button
                    .label
                }
              </Button>
            </div>
          </>
        ),
      },

      contact: {
        title: aboutData.contact.heading,

        content: (
          <>
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
              to={
                aboutData.contact.certificates
                  .to
              }
            >
              {
                aboutData.contact.certificates
                  .label
              }
            </Button>
          </>
        ),
      },
    }),
    []
  );

  const {
    title,
    content,
  } = panels[activeSection];

  return (
    <main className="about-page">
      <section className="about-section about-hero">
        <blockquote className="hero-quote">
          {aboutData.hero.quote}
        </blockquote>

        <p className="hero-support">
          {aboutData.hero.support}
        </p>
      </section>

      <SectionNavigator
        sections={sections}
        activeSection={activeSection}
        onChange={setActiveSection}
      />

      <section className="about-panel">
        <h2 className="section-title">
          {title}
        </h2>

        {content}
      </section>
    </main>
  );
}

export default About;

