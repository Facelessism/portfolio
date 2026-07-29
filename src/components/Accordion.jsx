import { useState } from "react";


function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);


  function toggle(index) {
    setOpenIndex((current) =>
      current === index
        ? null
        : index
    );
  }


  return (
    <div className="accordion">

      {items.map((item, index) => {
        const isOpen =
          openIndex === index;

        const contentId =
          `accordion-content-${index}`;


        return (
          <article
            key={item.title}
            className={`accordion-item ${
              isOpen ? "open" : ""
            }`}
          >

            <button
              type="button"
              className="accordion-trigger"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              aria-controls={contentId}
            >

              <span>
                {item.title}
              </span>

              <span
                className="accordion-icon"
                aria-hidden="true"
              >
                {isOpen ? "−" : "+"}
              </span>

            </button>


            <div
              id={contentId}
              className="accordion-content"
            >
              <p>
                {item.description}
              </p>
            </div>

          </article>
        );
      })}

    </div>
  );
}


export default Accordion;
