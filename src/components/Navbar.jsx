function Navbar() {
  return (
    <header className="navbar">
      <nav className="container">
        <a href="/" className="logo">
          Your Name
        </a>

        <ul className="nav-links">
          <li>
            <a href="#projects">Projects</a>
          </li>

          <li>
            <a href="#opensource">Open Source</a>
          </li>

          <li>
            <a href="#contact">Contacts</a>
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
    </header>
  );
}

export default Navbar;
