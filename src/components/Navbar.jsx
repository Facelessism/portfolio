import { NavLink } from "react-router-dom";

import Container from "./Container";
import Button from "./Button";

function Navbar() {
  return (
    <header className="navbar">
      <Container>
        <nav className="navbar-content">
          <NavLink to="/"
            className="logo"
            aria-label="Home"
          >
            [===]
          </NavLink>

          <ul className="nav-links">
            <li>
              <NavLink to="/projects">
                Projects
              </NavLink>
            </li>

            <li>
              <NavLink to="/github">
                GitHub
              </NavLink>
            </li>

            <li>
              <NavLink to="/writing">
                Writing
              </NavLink>
            </li>

            <li>
              <NavLink to="/about">
                About
              </NavLink>
            </li>
          </ul>

          <Button
            href="https://github.com/Facelessism"
            variant="secondary"
            external
          >
            GitHub →
          </Button>
        </nav>
      </Container>
    </header>
  );
}

export default Navbar;
