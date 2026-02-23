import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" end className="nav-link">
          Home
        </NavLink>
        <NavLink to="/journey" className="nav-link">
          My Journey
        </NavLink>
        <NavLink to="/projects" className="nav-link">
          Projects
        </NavLink>
        <NavLink to="/resume" className="nav-link">
          Resume
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;