import { useState } from "react";


function TopicSelector({ items }) {
  const [activeIndex, setActiveIndex] = useState(null);


  const activeItem =
    activeIndex === null
      ? null
      : items[activeIndex];


  function handleSelect(index) {
    setActiveIndex((current) =>
      current === index
        ? null
        : index
    );
  }


  return (
    <div className="topic-selector">

      <div className="topic-list">

        {items.map((item, index) => {

          const isActive =
            index === activeIndex;


          return (
            <button
              key={item.title}
              type="button"
              className={
                isActive
                  ? "topic-chip active"
                  : "topic-chip"
              }
              aria-pressed={isActive}
              onClick={() => handleSelect(index)}
            >
              {item.title}
            </button>
          );
        })}

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
                {activeItem.description}
              </p>
            </>
          )}

        </div>

      </div>

    </div>
  );
}


export default TopicSelector;
