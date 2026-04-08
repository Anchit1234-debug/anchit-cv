#!/usr/bin/env node
// Parses anchit-resume.tex and generates src/cv-data.ts
// Run: node scripts/parse-tex.js

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const texPath = join(root, 'anchit-resume.tex')
const outPath = join(root, 'src', 'cv-data.ts')

const raw = readFileSync(texPath, 'utf8')
// Strip LaTeX comments (but not escaped \%)
const tex = raw.replace(/(?<!\\)%[^\n]*/g, '')

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract content of balanced {} starting at position `pos` (which must be '{').
 * Returns { text, length } where length includes both braces.
 */
function extractBraced(s, pos) {
  if (s[pos] !== '{') return null
  let depth = 1
  let i = pos + 1
  while (i < s.length && depth > 0) {
    if (s[i] === '{') depth++
    else if (s[i] === '}') depth--
    i++
  }
  return { text: s.substring(pos + 1, i - 1), length: i - pos }
}

/**
 * Extract N consecutive brace-delimited args from `s` starting at `startPos`.
 * Returns { args: string[], pos: number } where pos is the index after last arg.
 */
function extractNArgs(s, startPos, n) {
  const args = []
  let i = startPos
  while (args.length < n && i < s.length) {
    while (i < s.length && /\s/.test(s[i])) i++
    if (s[i] !== '{') break
    const result = extractBraced(s, i)
    if (!result) break
    args.push(result.text)
    i += result.length
  }
  return { args, pos: i }
}

/**
 * Find the first balanced \begin{env}...\end{env} at or after startPos.
 * Returns { start, end, inner } or null.
 */
function findEnv(s, env, startPos = 0) {
  const beginTag = `\\begin{${env}}`
  const endTag = `\\end{${env}}`
  const start = s.indexOf(beginTag, startPos)
  if (start === -1) return null
  let depth = 1
  let i = start + beginTag.length
  while (i < s.length && depth > 0) {
    if (s.startsWith(beginTag, i)) { depth++; i += beginTag.length }
    else if (s.startsWith(endTag, i)) { depth--; i += endTag.length }
    else i++
  }
  if (depth !== 0) return null
  return { start, end: i, inner: s.substring(start + beginTag.length, i - endTag.length) }
}

/**
 * Strip LaTeX formatting to plain text. Iterates until stable to handle nesting.
 */
function cleanTex(s) {
  let prev = null
  let result = s
  while (prev !== result) {
    prev = result
    result = result
      .replace(/\\&/g, '&')
      .replace(/\\textbf\{([^{}]*)\}/g, '$1')
      .replace(/\\textit\{([^{}]*)\}/g, '$1')
      .replace(/\\emph\{([^{}]*)\}/g, '$1')
      .replace(/\\href\{[^{}]*\}\{([^{}]*)\}/g, '$1')
      .replace(/\\faMobilePhone\s*/g, '')
      .replace(/\\hspace\{[^{}]*\}/g, '')
      .replace(/\\vspace\{[^{}]*\}/g, '')
      .replace(/\\par\b/g, '')
  }
  return result
    .replace(/\\%/g, '%')
    .replace(/\s*~\s*/g, '\u00a0')  // ~ = non-breaking space in LaTeX
    .replace(/\\,/g, ' ')
    .replace(/\\\\/g, '')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// ── contact/header ────────────────────────────────────────────────────────────

function parseContact() {
  // Search only within \begin{document}...\end{document} to skip preamble tabular*
  const docStart = tex.indexOf('\\begin{document}')
  const searchIn = docStart !== -1 ? tex.substring(docStart) : tex

  const beginTag = '\\begin{tabular*}'
  const endTag = '\\end{tabular*}'
  const start = searchIn.indexOf(beginTag)
  if (start === -1) return { name: '', email: '', phone: '', portfolioUrl: '' }
  const end = searchIn.indexOf(endTag, start)
  const t = end === -1 ? searchIn.substring(start) : searchIn.substring(start, end + endTag.length)

  const nameM = t.match(/\\huge[^{]*\\textbf\{([^}]+)\}/)
  const name = nameM ? nameM[1].replace(/\\par\b/g, '').trim() : ''

  const emailM = t.match(/\\href\{mailto:([^}]+)\}/)
  const email = emailM ? emailM[1] : ''

  const phoneM = t.match(/\\href\{tel:[^}]+\}\{([^}]+)\}/)
  const phone = phoneM ? phoneM[1] : ''

  const portfolioM = t.match(/\\href\{([^}]+)\}\{My Portfolio\}/)
  const portfolioUrl = portfolioM ? portfolioM[1] : ''

  const linkedinM = t.match(/\\href\{([^}]*linkedin[^}]*)\}/)
  const linkedinUrl = linkedinM ? linkedinM[1] : ''

  const githubM = t.match(/\\href\{([^}]*github[^}]*)\}/)
  const githubUrl = githubM ? githubM[1] : ''

  return { name, email, phone, portfolioUrl, linkedinUrl, githubUrl }
}

