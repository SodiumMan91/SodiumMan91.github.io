import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { projects } from "../data/projectsData";

function Projects() {
  const [openProjects, setOpenProjects] = useState([]);

  const toggleProject = (id, expandable) => {
    if (!expandable) return;

    setOpenProjects((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // Determine if a project has expandable content
  const isExpandable = (project) => {
    return (
      project.link ||
      project.content ||
      (project.images && project.images.length > 0)
    );
  };

  return (
    <PageWrapper>
      <div className="projects-container">
        <h1 className="projects-title">Projects</h1>

        <div className="projects-grid">
          {projects.map((project) => {
            const expandable = isExpandable(project);
            const isOpen = openProjects.includes(project.id);

            return (
              <div
                key={project.id}
                className={`project-tile 
                  ${isOpen ? "expanded-tile" : ""}
                  ${!expandable ? "non-expandable" : ""}
                `}
                onClick={() =>
                  toggleProject(project.id, expandable)
                }
              >
                <h3>{project.title}</h3>

                <p className="project-summary">
                  {project.summary}
                </p>

                {/* Only render expansion area if expandable */}
                {expandable && (
                  <div
                    className={`project-expanded ${
                      isOpen ? "expanded" : ""
                    }`}
                  >
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >
                        View Project →
                      </a>
                    )}

                    {project.content && (
                      <pre className="project-code">
                        {project.content}
                      </pre>
                    )}

                    {project.images &&
                      project.images.map(
                        (img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt=""
                            className="project-image"
                          />
                        )
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}

export default Projects;