import { useState } from "react";

function TopicSelector({ items }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const activeItem =
    activeIndex === null
      ? null
      : items[activeIndex];

  function handleSelect(index) {
    setActiveIndex(
      activeIndex === index
        ? null
        : index
    );
  }

  return (
    <div className="topic-selector">

      <div className="topic-list">

        {items.map((item, index) => (

          <button
            key={item.title}
            type="button"
            className={
              index === activeIndex
                ? "topic-chip active"
                : "topic-chip"
            }
            onClick={() => handleSelect(index)}
          >
            {item.title}
          </button>

        ))}

      </div>

      <div
        className={
          activeItem
            ? "topic-panel active"
            : "topic-panel"
        }
      >

        <div className="topic-panel-content">

          {activeItem && (
            <>
              <h3 className="topic-title">
                {activeItem.title}
              </h3>

              <p className="topic-description">
                {activeItem.content}
              </p>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default TopicSelector;
