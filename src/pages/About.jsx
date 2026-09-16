import { useState } from "react";

import AboutPanel from "../components/AboutPanel";
import Button from "../components/Button";
import SectionNavigator from "../components/SectionNavigator";
import TerminalCard from "../components/TerminalCard";
import TopicSelector from "../components/TopicSelector";

import aboutData from "../data/about";

const sections = [
  { id: "identity", label: "Identity" },
  { id: "domains", label: "Domains" },
  { id: "exploration", label: "Exploration" },
  { id: "open-source", label: "Open Source" },
];

const topicItems = (items) =>
  items.map(([title, description]) => ({
    title,
    description,
  }));

function renderPanel(id) {
  switch (id) {
    case "identity":
      return (
        <TerminalCard
          title="~/portfolio/about"
          shell="main"
          variant="blue"
          commands={aboutData.identity.terminal}
        />
      );

    case "domains":
      return <TopicSelector items={topicItems(aboutData.domains)} />;

    case "exploration":
      return (
        <TopicSelector
          items={topicItems(aboutData.exploration)}
        />
      );

    case "open-source":
      return (
        <>
          <TerminalCard
            title="~/portfolio/open-source"
            shell="community"
            variant="amber"
            commands={aboutData.openSource.terminal}
          />

          <div className="terminal-actions">
            <Button to={aboutData.openSource.button.to}>
              {aboutData.openSource.button.label}
            </Button>
          </div>
        </>
      );

    default:
      return null;
  }
}

function About() {
  const [activeSection, setActiveSection] =
    useState("identity");

  const activeSectionData = sections.find(
    ({ id }) => id === activeSection
  );

  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="hero-quote">{aboutData.hero.quote}</p>
        <p className="hero-support">{aboutData.hero.support}</p>
      </section>

      <SectionNavigator
        sections={sections}
        activeSection={activeSection}
        onChange={setActiveSection}
      />

      <AboutPanel
        title={activeSectionData?.id === "identity"
          ? aboutData.identity.heading
          : activeSectionData?.label}
      >
        {renderPanel(activeSection)}
      </AboutPanel>

      <section className="about-contact">
        <span className="section-header-path">
          ~/portfolio/contact
        </span>

        <h2 className="section-header-title">
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

        <Button to={aboutData.contact.certificates.to}>
          {aboutData.contact.certificates.label}
        </Button>
      </section>
    </main>
  );
}

export default About;
