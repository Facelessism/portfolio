function StatsSectionHeader({
  number,
  title,
  description,
}) {
  return (
    <header className="stats-section-header">
      <span className="stats-section-number">
        {number}
      </span>

      <div className="stats-section-copy">
        <h3>{title}</h3>

        {description && (
          <p>{description}</p>
        )}
      </div>
    </header>
  );
}

export default StatsSectionHeader;
