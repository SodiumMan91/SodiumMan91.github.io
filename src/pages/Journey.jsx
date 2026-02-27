import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
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
  const months = toMonths(end) - toMonths(start) + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y && m) return `${y}y ${m}mo`;
  if (y) return `${y}y`;
  return `${m}mo`;
};

const CARD_H_ESTIMATE = 160; // px, used before DOM measures are available
const GAP = 16;              // px between cards
const YEAR_PADDING = 32;     // px breathing room below last card in a year band

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
  const linkUrl = typeof item.link === "string" ? item.link : item.link?.url;
  const linkLabel = typeof item.link === "string" ? null : item.link?.label;

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
            <span className={`jm-type-tag ${item.type?.toLowerCase().trim()}`}>
              {item.type?.toLowerCase().trim() === "education" ? "Education" : "Experience"}
            </span>
            <h2 className="jm-modal-title">{item.title}</h2>
            <p className="jm-modal-sub">{item.subtitle || item.subtile}</p>
            <p className="jm-modal-range">{fmtRange(item.start, item.end)}</p>
            {linkUrl && (
              <a className="jm-modal-link" href={linkUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                {linkLabel || linkUrl} ↗
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
function Card({ item, side, top, onClick, innerRef }) {
  return (
    <article
      className={`jm-card jm-card--${side}`}
      ref={innerRef}
      style={{ top }}
      onClick={() => onClick(item)}
    >
      <div className="jm-card-dot" />
      <div className="jm-card-inner">
        <header className="jm-card-header">
          <span className={`jm-type-tag ${item.type?.toLowerCase().trim()}`}>
            {item.type?.toLowerCase().trim() === "education" ? "Education" : "Experience"}
          </span>
          <span className="jm-duration">{duration(item.start, item.end)}</span>
        </header>
        <h3 className="jm-card-title">{item.title}</h3>
        <p className="jm-card-sub">{item.subtitle || item.subtile}</p>
        <p className="jm-card-range">{fmtRange(item.start, item.end)}</p>
        <span className="jm-card-cta">View details →</span>
      </div>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────
   Layout engine
   ─────────────────────────────────────────────────────────────
   Strategy:
   - Group items by their end year
   - For each year (newest first), compute band height =
       max(edu cards in year, exp cards in year) * (cardH + gap) + yearPadding
   - Stack bands top-to-bottom → year marker tops
   - Within each band, stack cards top-to-bottom starting at the band's top
   ────────────────────────────────────────────────────────────── */
function computeLayout(years, eduItems, expItems, cardHeights) {
  const getH = (id) => cardHeights[id] ?? CARD_H_ESTIMATE;

  // group by end year
  const groupByYear = (items) => {
    const map = {};
    for (const item of items) {
      const y = item.end.year;
      if (!map[y]) map[y] = [];
      map[y].push(item);
    }
    // sort each group by end date desc (most recent first within the year)
    for (const y of Object.keys(map)) {
      map[y].sort((a, b) => toMonths(b.end) - toMonths(a.end));
    }
    return map;
  };

  const eduByYear = groupByYear(eduItems);
  const expByYear = groupByYear(expItems);

  // compute year band heights & tops
  const yearMarkerTops = {};
  const yearBandTops = {};
  let cursor = 0;

  for (const year of years) {
    yearMarkerTops[year] = cursor;
    yearBandTops[year] = cursor;

    const eduCards = eduByYear[year] ?? [];
    const expCards = expByYear[year] ?? [];

    // height of this year's band = tallest column (edu vs exp)
    const colHeight = (cards) =>
      cards.reduce((acc, item) => acc + getH(item.id) + GAP, 0);

    const bandH = Math.max(colHeight(eduCards), colHeight(expCards), CARD_H_ESTIMATE + GAP);
    cursor += bandH + YEAR_PADDING;
  }

  const totalHeight = cursor;

  // position each card within its year band
  const position = (items, byYear) => {
    const positions = [];
    for (const year of years) {
      const cards = byYear[year] ?? [];
      let y = yearBandTops[year];
      for (const item of cards) {
        positions.push({ item, top: y });
        y += getH(item.id) + GAP;
      }
    }
    return positions;
  };

  return {
    yearMarkerTops,
    eduPositions: position(eduItems, eduByYear),
    expPositions: position(expItems, expByYear),
    totalHeight,
  };
}

/* ── Main ── */
export default function Journey() {
  const [active, setActive] = useState(null);
  const [activeYear, setActiveYear] = useState(null);
  const [lineProgress, setLineProgress] = useState(0);
  // card heights measured from DOM
  const [cardHeights, setCardHeights] = useState({});

  const containerRef = useRef(null);
  const sectionRefs = useRef({});
  const cardRefs = useRef({});

  const years = useMemo(() => {
    const ys = new Set(journeyItems.map(i => i.end.year));
    return Array.from(ys).sort((a, b) => b - a);
  }, []);

  const eduItems = useMemo(() =>
    journeyItems.filter(i => i.type?.toLowerCase().trim() === "education")
      .sort((a, b) => toMonths(b.end) - toMonths(a.end)), []);
  const expItems = useMemo(() =>
    journeyItems.filter(i => i.type?.toLowerCase().trim() !== "education")
      .sort((a, b) => toMonths(b.end) - toMonths(a.end)), []);

  // recompute layout whenever card heights change
  const layout = useMemo(() =>
    computeLayout(years, eduItems, expItems, cardHeights),
    [years, eduItems, expItems, cardHeights]
  );

  // measure real card heights after render, trigger re-layout once
  useLayoutEffect(() => {
    const measured = {};
    let changed = false;
    for (const [id, node] of Object.entries(cardRefs.current)) {
      if (!node) continue;
      const h = node.offsetHeight;
      if (h !== cardHeights[id]) { measured[id] = h; changed = true; }
    }
    if (changed) setCardHeights(prev => ({ ...prev, ...measured }));
  });

  // line height = bottom of the last card
  const lineHeight = useMemo(() => {
    const all = [...layout.eduPositions, ...layout.expPositions];
    return all.reduce((max, { item, top }) => {
      const h = cardHeights[item.id] ?? CARD_H_ESTIMATE;
      return Math.max(max, top + h);
    }, 0);
  }, [layout, cardHeights]);

  /* Scroll-driven line progress */
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

  /* Active year */
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
    return () => observers.forEach(o => o.disconnect());
  }, [years]);

  /* Card fade-in */
  useEffect(() => {
    const observers = [];
    for (const [, node] of Object.entries(cardRefs.current)) {
      if (!node) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { node.classList.add("visible"); obs.disconnect(); }
        },
        { rootMargin: "0px 0px 0px 0px", threshold: 0.05 }
      );
      obs.observe(node);
      observers.push(obs);
    }
    return () => observers.forEach(o => o.disconnect());
  }, [layout]);

  const { yearMarkerTops, eduPositions, expPositions, totalHeight } = layout;

  return (
    <PageWrapper>
      <div className="jm-page" ref={containerRef}>

        <div className="jm-hero">
          <p className="jm-hero-label">Career Timeline</p>
          <h1 className="jm-hero-title">My Journey</h1>
          <p className="jm-hero-sub">A record of where I've studied and worked.</p>
        </div>

        <div className="jm-col-headers">
          <div className="jm-col-header jm-col-header--left">Education</div>
          <div className="jm-col-header-spacer" />
          <div className="jm-col-header jm-col-header--right">Experience</div>
        </div>

        <div className="jm-split-timeline" style={{ height: totalHeight }}>

          {/* Left — Education */}
          <div className="jm-col jm-col--left" style={{ height: totalHeight }}>
            {eduPositions.map(({ item, top }) => (
              <Card key={item.id} item={item} side="left" top={top}
                onClick={setActive}
                innerRef={(el) => (cardRefs.current[item.id] = el)} />
            ))}
          </div>

          {/* Centre — line + year markers */}
          <div className="jm-centre" style={{ height: totalHeight }}>
            <div className="jm-line-track" style={{ height: lineHeight }}>
              <div className="jm-line-fill" style={{ transform: `scaleY(${lineProgress})` }} />
            </div>
            {years.map((year) => (
              <div
                key={year}
                className={`jm-year-marker ${activeYear === year ? "active" : ""}`}
                style={{ top: yearMarkerTops[year] }}
                ref={(el) => (sectionRefs.current[year] = el)}
              >
                {year}
              </div>
            ))}
          </div>

          {/* Right — Experience */}
          <div className="jm-col jm-col--right" style={{ height: totalHeight }}>
            {expPositions.map(({ item, top }) => (
              <Card key={item.id} item={item} side="right" top={top}
                onClick={setActive}
                innerRef={(el) => (cardRefs.current[item.id] = el)} />
            ))}
          </div>

        </div>

        <div className="jm-footer-space" />
      </div>

      {active && <Modal item={active} onClose={() => setActive(null)} />}
    </PageWrapper>
  );
}