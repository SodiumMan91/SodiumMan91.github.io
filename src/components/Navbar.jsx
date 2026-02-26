import { useEffect, useState } from "react";

const sections = [
  { label: "Home",       id: "section-home"     },
  { label: "My Journey", id: "section-journey"  },
  { label: "Projects",   id: "section-projects" },
  { label: "Resume",     id: "section-resume"   },
];

function Navbar() {
  const [activeId, setActiveId] = useState("section-home");

  /* Highlight the nav link whose section is currently in view */
  useEffect(() => {
    const observers = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navH = document.querySelector(".navbar")?.offsetHeight ?? 64;
    const top = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {sections.map(({ label, id }) => (
          <button
            key={id}
            className={`nav-link ${activeId === id ? "active" : ""}`}
            onClick={() => scrollTo(id)}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;