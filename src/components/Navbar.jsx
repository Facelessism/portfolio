import { useState } from "react";
import { NavLink } from "react-router-dom";

import Container from "./Container";

function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen(
      (current) => !current,
    );
  }

  return (
    <header
      className={`navbar ${
        menuOpen ? "is-open" : ""
      }`}
    >
      <Container>
        <nav
          className="navbar-content"
          aria-label="Primary navigation"
        >
          <NavLink
            to="/"
            className="logo"
            aria-label="Home"
            onClick={closeMenu}
          >
            [===]
          </NavLink>

          <button
            type="button"
            className="navbar-menu-toggle"
            aria-label={
              menuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={toggleMenu}
          >
            <span />
            <span />
          </button>

          <ul
            id="primary-navigation"
            className="nav-links"
          >
            <li>
              <NavLink
                to="/github"
                className={({ isActive }) =>
                  isActive
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                GitHub
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/writing"
                className={({ isActive }) =>
                  isActive
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                Writing
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "active"
                    : ""
                }
                onClick={closeMenu}
              >
                About
              </NavLink>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Navbar;
