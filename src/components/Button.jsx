import { Link } from "react-router-dom";

function Button({
  to,
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}) {
  const classes = `button button-${variant} ${className}`.trim();

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      {children}
    </a>
  );
}

export default Button;
