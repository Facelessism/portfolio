import { useLayoutEffect, useRef, useState } from "react";

function SectionNavigator({
  sections,
  activeSection,
  onChange,
}) {
  const tabRefs = useRef([]);
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
  });

  useLayoutEffect(() => {
    const index = sections.findIndex(
      ({ id }) => id === activeSection
    );

    const tab = tabRefs.current[index];

    if (!tab) {
      return;
    }

    setIndicator({
      left: tab.offsetLeft,
      width: tab.offsetWidth,
    });

    tab.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeSection, sections]);

  function handleKeyDown(event) {
    const current = sections.findIndex(
      ({ id }) => id === activeSection
    );

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();

        onChange(
          sections[
            (current + 1) %
              sections.length
          ].id
        );

        break;

      case "ArrowLeft":
        event.preventDefault();

        onChange(
          sections[
            (current -
              1 +
              sections.length) %
              sections.length
          ].id
        );

        break;

      case "Home":
        event.preventDefault();

        onChange(sections[0].id);

        break;

      case "End":
        event.preventDefault();

        onChange(
          sections[
            sections.length - 1
          ].id
        );

        break;

      default:
        break;
    }
  }

  return (
    <nav
      className="section-navigator"
      aria-label="About navigation"
    >
      <div
        className="section-track"
        role="tablist"
        onKeyDown={handleKeyDown}
      >
        <span
          className="section-indicator"
          aria-hidden="true"
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
          }}
        />

        {sections.map((section, index) => (
          <button
            key={section.id}
            ref={(element) =>
              (tabRefs.current[index] =
                element)
            }
            type="button"
            role="tab"
            tabIndex={
              section.id === activeSection
                ? 0
                : -1
            }
            aria-selected={
              section.id === activeSection
            }
            className={
              section.id === activeSection
                ? "section-tab active"
                : "section-tab"
            }
            onClick={() =>
              onChange(section.id)
            }
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default SectionNavigator;

