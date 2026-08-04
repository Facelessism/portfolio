import { useState } from "react";

function TopicSelector({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = items[activeIndex];

  return (
    <div className="topic-selector">
      <aside
        className="topic-sidebar"
        aria-label="Topics"
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={item.title}
              type="button"
              className={
                isActive
                  ? "topic-item active"
                  : "topic-item"
              }
              aria-current={isActive}
              onClick={() => setActiveIndex(index)}
            >
              <span className="topic-item-indicator" />

              <span className="topic-item-label">
                {item.title}
              </span>
            </button>
          );
        })}
      </aside>

      <article
        key={activeItem.title}
        className="topic-view"
      >
        <h3 className="topic-title">
          {activeItem.title}
        </h3>

        <p className="topic-description">
          {activeItem.description}
        </p>
      </article>
    </div>
  );
}

export default TopicSelector;
