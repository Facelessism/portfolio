import Container from "./Container";

function Navbar() {
  return (
    <header className="navbar">
      <Container>
        <nav className="navbar-content">
          <a href="#" className="logo" aria-label="Home">
            [===]
          </a>

          <ul className="nav-links">
            <li>
              <a href="#work">Work</a>
            </li>

            <li>
              <a href="#writing">Writing</a>
            </li>

            <li>
              <a href="#about">About</a>
            </li>
          </ul>

          <a
            href="https://github.com/Facelessism"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            GitHub
          </a>
        </nav>
      </Container>
    </header>
  );
}

export default Navbar;
