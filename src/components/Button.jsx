import { Link } from "react-router-dom";


function Button({
  to,
  href,
  children,
  variant = "primary",
  className = "",
  download = false,
}) {
  const classes =
    `button button-${variant} ${className}`.trim();


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


  const external =
    href?.startsWith("http");


  return (
    <a
      href={href}
      className={classes}
      download={download || undefined}
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
