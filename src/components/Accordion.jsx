import { useState } from "react";


function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);


  function toggle(index) {
    setOpenIndex(
      openIndex === index
        ? null
        : index
    );
  }


  return (
    <div className="accordion">

      {items.map((item, index) => {

        const isOpen =
          openIndex === index;

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
            >

              <span>
                {item.title}
              </span>

              <span className="accordion-icon">
                +
              </span>

            </button>


            <div className="accordion-content">

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
