import { useEffect, useRef, useState } from 'react'
import './App.css'
import { cvData } from './cv-data'
import type { CvSection, JobsSection, SkillsSection, LinksSection } from './cv-data'

const mainSectionTypes = ['jobs']

const App = () => {
  const [activeSection, setActiveSection] = useState<string>('about')
  const sectionRefs = useRef<Record<string, HTMLElement>>({})

  const allSectionIds = ['about', ...cvData.sections.map(s => s.id)]

  const handleScrollTo = (id: string) => {
    const el = sectionRefs.current[id]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const setRef = (id: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current[id] = el
  }

  useEffect(() => {
    const handleScroll = () => {
      let current = 'about'
      let closestDistance = Number.POSITIVE_INFINITY
      for (const id of allSectionIds) {
        const el = sectionRefs.current[id]
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const distance = Math.abs(rect.top - 96)
        if (distance < closestDistance) {
          closestDistance = distance
          current = id
        }
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const mainSections = cvData.sections.filter(s => mainSectionTypes.includes(s.type))
  const sidebarSections = cvData.sections.filter(s => !mainSectionTypes.includes(s.type))

  return (
    <div className="cv-shell">
      <header className="site-header">
        <button
          type="button"
          className="site-title"
          onClick={() => handleScrollTo('about')}
        >
          <span className="site-title-main">{cvData.name}</span>
        </button>
        <a
          href="/anchit-resume.pdf"
          download="Anchit_Bhushan_Resume.pdf"
          className="nav-pill download-btn"
        >
          ↓ PDF
        </a>
        <nav className="site-nav">
          <button
            type="button"
            className={`nav-pill ${activeSection === 'about' ? 'nav-pill-active' : ''}`}
            onClick={() => handleScrollTo('about')}
          >
            About
          </button>
          {cvData.sections.map(section => (
            <button
              key={section.id}
              type="button"
              className={`nav-pill ${activeSection === section.id ? 'nav-pill-active' : ''}`}
              onClick={() => handleScrollTo(section.id)}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </header>

      <div className="cv-page">
        <header className="cv-hero" ref={setRef('about')}>
          <div className="cv-hero-main">
            <div className="avatar-photo">
              <span className="avatar-initials">
                {cvData.name.split(' ').map(w => w[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="cv-name">{cvData.name}</h1>
              <div className="cv-hero-meta">
                {cvData.contact.email && (
                  <div className="cv-meta-group">
                    <span className="cv-meta-label">Email</span>
                    <a
                      href={`mailto:${cvData.contact.email}`}
                      className="cv-meta-value"
                    >
                      {cvData.contact.email}
                    </a>
                  </div>
                )}
                {cvData.contact.phone && (
                  <div className="cv-meta-group">
                    <span className="cv-meta-label">Phone</span>
                    <a
                      href={`tel:${cvData.contact.phone.replace(/\s/g, '')}`}
                      className="cv-meta-value"
                    >
                      {cvData.contact.phone}
                    </a>
                  </div>
                )}
                {cvData.contact.linkedinUrl && (
                  <div className="cv-meta-group">
                    <span className="cv-meta-label">LinkedIn</span>
                    <a
                      href={cvData.contact.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="cv-meta-value"
                    >
                      {cvData.contact.linkedinUrl.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                    </a>
                  </div>
                )}
                {cvData.contact.githubUrl && (
                  <div className="cv-meta-group">
                    <span className="cv-meta-label">GitHub</span>
                    <a
                      href={cvData.contact.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="cv-meta-value"
                    >
                      {cvData.contact.githubUrl.replace(/https?:\/\/(www\.)?github\.com\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="cv-layout">
          <section className="cv-main">
            {mainSections.map(section => (
              <SectionBlock key={section.id} section={section} setRef={setRef} />
            ))}
          </section>

          {sidebarSections.length > 0 && (
            <aside className="cv-sidebar">
              {sidebarSections.map(section => (
                <SectionBlock key={section.id} section={section} setRef={setRef} />
              ))}
            </aside>
          )}
        </main>
      </div>
    </div>
  )
}

// ── Section renderers ─────────────────────────────────────────────────────────

interface SectionBlockProps {
  section: CvSection
  setRef: (id: string) => (el: HTMLElement | null) => void
}

const SectionBlock = ({ section, setRef }: SectionBlockProps) => (
  <section
    className="cv-section"
    ref={setRef(section.id)}
  >
    <h2 className="cv-section-title">{section.title}</h2>
    {section.type === 'jobs' && <JobsSectionContent section={section} />}
    {section.type === 'skills' && <SkillsSectionContent section={section} />}
    {section.type === 'links' && <LinksSectionContent section={section} />}
  </section>
)

const JobsSectionContent = ({ section }: { section: JobsSection }) => (
  <>
    {section.items.map((job, i) => (
      <div key={i} className="cv-item cv-item-hover">
        <div className="cv-item-header">
          <div>
            <h3 className="cv-item-title">{job.role}</h3>
            <p className="cv-item-subtitle">
              {job.company} · {job.location}
            </p>
          </div>
          <p className="cv-item-date">{job.dates}</p>
        </div>
        {job.bullets.length > 0 && (
          <ul className="cv-item-list">
            {job.bullets.map((bullet, j) => (
              <li key={j}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </>
)

const SkillsSectionContent = ({ section }: { section: SkillsSection }) => (
  <dl className="cv-skill-list">
    {section.items.map((item, i) => (
      <div key={i} className="cv-skill-row">
        <dt className="cv-skill-label">{item.label}</dt>
        <dd className="cv-skill-value">{item.value}</dd>
      </div>
    ))}
  </dl>
)

const LinksSectionContent = ({ section }: { section: LinksSection }) => (
  <ul className="cv-simple-list">
    {section.items.map((item, i) => (
      <li key={i}>
        <a href={item.url} target="_blank" rel="noreferrer">
          {item.text}
        </a>
      </li>
    ))}
  </ul>
)

export default App
