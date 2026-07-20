function Button({
  href,
  children,
  variant = "primary",
  external = false,
}) {
  const props = external
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <a
      href={href}
      className={`button button-${variant}`}
      {...props}
    >
      {children}
    </a>
  );
}

export default Button;
