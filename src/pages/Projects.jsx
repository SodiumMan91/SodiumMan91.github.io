import { useState, useEffect, useRef } from "react";
import PageWrapper from "../components/PageWrapper";
import { projects } from "../data/projectsData";

/* ── Slideshow ── */
function Slideshow({ images }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!images?.length) return;
    setIdx(0);
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 1500);
    return () => clearInterval(t);
  }, [images]);

  if (!images?.length) return null;
  return (
    <div className="pm-slideshow">
      {images.map((src, i) => (
        <img key={src} src={src} alt="" className={`pm-slide ${i === idx ? "active" : ""}`} />
      ))}
      {images.length > 1 && (
        <div className="pm-dots">
          {images.map((_, i) => (
            <button key={i} className={`pm-dot ${i === idx ? "active" : ""}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Modal ── */
function Modal({ project, onClose }) {
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const hasMedia = project.images?.length > 0;

  return (
    <div className="pm-backdrop" onClick={onClose}>
      <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pm-close" onClick={onClose}>✕</button>

        <div className={`pm-modal-body ${!hasMedia ? "no-media" : ""}`}>
          {/* Left: text */}
          <div className="pm-modal-left">
            <h2 className="pm-modal-title">{project.title}</h2>
            <p className="pm-modal-summary">{project.summary}</p>

            {project.link && (
              <a
                className="pm-modal-link"
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                View Project ↗
              </a>
            )}

            {project.content && (
              <pre className="pm-modal-code">{project.content}</pre>
            )}
          </div>

          {/* Right: images */}
          {hasMedia && (
            <div className="pm-modal-right">
              <Slideshow images={project.images} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Card ── */
function ProjectCard({ project, onClick, cardRef }) {
  const expandable = !!(project.link || project.content || project.images?.length);

  return (
    <article
      className={`pm-card ${expandable ? "clickable" : ""}`}
      ref={cardRef}
      onClick={() => expandable && onClick(project)}
    >
      <div className="pm-card-inner">
        <h3 className="pm-card-title">{project.title}</h3>
        <p className="pm-card-summary">{project.summary}</p>
        {expandable && <span className="pm-card-cta">View details →</span>}
      </div>
    </article>
  );
}

/* ── Main ── */
export default function Projects() {
  const [active, setActive] = useState(null);
  const cardRefs = useRef({});

  /* fade-in on scroll */
  useEffect(() => {
    const observers = [];
    for (const [, node] of Object.entries(cardRefs.current)) {
      if (!node) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { node.classList.add("visible"); obs.disconnect(); }
        },
        { rootMargin: "0px 0px -60px 0px" }
      );
      obs.observe(node);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <PageWrapper>
      <div className="pm-page">
        {/* Hero */}
        <div className="pm-hero">
          <p className="pm-hero-label">Selected Work</p>
          <h1 className="pm-hero-title">Projects</h1>
          <p className="pm-hero-sub">Things I've built, explored, and shipped.</p>
        </div>

        {/* Grid */}
        <div className="pm-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={setActive}
              cardRef={(el) => (cardRefs.current[project.id] = el)}
            />
          ))}
        </div>
      </div>

      {active && <Modal project={active} onClose={() => setActive(null)} />}
    </PageWrapper>
  );
}