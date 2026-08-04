import SectionHeader from "./SectionHeader";

function AboutPanel({
  title,
  children,
}) {
  return (
    <section className="about-panel">
      <SectionHeader title={title} />

      {children}
    </section>
  );
}

export default AboutPanel;