// ── sections ──────────────────────────────────────────────────────────────────

function parseSections() {
  const docEnv = findEnv(tex, 'document')
  const body = docEnv ? docEnv.inner : tex

  // Collect all \resheading positions
  const headingRe = /\\resheading\{([^}]+)\}/g
  const headings = []
  let m
  while ((m = headingRe.exec(body)) !== null) {
    headings.push({ title: cleanTex(m[1]), matchStart: m.index, matchEnd: m.index + m[0].length })
  }

  const sections = []
  for (let h = 0; h < headings.length; h++) {
    const { title, matchEnd } = headings[h]
    const contentEnd = h + 1 < headings.length ? headings[h + 1].matchStart : body.length
    const content = body.substring(matchEnd, contentEnd)
    const section = parseSection(title, content)
    if (section) sections.push(section)
  }
  return sections
}

function parseSection(title, content) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  if (content.includes('\\ressubheading')) {
    return { id, title, type: 'jobs', items: parseJobs(content) }
  }

  const descEnv = findEnv(content, 'description')
  if (descEnv) {
    const items = parseDescriptionItems(descEnv.inner)
    const hasUrls = items.some(item => 'url' in item)
    const hasYearLabels = items.every(item => 'label' in item && /^\d{4}$/.test(item.label))
    if (hasUrls) return { id, title, type: 'links', items }
    if (hasYearLabels) return { id, title, type: 'achievements', items }
    return { id, title, type: 'skills', items }
  }

  return null
}

// ── jobs ──────────────────────────────────────────────────────────────────────

function parseJobs(content) {
  const jobs = []
  const cmdName = '\\ressubheading'
  const re = /\\ressubheading/g
  let m
  while ((m = re.exec(content)) !== null) {
    const cmdEnd = m.index + cmdName.length
    const { args, pos: argsEnd } = extractNArgs(content, cmdEnd, 4)
    if (args.length < 4) continue

    const [company, location, role, dates] = args.map(cleanTex)

    // The inner itemize for bullets comes right after the subheading args
    const innerEnv = findEnv(content, 'itemize', argsEnd)
    const bullets = []
    if (innerEnv) {
      const ic = innerEnv.inner
      let bPos = 0
      while (true) {
        const riPos = ic.indexOf('\\resitem{', bPos)
        if (riPos === -1) break
        const braced = extractBraced(ic, riPos + '\\resitem'.length)
        if (braced) bullets.push(cleanTex(braced.text))
        bPos = riPos + 1
      }
    }

    jobs.push({ company, location, role, dates, bullets })
  }
  return jobs
}

// ── description lists (skills / links) ───────────────────────────────────────

function parseDescriptionItems(inner) {
  const items = []
  // \item[ starts each entry
  const re = /\\item\[/g
  const entries = []
  let m
  while ((m = re.exec(inner)) !== null) {
    // m.index + m[0].length = position right after the [
    entries.push({ matchStart: m.index, bracketContentStart: m.index + m[0].length })
  }

  for (let i = 0; i < entries.length; i++) {
    const { matchStart, bracketContentStart } = entries[i]
    // Find the matching ] (depth-tracked in case of nested [...])
    let depth = 1
    let j = bracketContentStart
    while (j < inner.length && depth > 0) {
      if (inner[j] === '[') depth++
      else if (inner[j] === ']') depth--
      j++
    }
    const labelRaw = inner.substring(bracketContentStart, j - 1)
    const nextStart = i + 1 < entries.length ? entries[i + 1].matchStart : inner.length
    const valueRaw = inner.substring(j, nextStart).trim()

    const hrefM = labelRaw.match(/^\\href\{([^}]+)\}\{([^}]+)\}$/)
    if (hrefM) {
      items.push({ url: hrefM[1], text: hrefM[2] })
    } else {
      items.push({ label: labelRaw.replace(/:$/, '').trim(), value: cleanTex(valueRaw) })
    }
  }
  return items
}

// ── assemble & write ──────────────────────────────────────────────────────────

const contact = parseContact()
const sections = parseSections()

const data = {
  name: contact.name,
  contact: {
    email: contact.email,
    phone: contact.phone,
    portfolioUrl: contact.portfolioUrl,
    linkedinUrl: contact.linkedinUrl,
    githubUrl: contact.githubUrl,
  },
  sections,
}

const ts = `// AUTO-GENERATED from anchit-resume.tex — do not edit directly.
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

export interface AchievementsSection {
  id: string
  title: string
  type: 'achievements'
  items: SkillItem[]
}

export type CvSection = JobsSection | SkillsSection | LinksSection | AchievementsSection

export interface CvData {
  name: string
  contact: ContactInfo
  sections: CvSection[]
}

export const cvData: CvData = ${JSON.stringify(data, null, 2)}
`

writeFileSync(outPath, ts, 'utf8')
console.log(`✓ Generated ${outPath}`)
console.log(`  name: ${data.name}`)
console.log(`  sections: ${data.sections.map(s => `${s.title} (${s.type})`).join(', ')}`)
