import { useState, useEffect, useRef, useMemo } from "react";
import PageWrapper from "../components/PageWrapper";
import { journeyItems } from "../data/journeyData";

/* ── helpers ── */
const toMonths = (d) => d.year * 12 + (d.month - 1);

const fmtRange = (start, end) => {
  const fmt = (d) =>
    new Date(d.year, d.month - 1).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
  return `${fmt(start)} — ${fmt(end)}`;
};

const duration = (start, end) => {
  const months = toMonths(end) - toMonths(start);
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y && m) return `${y}y ${m}mo`;
  if (y) return `${y}y`;
  return `${m}mo`;
};

/* ── group items by year (start year), sorted newest first ── */
function groupByYear(items) {
  const sorted = [...items].sort(
    (a, b) => toMonths(b.start) - toMonths(a.start)
  );
  const map = new Map();
  for (const item of sorted) {
    const y = item.start.year;
    if (!map.has(y)) map.set(y, []);
    map.get(y).push(item);
  }
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
}

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
    <div className="jm-slideshow">
      {images.map((src, i) => (
        <img key={src} src={src} alt="" className={`jm-slide ${i === idx ? "active" : ""}`} />
      ))}
      {images.length > 1 && (
        <div className="jm-dots">
          {images.map((_, i) => (
            <button key={i} className={`jm-dot ${i === idx ? "active" : ""}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Modal ── */
function Modal({ item, onClose }) {
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="jm-backdrop" onClick={onClose}>
      <div className="jm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="jm-close" onClick={onClose}>✕</button>
        <div className="jm-modal-body">
          <div className="jm-modal-left">
            <span className={`jm-type-tag ${item.type}`}>
              {item.type === "education" ? "Education" : "Experience"}
            </span>
            <h2 className="jm-modal-title">{item.title}</h2>
            <p className="jm-modal-sub">{item.subtitle}</p>
            <p className="jm-modal-range">{fmtRange(item.start, item.end)}</p>
            {item.link && (
              <a className="jm-modal-link" href={item.link.url} target="_blank" rel="noopener noreferrer">
                {item.link.label || item.link.url} ↗
              </a>
            )}
            <ul className="jm-modal-bullets">
              {item.details.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
          {item.images?.length > 0 && (
            <div className="jm-modal-right">
              <Slideshow images={item.images} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Card ── */
function Card({ item, onClick, innerRef }) {
  return (
    <article className="jm-card" ref={innerRef} onClick={() => onClick(item)}>
      <div className="jm-card-dot" />
      <div className="jm-card-inner">
        <header className="jm-card-header">
          <span className={`jm-type-tag ${item.type}`}>
            {item.type === "education" ? "Education" : "Experience"}
          </span>
          <span className="jm-duration">{duration(item.start, item.end)}</span>
        </header>
        <h3 className="jm-card-title">{item.title}</h3>
        <p className="jm-card-sub">{item.subtitle}</p>
        <p className="jm-card-range">{fmtRange(item.start, item.end)}</p>
        <span className="jm-card-cta">View details →</span>
      </div>
    </article>
  );
}

/* ── Main ── */
export default function Journey() {
  const [active, setActive] = useState(null);
  const [activeYear, setActiveYear] = useState(null);
  const [lineProgress, setLineProgress] = useState(0);

  const containerRef = useRef(null);
  const sectionRefs = useRef({});
  const cardRefs = useRef({});

  const groups = useMemo(() => groupByYear(journeyItems), []);

  /* scroll-driven line growth */
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top + window.innerHeight * 0.3);
      const total = el.scrollHeight - window.innerHeight * 0.7;
      setLineProgress(Math.min(1, scrolled / Math.max(1, total)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* active year via IntersectionObserver */
  useEffect(() => {
    const observers = [];
    for (const [year, node] of Object.entries(sectionRefs.current)) {
      if (!node) continue;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveYear(Number(year)); },
        { rootMargin: "-20% 0px -60% 0px" }
      );
      obs.observe(node);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [groups]);

  /* card fade-in */
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
  }, [groups]);

  return (
    <PageWrapper>
      <div className="jm-page" ref={containerRef}>

        <div className="jm-hero">
          <p className="jm-hero-label">Career Timeline</p>
          <h1 className="jm-hero-title">My Journey</h1>
          <p className="jm-hero-sub">A record of where I've studied and worked.</p>
        </div>

        <div className="jm-timeline">
          {/* Scroll-driven line */}
          <div className="jm-line-track">
            <div className="jm-line-fill" style={{ transform: `scaleY(${lineProgress})` }} />
          </div>

          {/* Year groups */}
          <div className="jm-groups">
            {groups.map(([year, items]) => (
              <section
                key={year}
                className="jm-year-group"
                ref={(el) => (sectionRefs.current[year] = el)}
              >
                <div className={`jm-year-marker ${activeYear === year ? "active" : ""}`}>
                  {year}
                </div>
                <div className="jm-cards">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      item={item}
                      onClick={setActive}
                      innerRef={(el) => (cardRefs.current[item.id] = el)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="jm-footer-space" />
      </div>

      {active && <Modal item={active} onClose={() => setActive(null)} />}
    </PageWrapper>
  );
}