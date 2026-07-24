import Container from "./Container";

function PageHeader({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <header className="page-header">
      <Container>
        <div className="page-header-content">
          {eyebrow && (
            <p className="page-eyebrow">
              {eyebrow}
            </p>
          )}

          <h1 className="page-title">
            {title}
          </h1>

          {description && (
            <p className="page-description">
              {description}
            </p>
          )}

          {children}
        </div>
      </Container>
    </header>
  );
}

export default PageHeader;
