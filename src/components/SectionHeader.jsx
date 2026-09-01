function SectionHeader({
  path,
  title,
  description,
  action,
  id,
}) {
  return (
    <header className="section-header">
      <div className="section-header-content">
        <span className="section-header-path">
          {path}
        </span>

        <h2
          id={id}
          className="section-header-title"
        >
          {title}
        </h2>

        {description && (
          <p className="section-header-description">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="section-header-action">
          {action}
        </div>
      )}
    </header>
  );
}

export default SectionHeader;
