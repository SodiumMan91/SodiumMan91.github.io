import { useState, useEffect, useRef, useMemo } from "react";
import PageWrapper from "../components/PageWrapper";
import { journeyItems } from "../data/journeyData";

/* ─── constants ─────────────────────────────────────────── */
const PX_PER_MONTH = 72;
const TRACK_HEIGHT = 64;
const TRACK_GAP = 10;
const RULER_H = 40;
const PADDING_RIGHT = 120;

const toMonths = (d) => d.year * 12 + (d.month - 1);

const fmtShort = (d) =>
  new Date(d.year, d.month - 1).toLocaleString("default", {
    month: "short",
    year: "2-digit",
  });

const fmtLong = (d) =>
  new Date(d.year, d.month - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

/* ─── track assignment (type-based: education=0, experience=1) ── */
function assignTracks(items) {
  return items.map((item) => ({
    ...item,
    track: item.type === "education" ? 0 : 1,
  }));
}

/* ─── Slideshow ──────────────────────────────────────────── */
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
    <div className="slideshow">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`slide-img ${i === idx ? "active" : ""}`}
        />
      ))}
      <div className="slide-dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === idx ? "active" : ""}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Detail Panel ───────────────────────────────────────── */
function DetailPanel({ item, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!item) return null;

  const typeLabel = item.type === "education" ? "EDUCATION" : "EXPERIENCE";

  return (
    <div className="detail-panel">
      {/* Left col top: text info */}
      <div className="detail-header">
        <button className="detail-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <span className={`type-badge ${item.type}`}>{typeLabel}</span>
        <h2 className="detail-title">{item.title}</h2>
        <p className="detail-subtitle">{item.subtitle}</p>
        <p className="detail-dates">
          {fmtLong(item.start)} &mdash; {fmtLong(item.end)}
        </p>
      </div>

      {/* Left col bottom: bullets */}
      <div className="detail-bullets-wrapper">
        <ul className="detail-bullets">
          {item.details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>

      {/* Right col: large slideshow */}
      <div className="detail-header-right">
        {item.images?.length > 0
          ? <Slideshow images={item.images} />
          : <div className="no-images">No images available</div>
        }
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
export default function Journey() {
  const [active, setActive] = useState(null);
  const scrollRef = useRef(null);

  const trackedItems = useMemo(() => assignTracks(journeyItems), []);
  const numTracks = 2;

  const minMonth = useMemo(
    () => Math.min(...trackedItems.map((i) => toMonths(i.start))),
    [trackedItems]
  );
  const maxMonth = useMemo(
    () => Math.max(...trackedItems.map((i) => toMonths(i.end))),
    [trackedItems]
  );

  /* ruler ticks — one per quarter */
  const ticks = useMemo(() => {
    const result = [];
    const startYear = Math.floor(minMonth / 12);
    const endYear = Math.ceil(maxMonth / 12);
    for (let y = startYear; y <= endYear; y++) {
      for (let q = 0; q < 4; q++) {
        const m = y * 12 + q * 3;
        if (m >= minMonth - 3 && m <= maxMonth + 3) {
          result.push({ month: m, label: q === 0 ? String(y) : "" });
        }
      }
    }
    return result;
  }, [minMonth, maxMonth]);

  /* total canvas width */
  const totalWidth =
    (maxMonth - minMonth + 6) * PX_PER_MONTH + PADDING_RIGHT;
  const timelineH = numTracks * (TRACK_HEIGHT + TRACK_GAP) + TRACK_GAP;

  /* x position: recent = left, old = right  (reversed axis) */
  const xOf = (months) => (maxMonth - months + 3) * PX_PER_MONTH;

  /* scroll to most recent on mount */
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, []);

  return (
    <PageWrapper>
      <div className="jv-page">
        <h1 className="jv-title">MY JOURNEY</h1>

        {/* ── Detail panel (above timeline) ── */}
        <div className={`detail-zone ${active ? "has-content" : ""}`}>
          {active ? (
            <DetailPanel item={active} onClose={() => setActive(null)} />
          ) : (
            <div className="detail-placeholder">
              <span>Select a clip to view details</span>
            </div>
          )}
        </div>

        {/* ── Timeline editor ── */}
        <div className="jv-editor">
          {/* Track labels on the left */}
          <div className="track-labels" style={{ height: timelineH + RULER_H }}>
            <div className="ruler-spacer" style={{ height: RULER_H }} />
            {["EDUCATION", "EXPERIENCE"].map((label, t) => (
              <div
                key={t}
                className="track-label"
                style={{ height: TRACK_HEIGHT, marginBottom: TRACK_GAP }}
              >
                <span style={{ color: t === 0 ? "#00f7ff" : "#ffb400" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Scrollable canvas */}
          <div className="timeline-scroll" ref={scrollRef}>
            <svg
              className="timeline-svg"
              width={totalWidth}
              height={timelineH + RULER_H}
            >
              {/* ── ruler background ── */}
              <rect
                x={0} y={0} width={totalWidth} height={RULER_H}
                fill="#1a1a1a"
              />

              {/* ── track backgrounds ── */}
              {Array.from({ length: numTracks }).map((_, t) => (
                <rect
                  key={t}
                  x={0}
                  y={RULER_H + t * (TRACK_HEIGHT + TRACK_GAP) + TRACK_GAP}
                  width={totalWidth}
                  height={TRACK_HEIGHT}
                  fill={t % 2 === 0 ? "#151515" : "#111"}
                />
              ))}

              {/* ── track dividers ── */}
              {Array.from({ length: numTracks + 1 }).map((_, t) => (
                <line
                  key={t}
                  x1={0}
                  x2={totalWidth}
                  y1={RULER_H + t * (TRACK_HEIGHT + TRACK_GAP)}
                  y2={RULER_H + t * (TRACK_HEIGHT + TRACK_GAP)}
                  stroke="#2a2a2a"
                  strokeWidth={1}
                />
              ))}

              {/* ── ruler ticks ── */}
              {ticks.map(({ month, label }) => {
                const x = xOf(month);
                const isMajor = label !== "";
                return (
                  <g key={month}>
                    <line
                      x1={x} x2={x}
                      y1={isMajor ? 0 : RULER_H * 0.5}
                      y2={RULER_H}
                      stroke={isMajor ? "#00f7ff" : "#333"}
                      strokeWidth={isMajor ? 1.5 : 1}
                    />
                    {isMajor && (
                      <text
                        x={x + 5}
                        y={RULER_H * 0.55}
                        fill="#00f7ff"
                        fontSize={11}
                        fontFamily="'Courier New', monospace"
                        dominantBaseline="middle"
                      >
                        {label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* ── item blocks ── */}
              {trackedItems.map((item) => {
                const s = toMonths(item.start);
                const e = toMonths(item.end);
                const x = xOf(e); // right side of block = end date
                const w = (e - s) * PX_PER_MONTH;
                const y =
                  RULER_H +
                  item.track * (TRACK_HEIGHT + TRACK_GAP) +
                  TRACK_GAP;
                const isActive = active?.id === item.id;
                const isEdu = item.type === "education";

                return (
                  <g
                    key={item.id}
                    className="clip-group"
                    onClick={() =>
                      setActive(isActive ? null : item)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {/* block body */}
                    <rect
                      x={x + 2}
                      y={y + 2}
                      width={w - 4}
                      height={TRACK_HEIGHT - 4}
                      rx={5}
                      ry={5}
                      fill={
                        isEdu
                          ? isActive
                            ? "rgba(0,247,255,0.35)"
                            : "rgba(0,247,255,0.1)"
                          : isActive
                          ? "rgba(255,180,0,0.35)"
                          : "rgba(255,180,0,0.1)"
                      }
                      stroke={isEdu ? "#00f7ff" : "#ffb400"}
                      strokeWidth={isActive ? 2 : 1}
                    />

                    {/* left accent stripe */}
                    <rect
                      x={x + 2}
                      y={y + 2}
                      width={4}
                      height={TRACK_HEIGHT - 4}
                      rx={3}
                      fill={isEdu ? "#00f7ff" : "#ffb400"}
                    />

                    {/* title text */}
                    <text
                      x={x + 14}
                      y={y + TRACK_HEIGHT * 0.4}
                      fill="#fff"
                      fontSize={12}
                      fontFamily="'Courier New', monospace"
                      fontWeight="600"
                      clipPath={`url(#clip-${item.id})`}
                    >
                      {item.title}
                    </text>

                    {/* date text */}
                    <text
                      x={x + 14}
                      y={y + TRACK_HEIGHT * 0.68}
                      fill={isActive ? "#fff" : (isEdu ? "#00f7ff" : "#ffb400")}
                      fontSize={10}
                      fontFamily="'Courier New', monospace"
                      clipPath={`url(#clip-${item.id})`}
                    >
                      {fmtShort(item.start)} – {fmtShort(item.end)}
                    </text>

                    {/* clip mask to keep text inside block */}
                    <clipPath id={`clip-${item.id}`}>
                      <rect
                        x={x + 8}
                        y={y}
                        width={w - 16}
                        height={TRACK_HEIGHT}
                      />
                    </clipPath>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div className="jv-legend">
          <span className="legend-item edu">■ Education</span>
          <span className="legend-item exp">■ Experience</span>
        </div>
      </div>
    </PageWrapper>
  );
}