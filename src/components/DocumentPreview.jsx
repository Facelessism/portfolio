function DocumentPreview({
  paper,
  onClick,
}) {
  const format = paper.extension.toUpperCase();

  return (
    <button
      type="button"
      className="document-preview"
      onClick={onClick}
      aria-label={`Preview ${paper.title}`}
    >
      <div className="document-preview-top">
        <span className="document-preview-format">
          {format}
        </span>

        <span className="document-preview-lines">
          <span />
          <span />
          <span />
        </span>
      </div>

      <div className="document-preview-content">
        <span className="document-preview-title">
          {paper.title}
        </span>

        <span className="document-preview-line" />
        <span className="document-preview-line short" />
        <span className="document-preview-line" />
      </div>

      <span className="document-preview-corner" />
    </button>
  );
}

export default DocumentPreview;

