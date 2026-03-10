import { useEffect, useRef, useState } from 'react'
import './App.css'

type SectionId = 'about' | 'experience' | 'projects' | 'education' | 'highlights'

const App = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('about')

  const aboutRef = useRef<HTMLElement>(null!)
  const experienceRef = useRef<HTMLElement>(null!)
  const projectsRef = useRef<HTMLElement>(null!)
  const educationRef = useRef<HTMLElement>(null!)
  const highlightsRef = useRef<HTMLElement>(null!)

  const handleScrollTo = (section: SectionId) => {
    const map: Record<SectionId, React.RefObject<HTMLElement>> = {
      about: aboutRef,
      experience: experienceRef,
      projects: projectsRef,
      education: educationRef,
      highlights: highlightsRef,
    }

    const target = map[section].current
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections: { id: SectionId; ref: React.RefObject<HTMLElement> }[] = [
        { id: 'about', ref: aboutRef },
        { id: 'experience', ref: experienceRef },
        { id: 'projects', ref: projectsRef },
        { id: 'education', ref: educationRef },
        { id: 'highlights', ref: highlightsRef },
      ]

      let current: SectionId = 'about'
      let closestDistance = Number.POSITIVE_INFINITY

      sections.forEach(({ id, ref }) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const distance = Math.abs(rect.top - 96)
        if (distance < closestDistance) {
          closestDistance = distance
          current = id
        }
      })

      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="cv-shell">
      <header className="site-header">
        <button
          type="button"
          className="site-title"
          onClick={() => handleScrollTo('about')}
        >
          <span className="site-title-main">Anchit Bhushan</span>
          <span className="site-title-sub">Backend & Platform Engineer</span>
        </button>
        <nav className="site-nav">
          <button
            type="button"
            className={`nav-pill ${activeSection === 'about' ? 'nav-pill-active' : ''}`}
            onClick={() => handleScrollTo('about')}
          >
            About
          </button>
          <button
            type="button"
            className={`nav-pill ${
              activeSection === 'experience' ? 'nav-pill-active' : ''
            }`}
            onClick={() => handleScrollTo('experience')}
          >
            Experience
          </button>
          <button
            type="button"
            className={`nav-pill ${activeSection === 'projects' ? 'nav-pill-active' : ''}`}
            onClick={() => handleScrollTo('projects')}
          >
            Projects
          </button>
          <button
            type="button"
            className={`nav-pill ${
              activeSection === 'education' ? 'nav-pill-active' : ''
            }`}
            onClick={() => handleScrollTo('education')}
          >
            Education
          </button>
          <button
            type="button"
            className={`nav-pill ${
              activeSection === 'highlights' ? 'nav-pill-active' : ''
            }`}
            onClick={() => handleScrollTo('highlights')}
          >
            Highlights
          </button>
        </nav>
      </header>

      <div className="cv-page">
        <header className="cv-hero" ref={aboutRef}>
          <div className="cv-hero-main">
            <div
              className="avatar-photo"
              style={{ backgroundImage: 'url("/my-photo.jpg")' }}
            >
              <span className="avatar-initials">AB</span>
            </div>
            <div>
              <h1 className="cv-name">Anchit Bhushan</h1>
              <p className="cv-title">Senior Associate Consultant · Backend Engineer</p>
              <p className="cv-summary">
                Backend and platform engineer with experience across financial services
                and healthcare products, building robust backends, high-volume data
                integrations, and automation. Comfortable working with Java/Spring,
                legacy codebases in C/Fortran, and UNIX environments, with a strong
                focus on clean, reliable, production-ready code.
              </p>
            </div>
          </div>
          <div className="cv-hero-meta">
            <div className="cv-meta-group">
              <span className="cv-meta-label">Location</span>
              <span className="cv-meta-value">Bengaluru, India</span>
            </div>
            <div className="cv-meta-group">
              <span className="cv-meta-label">Email</span>
              <span className="cv-meta-value">bhushananchit@gmail.com</span>
            </div>
            <div className="cv-meta-group">
              <span className="cv-meta-label">Phone</span>
              <span className="cv-meta-value">+91 88618 85327</span>
            </div>
            <div className="cv-meta-group">
              <span className="cv-meta-label">Links</span>
              <span className="cv-meta-value">
                . leetcode.com/terminator2602 ·
                hackerrank.com/anchit123
              </span>
            </div>
          </div>
        </header>

        <main className="cv-layout">
          <section className="cv-main">
            <section className="cv-section" ref={experienceRef}>
              <h2 className="cv-section-title">Experience</h2>
              <div className="cv-item cv-item-hover">
                <div className="cv-item-header">
                  <div>
                    <h3 className="cv-item-title">Senior Associate Consultant · Helix</h3>
                    <p className="cv-item-subtitle">Infosys Limited · Bengaluru, India</p>
                  </div>
                  <p className="cv-item-date">Aug 2024 – Present</p>
                </div>
                <ul className="cv-item-list">
                  <li>
                    Architected and developed scalable RESTful APIs using Java and Spring
                    Boot, integrating complex external systems and cross-domain
                    microservices.
                  </li>
                  <li>
                    Designed and implemented a robust scheduler to automate transfer of
                    834 files from an SFTP server to Azure File Share, improving
                    reliability and reducing manual effort.
                  </li>
                  <li>
                    Provided technical leadership by mentoring team members through
                    detailed code reviews, driving adherence to Clean Code principles and
                    organizational standards.
                  </li>
                </ul>
              </div>

              <div className="cv-item cv-item-hover">
                <div className="cv-item-header">
                  <div>
                    <h3 className="cv-item-title">
                      Software Engineer · Global Plus (Wealth Management)
                    </h3>
                    <p className="cv-item-subtitle">
                      FIS Solutions (India) Pvt. Ltd. · Bengaluru, India
                    </p>
                  </div>
                  <p className="cv-item-date">Jul 2021 – Jan 2024</p>
                </div>
                <ul className="cv-item-list">
                  <li>
                    Contributed to inbound and outbound message processing for SWIFT
                    Standards Update 2023 within the Global Plus wealth management
                    product.
                  </li>
                  <li>
                    Delivered multiple enhancements and fixes in C and FORTRAN within a
                    UNIX environment for multiple banking clients.
                  </li>
                  <li>
                    Integrated a dual push mechanism for exporting files from a .NET
                    application on Windows Server using XML-based communication.
                  </li>
                </ul>
              </div>

              <div className="cv-item cv-item-hover">
                <div className="cv-item-header">
                  <div>
                    <h3 className="cv-item-title">
                      Application Development Associate · OSIsoft PI
                    </h3>
                    <p className="cv-item-subtitle">
                      Accenture Solutions Pvt. Ltd. · Bengaluru, India
                    </p>
                  </div>
                  <p className="cv-item-date">Nov 2020 – Apr 2021</p>
                </div>
                <ul className="cv-item-list">
                  <li>
                    Completed trainings on C, Java, Python, SDLC, Agile methodologies,
                    and DevOps practices.
                  </li>
                  <li>
                    Provided application support for real-time manufacturing data
                    collection using OSIsoft PI data historian for a pharmaceutical
                    client.
                  </li>
                </ul>
              </div>

              <div className="cv-item cv-item-hover">
                <div className="cv-item-header">
                  <div>
                    <h3 className="cv-item-title">Software Engineering Intern</h3>
                    <p className="cv-item-subtitle">
                      Datalore Labs Pvt. Ltd. · Bengaluru, India
                    </p>
                  </div>
                  <p className="cv-item-date">Jul 2019 – Aug 2019</p>
                </div>
                <ul className="cv-item-list">
                  <li>
                    Predicted the probability of Parkinson&apos;s Disease based on audio
                    feature samples using multiple ML models.
                  </li>
                  <li>
                    Experimented with KNN, grid-search tuned KNN, logistic regression,
                    decision trees, and random forests to improve accuracy.
                  </li>
                  <li>
                    Improved prediction accuracy from 89.79% to 99.04% using a tree
                    classifier.
                  </li>
                </ul>
              </div>
            </section>

            <section className="cv-section" ref={projectsRef}>
              <h2 className="cv-section-title">Projects</h2>
              <div className="cv-item cv-item-hover">
                <div className="cv-item-header">
                  <div>
                    <h3 className="cv-item-title">Student Database Management System</h3>
                    <p className="cv-item-subtitle">
                      DSATM Bangalore · Self motivated · Advisor: Asst. Prof. Mrs.
                      Nagarathna C R
                    </p>
                  </div>
                  <p className="cv-item-date">Sep 2018 – Nov 2018 · HTML · CSS · JS · PHP</p>
                </div>
                <ul className="cv-item-list">
                  <li>
                    Implemented a web-based portal with CRUD APIs for managing student
                    records and related details.
                  </li>
                  <li>
                    Designed views to read and modify records securely using a PHP
                    backend and browser-based UI.
                  </li>
                </ul>
              </div>

              <div className="cv-item cv-item-hover">
                <div className="cv-item-header">
                  <div>
                    <h3 className="cv-item-title">Periodic Table</h3>
                    <p className="cv-item-subtitle">
                      DSATM Bangalore · Guide: Asst. Prof. Mr. Karthik S A
                    </p>
                  </div>
                  <p className="cv-item-date">Mar 2019 – May 2019 · Java · B-Trees</p>
                </div>
                <ul className="cv-item-list">
                  <li>
                    Developed a desktop-based Java GUI providing detailed information
                    for each element in the periodic table.
                  </li>
                  <li>
                    Stored element data using B-Trees to improve insert and delete
                    performance.
                  </li>
                  <li>Used serialization to persist data to the file system.</li>
                </ul>
              </div>

              <div className="cv-item cv-item-hover">
                <div className="cv-item-header">
                  <div>
                    <h3 className="cv-item-title">
                      Honeypot · Intrusion Detection System
                    </h3>
                    <p className="cv-item-subtitle">
                      DSATM Bangalore · Guide: Dean Academics Dr. Sumithra Devi K A
                    </p>
                  </div>
                  <p className="cv-item-date">Sep 2019 – Aug 2020 · Node.js · HTML · CSS</p>
                </div>
                <ul className="cv-item-list">
                  <li>
                    Built a web-based GUI application to track real-time SSH, Telnet,
                    and FTP attacks on a system.
                  </li>
                  <li>
                    Implemented support for tracking multiple attack types and multiple
                    protocols.
                  </li>
                  <li>
                    Visualized attack origins to support security monitoring and
                    analysis.
                  </li>
                </ul>
              </div>
            </section>

            <section className="cv-section" ref={educationRef}>
              <h2 className="cv-section-title">Education</h2>
              <div className="cv-item cv-item-hover">
                <div className="cv-item-header">
                  <div>
                    <h3 className="cv-item-title">
                      B.E., Information Science &amp; Engineering
                    </h3>
                    <p className="cv-item-subtitle">DSATM Bangalore</p>
                  </div>
                  <p className="cv-item-date">Graduated 2020 · CGPA 7.51 / 10</p>
                </div>
                <p className="cv-item-description">
                  Completed a range of computer science and information science courses
                  with a focus on programming, data structures, and systems.
                </p>
              </div>

              <div className="cv-item cv-item-hover">
                <div className="cv-item-header">
                  <div>
                    <h3 className="cv-item-title">
                      All India Senior School Certificate Examination
                    </h3>
                    <p className="cv-item-subtitle">
                      D.A.V Public School, Talwandi, Kota
                    </p>
                  </div>
                  <p className="cv-item-date">2015 · 66.67%</p>
                </div>
              </div>

              <div className="cv-item cv-item-hover">
                <div className="cv-item-header">
                  <div>
                    <h3 className="cv-item-title">
                      All India Secondary School Examination
                    </h3>
                    <p className="cv-item-subtitle">D.A.V Public School, Hazaribagh</p>
                  </div>
                  <p className="cv-item-date">2013 · CGPA 10.0 / 10.0</p>
                </div>
              </div>
            </section>
          </section>

          <aside className="cv-sidebar">
            <section className="cv-section" ref={highlightsRef}>
              <h2 className="cv-section-title">Skills</h2>
              <div className="cv-tags">
                <span className="cv-tag">Java</span>
                <span className="cv-tag">Spring Framework</span>
                <span className="cv-tag">C / C++</span>
                <span className="cv-tag">C#</span>
                <span className="cv-tag">Python</span>
                <span className="cv-tag">Shell · UNIX</span>
                <span className="cv-tag">Git &amp; SVN</span>
                <span className="cv-tag">Data Structures</span>
              </div>
            </section>

            <section className="cv-section">
              <h2 className="cv-section-title">Highlights</h2>
              <ul className="cv-simple-list">
                <li>
                  Co-authored &quot;HONEYPOT: Intrusion Detection System&quot; published
                  in IJISRT Volume 5, Issue 3, March 2020.
                </li>
                <li>
                  Kudos award at FIS Solutions (India) Pvt. Ltd. for sole contribution
                  towards IV Gen3 Server migration (2022).
                </li>
                <li>
                  Runner-up in DBMS Mini Project Competition at DSATM Bangalore (2019).
                </li>
              </ul>
            </section>

            <section className="cv-section">
              <h2 className="cv-section-title">Profiles &amp; Links</h2>
              <ul className="cv-simple-list">
                <li>
                  <a href="https://anchit-bhushan.web.app/" target="_blank" rel="noreferrer">
                    Portfolio
                  </a>
                </li>
                <li>
                  <a
                    href="https://leetcode.com/terminator2602/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LeetCode
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.hackerrank.com/anchit123"
                    target="_blank"
                    rel="noreferrer"
                  >
                    HackerRank
                  </a>
                </li>
                <li>
                  <a
                    href="https://ijisrt.com/honeypot-intrusion-detection-system"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Publication: Honeypot IDS
                  </a>
                </li>
              </ul>
            </section>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App
