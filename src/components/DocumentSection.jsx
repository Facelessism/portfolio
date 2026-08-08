import { useNavigate } from "react-router-dom";

import {
  getPapers,
  getPaperUrl,
} from "../services/papers";

import Button from "./Button";
import DocumentPreview from "./DocumentPreview";


function DocumentSection() {
  const papers = getPapers();

  const navigate =
    useNavigate();


  function openPaper(paper) {
    if (paper.online) {
      navigate(
        `/writing/document/${paper.slug}`
      );

      return;
    }

    window.open(
      getPaperUrl(paper.filename),
      "_blank",
      "noopener,noreferrer"
    );
  }


  return (
    <section className="document-section">

      <div className="section-header">

        <p className="section-eyebrow">
          Papers & Documents
        </p>

        <h2>
          Research, reports and technical work.
        </h2>

        <p>
          Reports, research papers, presentations and
          other technical documents.
        </p>

      </div>


      {papers.length > 0 ? (
        <div className="document-grid">

          {papers.map((paper) => {

            const documentUrl =
              getPaperUrl(
                paper.filename
              );


            return (
              <article
                key={paper.id}
                className="document-card"
              >

                <DocumentPreview
                  paper={paper}
                  onClick={() =>
                    openPaper(paper)
                  }
                />


                <div className="document-card-content">

                  <div className="document-card-heading">

                    <h3>
                      {paper.title}
                    </h3>

                    <span className="document-format">
                      {paper.extension.toUpperCase()}
                    </span>

                  </div>


                  <p className="document-filename">
                    {paper.filename}
                    {" · "}
                    {paper.size}
                  </p>


                  <div className="document-actions">

                    {paper.online && (
                      <Button
                        variant="secondary"
                        to={`/writing/document/${paper.slug}`}
                      >
                        Read online
                      </Button>
                    )}


                    <Button
                      variant="secondary"
                      href={documentUrl}
                      download
                    >
                      Download
                    </Button>

                  </div>

                </div>

              </article>
            );
          })}

        </div>
      ) : (
        <p className="section-empty">
          No papers or documents available yet.
        </p>
      )}

    </section>
  );
}


export default DocumentSection;
