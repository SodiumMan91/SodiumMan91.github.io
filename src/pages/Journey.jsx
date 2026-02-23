import { useState, useMemo } from "react";
import PageWrapper from "../components/PageWrapper";
import { journeyItems } from "../data/journeyData";

function Journey() {
  const [openItems, setOpenItems] = useState([]);

  const toggleCard = (id) => {
    setOpenItems((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const toMonths = (date) => date.year * 12 + date.month;

  const { sortedItems, years } = useMemo(() => {
    const sorted = [...journeyItems].sort(
      (a, b) => toMonths(b.end) - toMonths(a.end)
    );

    const allStart = sorted.map((i) => toMonths(i.start));
    const allEnd = sorted.map((i) => toMonths(i.end));

    const minTime = Math.min(...allStart);
    const maxTime = Math.max(...allEnd);

    const startYear = Math.floor(minTime / 12);
    const endYear = Math.ceil(maxTime / 12);

    const years = [];
    for (let y = endYear; y >= startYear; y--) {
      years.push(y);
    }

    return { sortedItems: sorted, years };
  }, []);

  const SCALE = 6; // px per month (visually balanced)

  const formatMonthYear = ({ month, year }) => {
  const date = new Date(year, month - 1);
  return date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
    };

  return (
    <PageWrapper>
      <div className="journey-container">
        <h1 className="journey-title">My Journey</h1>

        <div className="timeline-wrapper">
          <div className="timeline-line" />

          <div className="timeline-content">
            {years.map((year, index) => {
              const yearStart = year * 12;
              const nextYearStart =
                index === 0 ? null : years[index - 1] * 12;

              return (
                <div key={year}>
                  {/* Year Marker */}
                  <div className="year-marker">
                    <span>{year}</span>
                  </div>

                  {/* Items for this year */}
                  {sortedItems
                    .filter(
                      (item) =>
                        toMonths(item.end) >= yearStart &&
                        (nextYearStart === null ||
                          toMonths(item.end) < nextYearStart)
                    )
                    .map((item) => {
                      const duration =
                        toMonths(item.end) -
                        toMonths(item.start);

                      return (
                        <div key={item.id}>
                          {/* Spacer proportional to duration */}
                          <div
                            style={{
                              height: `${duration * SCALE}px`,
                            }}
                          />

                          <div
                            className={`timeline-item ${
                              item.type === "education"
                                ? "left"
                                : "right"
                            }`}
                          >
                            <div
                              className="timeline-card"
                              onClick={() =>
                                toggleCard(item.id)
                              }
                            >
                              <h3>{item.title}</h3>
                              <p>{item.subtitle}</p>

                              <span className="timeline-years">
                                  {`${formatMonthYear(item.start)} – ${formatMonthYear(item.end)}`}
                                </span>

                              {/* Smooth Expansion Wrapper */}
                              <div
                                className={`timeline-expanded ${
                                  openItems.includes(item.id)
                                    ? "expanded"
                                    : ""
                                }`}
                              >
                                <ul>
                                  {item.details.map(
                                    (d, i) => (
                                      <li key={i}>
                                        {d}
                                      </li>
                                    )
                                  )}
                                </ul>

                                {/* Multiple Images Support */}
                                {item.images &&
                                  item.images.map(
                                    (img, index) => (
                                      <img
                                        key={index}
                                        src={img}
                                        alt=""
                                        className="timeline-image"
                                      />
                                    )
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Journey;