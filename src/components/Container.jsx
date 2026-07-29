function Container({
  children,
  className = "",
  as: Component = "div",
}) {
  return (
    <Component
      className={[
        "container",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Component>
  );
}

export default Container;
