import SectionHeader from "./SectionHeader";

function AboutPanel({
  path,
  title,
  children,
}) {
  return (
    <section className="about-panel">
      <SectionHeader
        path={path}
        title={title}
      />

      <div className="about-panel-content">
        {children}
      </div>
    </section>
  );
}

export default AboutPanel;
