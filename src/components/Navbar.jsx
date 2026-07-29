import { NavLink } from "react-router-dom";

import Container from "./Container";


function Navbar() {
  return (
    <header className="navbar">

      <Container>

        <nav className="navbar-content">

          <NavLink
            to="/"
            className="logo"
            aria-label="Home"
          >
            [===]
          </NavLink>


          <ul className="nav-links">

            <li>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                Projects
              </NavLink>
            </li>


            <li>
              <NavLink
                to="/github"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                GitHub
              </NavLink>
            </li>


            <li>
              <NavLink
                to="/writing"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                Writing
              </NavLink>
            </li>


            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
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

