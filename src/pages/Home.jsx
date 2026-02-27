import { useState } from "react";
import { FaPhone, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

import AnimatedBackground from "../components/AnimatedBackground";
import FadeInSection from "../components/FadeInSection";
import ContactPopup from "../components/ContactPopup";
import { WrappedContext } from "../components/PageWrapper";

import Journey from "./Journey";
import Projects from "./Projects";
import Resume from "./Resume";

function Home() {
  const [popupType, setPopupType] = useState(null);

  return (
    // Provide context so every nested PageWrapper becomes a passthrough
    <WrappedContext.Provider value={true}>
      <AnimatedBackground />
      <div className="page-wrapper">

        {/* ── HOME ── */}
        <section id="section-home">
          <div className="home-page">
            <section className="hero-section">
              <h1 className="hero-name-landing">Naman Bareja</h1>
              <p className="hero-tagline-landing">
                Data Science & NLP Researcher | Deep Learning | Social & Biomedical Data |
                MS Data Science, Columbia University | Seeking Full-Time Data Science Roles
              </p>
            </section>

            <section className="home-content">
              <FadeInSection>
                <div className="icon-row">
                  <FaPhone onClick={() => setPopupType("phone")} />
                  <FaEnvelope onClick={() => setPopupType("email")} />
                  <a href="https://github.com/SodiumMan91" target="_blank" rel="noreferrer">
                    <FaGithub />
                  </a>
                  <a href="https://www.linkedin.com/in/namanbareja/" target="_blank" rel="noreferrer">
                    <FaLinkedin />
                  </a>
                </div>
              </FadeInSection>

              {popupType && (
                <ContactPopup type={popupType} close={() => setPopupType(null)} />
              )}

              <FadeInSection>
                <h2 className="about-header">About Me</h2>
              </FadeInSection>

              <FadeInSection>
                <p className="about-text">
                  I'm a Data Science graduate from Columbia University with experience in applying
                  machine learning and NLP to real-world problems across healthcare, finance,
                  and behavioral research.
                </p>
              </FadeInSection>

              <FadeInSection>
                <p className="about-text">
                  My work spans building hierarchical NLP pipelines for public health research,
                  developing computer vision systems for behavioral quantification, and
                  re-engineering large-scale credit risk models across 500K+ financial records.
                  I'm particularly interested in applied machine learning roles where rigorous
                  modeling directly informs strategic or operational decision-making.
                </p>
              </FadeInSection>

              <FadeInSection>
                <p className="about-text">
                  Beyond technical work, I've served as President of the Data Science Institute
                  Student Council and as a Teaching Assistant for Deep Learning for NLP,
                  mentoring students on transformer architectures and applied modeling practices.

                </p>
              </FadeInSection>

              <FadeInSection>
                <p className="about-text">

                  Outside of work, you'll find me knitting 🧶, dancing 💃, sewing 🧵, or cooking 🍳.
                </p>
              </FadeInSection>

              <FadeInSection>
                <p className="about-text">
                  I'm especially drawn to roles in applied machine learning, healthcare analytics,
                  enterprise AI, and risk modeling — environments where thoughtful, structured
                  problem-solving drives measurable impact. If you're working on meaningful ML
                  applications in these spaces, I'd welcome the opportunity to connect.
                </p>
              </FadeInSection>
            </section>
          </div>
        </section>

        {/* ── JOURNEY ── */}
        <section id="section-journey">
          <Journey />
        </section>

        {/* ── PROJECTS ── */}
        <section id="section-projects">
          <Projects />
        </section>

        {/* ── RESUME ── */}
        <section id="section-resume">
          <Resume />
        </section>

      </div>
    </WrappedContext.Provider>
  );
}

export default Home;