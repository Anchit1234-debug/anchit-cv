// AUTO-GENERATED from anchit-resume.tex — do not edit directly.
// Regenerate by running: npm run parse-tex

export interface ContactInfo {
  email: string
  phone: string
  portfolioUrl: string
  linkedinUrl: string
  githubUrl: string
}

export interface JobItem {
  company: string
  location: string
  role: string
  dates: string
  bullets: string[]
}

export interface SkillItem {
  label: string
  value: string
}

export interface LinkItem {
  url: string
  text: string
}

export interface JobsSection {
  id: string
  title: string
  type: 'jobs'
  items: JobItem[]
}

export interface SkillsSection {
  id: string
  title: string
  type: 'skills'
  items: SkillItem[]
}

export interface LinksSection {
  id: string
  title: string
  type: 'links'
  items: LinkItem[]
}

export type CvSection = JobsSection | SkillsSection | LinksSection

export interface CvData {
  name: string
  contact: ContactInfo
  sections: CvSection[]
}

export const cvData: CvData = {
  "name": "Anchit Bhushan",
  "contact": {
    "email": "bhushananchit@gmail.com",
    "phone": "+91 8861885327",
    "portfolioUrl": "",
    "linkedinUrl": "https://www.linkedin.com/in/anchit-bhushan-b06692130",
    "githubUrl": "https://github.com/Anchit1234-debug"
  },
  "sections": [
    {
      "id": "work-experience",
      "title": "Work Experience",
      "type": "jobs",
      "items": [
        {
          "company": "Infosys Limited",
          "location": "Bengaluru, India",
          "role": "Senior Associate Consultant (Helix)",
          "dates": "August 2024 -- Present",
          "bullets": [
            "Developed and maintained scalable RESTful APIs using Java and Spring Boot, enabling seamless integration with external systems and cross-domain microservices architectures.",
            "Engineered high-throughput SFTP-to-Azure data pipelines using Spring Scheduler, processing \\textasciitilde10K EDI 834 files daily with robust error handling and reliability.",
            "Orchestrated containerized deployments using Docker and Kubernetes, implementing Helm-based release management and leveraging ConfigMaps and Secrets for secure multi-environment deployments.",
            "Conducted comprehensive code reviews and mentored 3 team members, enforcing Clean Code principles and improving code quality and maintainability."
          ]
        },
        {
          "company": "FIS Solutions (India) Private Limited",
          "location": "Bengaluru, India",
          "role": "Software Engineer (Global Plus -- Wealth Management)",
          "dates": "July 2021 -- Jan 2024",
          "bullets": [
            "Enhanced inbound and outbound message processing for SWIFT Standards Update 2023, ensuring compliance and improved processing reliability.",
            "Delivered multiple enhancements and bug fixes in C and FORTRAN within a UNIX environment for a Wealth Management platform serving multiple banking clients.",
            "Designed and implemented a dual push mechanism to export files between Windows Server-hosted .NET applications via XML, improving cross-server data transfer reliability."
          ]
        },
        {
          "company": "Accenture Solutions Pvt Ltd",
          "location": "Bengaluru, India",
          "role": "Application Development Associate (OSISoft PI)",
          "dates": "November 2020 -- April 2021",
          "bullets": [
            "Completed training in C, Java, Python, SDLC, Agile, and DevOps, building a strong foundation across full-stack development and modern engineering practices.",
            "Provided application support for real-time manufacturing data collection using OSIsoft PI Data Historian for a Pharmaceutical client, ensuring data integrity and system continuity."
          ]
        },
        {
          "company": "Datalore Labs Private Limited",
          "location": "Bengaluru, India",
          "role": "Machine Learning Intern",
          "dates": "July 2019 -- August 2019",
          "bullets": [
            "Predicted the probability of Parkinson's Disease from audio feature samples using multiple ML models including KNN, Logistic Regression, Decision Tree, and Random Forest.",
            "Improved prediction accuracy from 89.79% to 99.04% by tuning a Decision Tree classifier."
          ]
        }
      ]
    },
    {
      "id": "skills",
      "title": "Skills",
      "type": "skills",
      "items": [
        {
          "label": "Languages",
          "value": "Java, Python, C, C++, FORTRAN"
        },
        {
          "label": "Tools / Services",
          "value": "Git, Docker, Kubernetes, Azure, Helm, SFTP, EDI, XML, .NET"
        },
        {
          "label": "Libraries / Frameworks",
          "value": "Spring / Spring Boot"
        },
        {
          "label": "AI / Developer Tools",
          "value": "GitHub Copilot, Claude Code"
        }
      ]
    }
  ]
}
