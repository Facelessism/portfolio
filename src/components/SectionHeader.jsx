function SectionHeader({
  title,
  description,
  children,
}) {
  return (
    <header className="section-header">

      <h2 className="section-title">
        {title}
      </h2>


      {description && (
        <p className="section-description">
          {description}
        </p>
      )}


      {children}

    </header>
  );
}


export default SectionHeader;
