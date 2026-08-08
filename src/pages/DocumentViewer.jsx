import { Link, useParams } from "react-router-dom";

import {
  getPaper,
  getPaperUrl,
} from "../services/papers";

import Button from "../components/Button";


function DocumentViewer() {
  const { slug } = useParams();

  const paper =
    getPaper(slug);


  if (!paper) {
    return (
      <main className="document-viewer-page">

        <div className="document-viewer-empty">

          <h1>
            Document not found.
          </h1>

          <Link to="/writing">
            ← Back to writing
          </Link>

        </div>

      </main>
    );
  }


  const documentUrl =
    getPaperUrl(
      paper.filename
    );


  if (!paper.online) {
    return (
      <main className="document-viewer-page">

        <div className="document-viewer-header">

          <Link
            to="/writing"
            className="document-viewer-back"
          >
            ← Back to writing
          </Link>

          <h1>
            {paper.title}
          </h1>

          <p>
            Online reading is not currently available
            for this document format.
          </p>

          <Button
            variant="secondary"
            href={documentUrl}
            download
          >
            Download {paper.extension.toUpperCase()}
          </Button>

        </div>

      </main>
    );
  }


  return (
    <main className="document-viewer-page">

      <div className="document-viewer-header">

        <Link
          to="/writing"
          className="document-viewer-back"
        >
          ← Back to writing
        </Link>


        <div className="document-viewer-title-row">

          <div>
            <p className="document-viewer-eyebrow">
              {paper.extension.toUpperCase()}
              {" · "}
              {paper.size}
            </p>

            <h1>
              {paper.title}
            </h1>
          </div>


          <Button
            variant="secondary"
            href={documentUrl}
            download
          >
            Download
          </Button>

        </div>

      </div>


      <section
        className="document-viewer-frame"
        aria-label={`Reading ${paper.title}`}
      >
        <iframe
          src={documentUrl}
          title={paper.title}
        />
      </section>

    </main>
  );
}


export default DocumentViewer;
