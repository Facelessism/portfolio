function StatsMetric({
  value,
  label,
  detail,
}) {
  return (
    <div className="stats-metric">
      <span className="stats-metric-value">
        {value}
      </span>

      <span className="stats-metric-label">
        {label}
      </span>

      {detail && (
        <span className="stats-metric-detail">
          {detail}
        </span>
      )}
    </div>
  );
}

export default StatsMetric;
