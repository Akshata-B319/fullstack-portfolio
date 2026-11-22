import { useState } from "react";
import {
  profileInfo,
  aboutMe,
  technicalSkills,
  projects,
  education,
  internshipsAndExperience,
  certifications,
} from "./data/portfolioData";

export default function App() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormStatus("Sending message...");

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormStatus(data.error || "Failed to send message.");
        return;
      }

      setFormStatus(data.message || "Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setFormStatus("Could not reach the backend server. Check that port 5000 is running.");
    }
  }

  return (
    <div>
      <header className="navbar">
        <a href="#home" className="brand">
          {profileInfo.displayName}
        </a>
        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
          <a href="#experience">Experience</a>
          <a href="#certifications">Certifications</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="container">
        <section id="home" className="section hero">
          <h1>{profileInfo.name}</h1>
          <p className="role">{profileInfo.role}</p>
          <p className="tagline">{profileInfo.tagline}</p>
          <div className="btn-row">
            {profileInfo.githubUrl && (
              <a href={profileInfo.githubUrl} target="_blank" rel="noreferrer" className="btn">
                GitHub
              </a>
            )}
            {profileInfo.linkedinUrl && (
              <a
                href={profileInfo.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                LinkedIn
              </a>
            )}
          </div>
        </section>

        <section id="about" className="section">
          <h2>About Me</h2>
          <p>{aboutMe.summary}</p>
          <ul className="bullet-list">
            {aboutMe.highlights.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="skills" className="section">
          <h2>Technical Skills</h2>
          <div className="grid">
            {technicalSkills.map((group) => (
              <article key={group.category} className="card">
                <h3>{group.category}</h3>
                <div className="tags">
                  {group.items.map((skill) => (
                    <span key={skill} className="tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="section">
          <h2>Projects</h2>
          <div className="grid">
            {projects.map((project) => (
              <article key={project.id} className="card">
                <span className="status-badge">{project.status}</span>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <div className="tags">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>
                {project.repoUrl && (
                  <p className="meta" style={{ marginTop: "0.75rem" }}>
                    <a href={project.repoUrl} target="_blank" rel="noreferrer">
                      View Repository
                    </a>
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="education" className="section">
          <h2>Education</h2>
          <div className="grid">
            {education.map((edu, idx) => (
              <article key={idx} className="card">
                <h3>{edu.degree}</h3>
                <p className="meta">
                  {edu.institution} • {edu.period}
                </p>
                <p>{edu.details}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="section">
          <h2>Internships and Experience</h2>
          {internshipsAndExperience.length === 0 ? (
            <p className="meta">No verified internships or work experience added yet.</p>
          ) : (
            <div className="grid">
              {internshipsAndExperience.map((exp, idx) => (
                <article key={idx} className="card">
                  <h3>{exp.role}</h3>
                  <p className="meta">
                    {exp.organization} • {exp.period}
                  </p>
                  <p>{exp.summary}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="certifications" className="section">
          <h2>Certifications</h2>
          {certifications.length === 0 ? (
            <p className="meta">No verified certifications added yet.</p>
          ) : (
            <div className="grid">
              {certifications.map((cert, idx) => (
                <article key={idx} className="card">
                  <h3>{cert.title}</h3>
                  <p className="meta">
                    {cert.issuer} • {cert.year}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="contact" className="section">
          <h2>Contact Me</h2>
          <p className="meta">
            GitHub:{" "}
            <a href={profileInfo.githubUrl} target="_blank" rel="noreferrer">
              {profileInfo.githubUrl}
            </a>
            {profileInfo.linkedinUrl && (
              <>
                {" "}
                • LinkedIn:{" "}
                <a href={profileInfo.linkedinUrl} target="_blank" rel="noreferrer">
                  {profileInfo.linkedinUrl}
                </a>
              </>
            )}
          </p>
          <form onSubmit={handleSubmit} className="contact-form">
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
            <textarea
              name="message"
              rows="4"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn">
              Send Message
            </button>
            {formStatus && <p className="status-msg">{formStatus}</p>}
          </form>
        </section>
      </main>
    </div>
  );
}