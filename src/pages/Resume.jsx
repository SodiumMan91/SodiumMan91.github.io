import PageWrapper from "../components/PageWrapper";

function Resume() {
  return (
    <PageWrapper>
      <div className="resume-container">
        <h1 className="resume-title">Resume</h1>

        <div className="resume-frame-wrapper">
          <iframe
            src="/resume/Bareja_Naman_Resume.pdf"
            title="Resume"
            className="resume-frame"
          />
        </div>
      </div>
    </PageWrapper>
  );
}

export default Resume;