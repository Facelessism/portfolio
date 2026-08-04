function TerminalCard({
  commands,
  title = "~/portfolio/about",
  shell = "main",
  variant = "blue",
}) {
  return (
    <section
      className={`terminal terminal-${variant}`}
      aria-label="Terminal"
    >
      <header className="terminal-header">

        <div className="terminal-header-left">

          <span className="terminal-location">
            {title}
          </span>

        </div>

        <div className="terminal-header-right">

          <span className="terminal-branch">
             {shell}
          </span>

        </div>

      </header>

      <div className="terminal-viewport">

        <div className="terminal-session">

          {commands.map((entry, index) => (

            <div
              key={`${entry.command}-${index}`}
              className="terminal-entry"
            >

              <div className="terminal-command">

                <span className="terminal-user">
                  {entry.prompt}
                </span>

                <span className="terminal-path">
                  {entry.path}
                </span>

                <span className="terminal-symbol">
                  ❯
                </span>

                <span className="terminal-command-text">
                  {entry.command}
                </span>

              </div>

              <div className="terminal-output">

                {entry.output.map((line) => (

                  <p key={line}>
                    {line}
                  </p>

                ))}

              </div>

            </div>

          ))}

          <div className="terminal-command">

            <span className="terminal-user">
              bighna@portfolio
            </span>

            <span className="terminal-path">
              {title}
            </span>

            <span className="terminal-symbol">
              ❯
            </span>

            <span className="terminal-cursor" />

          </div>

        </div>

      </div>

    </section>
  );
}

export default TerminalCard;
