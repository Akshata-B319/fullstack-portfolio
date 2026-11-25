import { useState, useMemo } from "react";
import {
  profileInfo,
  aboutMe,
  technicalSkills,
  projects,
  education,
  internshipsAndExperience,
  certifications,
} from "./data/portfolioData";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SKILL_LEVELS = {
  HTML: 90,
  CSS: 88,
  JavaScript: 86,
  "React.js": 88,
  "Node.js": 85,
  "Express.js": 85,
  MongoDB: 85,
  "REST APIs": 86,
  Git: 88,
  GitHub: 90,
  Python: 84,
  "CNN / XGBoost / Random Forest": 82,
  SPRT: 80,
};

export default function App() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cmd, setCmd] = useState("status");

  const [activeSkillTab, setActiveSkillTab] = useState("All");
  const [activeProjectFilter, setActiveProjectFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const skillCategories = useMemo(
    () => ["All", ...technicalSkills.map((group) => group.category)],
    []
  );

  const flattenedSkills = useMemo(() => {
    const groups =
      activeSkillTab === "All"
        ? technicalSkills
        : technicalSkills.filter((g) => g.category === activeSkillTab);

    return groups.flatMap((group) =>
      group.items.map((item) => ({
        name: item,
        category: group.category,
        level: SKILL_LEVELS[item] || 82,
      }))
    );
  }, [activeSkillTab]);

  const projectFilters = useMemo(() => {
    const statuses = new Set(["All"]);
    projects.forEach((p) => {
      if (p.status) statuses.add(p.status);
    });
    return Array.from(statuses);
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeProjectFilter === "All") return projects;
    return projects.filter((p) => p.status === activeProjectFilter);
  }, [activeProjectFilter]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "loading", text: "Sending message..." });

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormStatus({
          type: "error",
          text: data.error || "Failed to send message.",
        });
        setIsSubmitting(false);
        return;
      }

      setFormStatus({
        type: "success",
        text: data.message || "Message sent successfully!",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setFormStatus({
        type: "error",
        text: "Could not reach the server. Check that the backend is running.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <a href="#home" className="brand">
          {profileInfo.displayName || profileInfo.name}
        </a>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#resume">Resume</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="container">
        <section id="home" className="hero-section">
          <div className="hero-content">
            <span className="eyebrow">HELLO!</span>
            <h1 className="hero-title">
              I&apos;m <span>{profileInfo.name}</span>
            </h1>
            <p className="hero-role">{profileInfo.role}</p>
            <p className="hero-tagline">{profileInfo.tagline}</p>

            <div className="btn-row">
              {profileInfo.githubUrl && (
                <a
                  href={profileInfo.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  GITHUB
                </a>
              )}
              {profileInfo.linkedinUrl && (
                <a
                  href={profileInfo.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  LINKEDIN
                </a>
              )}
              <a href="#contact" className="btn btn-subtle">
                CONTACT ME
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="portrait-frame">
              <img
                src={profileInfo .photoUrl || "/aksh.image.jpeg"}
                alt={profileInfo.name}
                className="portrait-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextSibling) {
                    e.currentTarget.nextSibling.style.display = "flex";
                  }
                }}
              />
              <div className="portrait-fallback" style={{ display: "none" }}>
                <span className="initials">
                  {(profileInfo.displayName || profileInfo.name || "A")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <p>Place profile.jpg inside client/public/</p>
              </div>
              <div className="floating-badge">
                <span className="dot" /> DevOps &amp; AI
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section about-grid">
          <div className="about-left card-surface">
            <div className="mini-profile">
              
              </div>
              <div className="mini-terminal">
  <div className="term-bar">
    
    <span className="term-title">akshatabasutkar0@gmail.com:</span>
  </div>

  <div className="term-body">
    
    {cmd === "status" && <p className="term-out">● Open to DevOps &amp; Cloud Internships / Roles</p>}
    {cmd === "stack" && <p className="term-out">Linux • Docker • CI/CD • Git/GitHub • Cloud • MERN</p>}
    {cmd === "pipeline" && <p className="term-out">Build ✓ → Test ✓ → Containerize ✓ → Deploy Ready</p>}
    {cmd === "contact" && <p className="term-out"><a href="#contact" className="term-link">Open Contact Form →</a></p>}
  </div>

  <div className="term-cmds">
    <button type="button" className={cmd === "status" ? "t-btn active" : "t-btn"} onClick={() => setCmd("status")}>status</button>
    <button type="button" className={cmd === "stack" ? "t-btn active" : "t-btn"} onClick={() => setCmd("stack")}>stack</button>
    <button type="button" className={cmd === "pipeline" ? "t-btn active" : "t-btn"} onClick={() => setCmd("pipeline")}>pipeline</button>
    <button type="button" className={cmd === "contact" ? "t-btn active" : "t-btn"} onClick={() => setCmd("contact")}>contact</button>
  </div>
</div>
              </div>
            

            <div className="skills-header-row">
              <h3>Technical Skills</h3>
              <div className="pill-tabs">
                {skillCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`pill-tab ${activeSkillTab === cat ? "active" : ""}`}
                    onClick={() => setActiveSkillTab(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="skill-bars">
              {flattenedSkills.map((skill) => (
                <div key={`${skill.category}-${skill.name}`} className="skill-bar-item">
                  <div className="skill-bar-label">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

          <div className="about-right">
            <div className="section-heading-wrap left-align">
              <span className="watermark">About</span>
              <h2>About Me</h2>
            </div>
            <p className="about-summary">{aboutMe.summary}</p>

            <ul className="highlight-list">
              {aboutMe.highlights.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <div className="profile-kv-grid">
              <div className="kv-row">
                <span className="kv-key">Role:</span>
                <span className="kv-val">{profileInfo.role}</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Location:</span>
                <span className="kv-val">{profileInfo.location}</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Interests:</span>
                <span className="kv-val">DevOps, Cloud Computing, CI/CD, Automation</span>
              </div>
            </div>

            <div className="about-cta-row">
              <div className="project-counter">
                <strong>{projects.length}+</strong> Projects completed
              </div>
              {profileInfo.githubUrl && (
                <a
                  href={profileInfo.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  GITHUB
                </a>
              )}
            </div>
          </div>
        </section>

        <section id="resume" className="section">
          <div className="section-heading-wrap">
            <span className="watermark">Resume</span>
            <h2>Education &amp; Experience</h2>
          </div>

          <h3 className="subsection-title">Education</h3>
          <div className="divider-line" />
          <div className="two-col-grid">
            {education.map((edu, idx) => (
              <article key={idx} className="resume-card card-surface">
                <span className="gold-period">{edu.period}</span>
                <h4>{edu.degree}</h4>
                <p className="org-caps">{edu.institution}</p>
                <p className="card-body-text">{edu.details}</p>
              </article>
            ))}
          </div>

          <h3 className="subsection-title" style={{ marginTop: "2.5rem" }}>
            Internships &amp; Experience
          </h3>
          <div className="divider-line" />
          {internshipsAndExperience.length === 0 ? (
            <p className="meta-center">No internships or work experience added yet.</p>
          ) : (
            <div className="two-col-grid">
              {internshipsAndExperience.map((exp, idx) => (
                <article key={idx} className="resume-card card-surface">
                  <span className="gold-period">{exp.period}</span>
                  <h4>{exp.role}</h4>
                  <p className="org-caps">{exp.organization}</p>
                  <p className="card-body-text">{exp.summary}</p>
                </article>
              ))}
            </div>
          )}

          <h3 className="subsection-title" style={{ marginTop: "2.5rem" }}>
            Certifications
          </h3>
          <div className="divider-line" />
          {certifications.length === 0 ? (
            <p className="meta-center">No certifications added yet.</p>
          ) : (
            <div className="three-col-grid">
              {certifications.map((cert, idx) => (
                <article key={idx} className="cert-card card-surface">
                  <div className="cert-badge-header">
                    <span className="cert-issuer">{cert.issuer}</span>
                    <span className="gold-period">{cert.year}</span>
                  </div>
                  <h3>{cert.title}</h3>
                  {cert.fileUrl && (
                    <div className="btn-row" style={{ marginTop: "1rem" }}>
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="link-btn"
                      >
                        View PDF ↗
                      </a>
                      <a
                        href={cert.fileUrl}
                        download
                        className="link-btn"
                      >
                        Download ⬇
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="projects" className="section">
          <div className="section-heading-wrap">
            <span className="watermark">Projects</span>
            <h2>Projects</h2>
          </div>

          {projectFilters.length > 1 && (
            <div className="filter-bar">
              {projectFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`pill-tab ${activeProjectFilter === filter ? "active" : ""}`}
                  onClick={() => setActiveProjectFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}

          <div className="three-col-grid">
            {filteredProjects.map((project, index) => (
              <article key={project.id || index} className="project-card card-surface">
                <div className="project-banner">
                  <span className="project-index">0{index + 1}</span>
                  <span className="status-badge">{project.status}</span>
                </div>
                <div className="project-body">
                  <h3>{project.title}</h3>
                  <p className="card-body-text">{project.summary}</p>
                  <div className="tags">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="project-actions">
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => setSelectedProject(project)}
                    >
                      Inspect Details →
                    </button>
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="link-btn"
                      >
                        Repository ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section stats-banner-wrap">
          <div className="github-cta-banner">
            <h2>
              More projects on <span>GitHub</span>
            </h2>
            <p>Explore my repositories, automation scripts, and cloud &amp; DevOps projects.</p>
            {profileInfo.githubUrl && (
              <a
                href={profileInfo.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                GITHUB
              </a>
            )}
          </div>
        </section>

        <section id="contact" className="section">
          <div className="section-heading-wrap">
            <span className="watermark">Contact</span>
            <h2>Contact Me</h2>
            <p className="section-sub">
              GitHub:{" "}
              {profileInfo.githubUrl && (
                <a href={profileInfo.githubUrl} target="_blank" rel="noreferrer">
                  {profileInfo.githubUrl}
                </a>
              )}
            </p>
          </div>



          <div className="contact-icons-grid">
            <div className="contact-icon-card card-surface">
              <div className="icon-circle">📍</div>
              <h4>ADDRESS</h4>
              <p>{profileInfo.location}</p>
            </div>

            <div className="contact-icon-card card-surface">
              <div className="icon-circle">📞</div>
              <h4>CONTACT NUMBER</h4>
              {profileInfo.phone ? (
                <a href={`tel:${profileInfo.phone.replace(/\s+/g, "")}`}>
                  {profileInfo.phone}
                </a>
              ) : (
                <p>Add in portfolioData.js</p>
              )}
            </div>

            <div className="contact-icon-card card-surface">
              <div className="icon-circle">✉️</div>
              <h4>EMAIL ADDRESS</h4>
              {profileInfo.email ? (
                <a href={`mailto:${profileInfo.email}`}>{profileInfo.email}</a>
              ) : (
                <p>Add in portfolioData.js</p>
              )}
            </div>

            <div className="contact-icon-card card-surface">
              <div className="icon-circle">📄</div>
              <h4>DOWNLOAD RESUME</h4>
              {profileInfo.resumeUrl ? (
                <a href={profileInfo.resumeUrl} download>
                  resumelink
                </a>
              ) : (
                <p>Add resume.pdf in public/</p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form card-surface">
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <textarea
              name="message"
              rows="4"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "SENDING..." : "Send Message"}
            </button>
            {formStatus.text && (
              <p className={`status-msg ${formStatus.type}`}>{formStatus.text}</p>
            )}
          </form>
        </section>

         
      </main>

      {selectedProject && (
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="modal-card card-surface" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="status-badge">{selectedProject.status}</span>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedProject(null)}
              >
                ✕
              </button>
            </div>
            <h3>{selectedProject.title}</h3>
            <p className="card-body-text">{selectedProject.summary}</p>
            <div className="tags" style={{ marginTop: "1rem" }}>
              {selectedProject.techStack.map((tech) => (
                <span key={tech} className="tag">
                  {tech}
                </span>
              ))}
            </div>
            <div className="btn-row" style={{ marginTop: "1.5rem" }}>
              {selectedProject.repoUrl && (
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  View Repository
                </a>
              )}
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}