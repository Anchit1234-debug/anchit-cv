---
description: Tailor my CV to a job description and push it to the company's apply branch
argument-hint: [JD-url-or-text] [optional-company-slug]
allowed-tools: WebFetch, Read, Edit, Write, Glob, Grep, Bash(git:*)
disable-model-invocation: true
---

You are automating my job-application workflow in this CV repo. Follow these steps in order. Only stop to ask me if something is genuinely ambiguous.

## Input
The job description is provided as: $ARGUMENTS

- If `$ARGUMENTS` is empty, ask me to paste the JD (a URL or raw text) and wait for it.
- If it starts with `http://` or `https://`, treat the first token as the JD URL and fetch it with WebFetch to get the full text. Keep the URL — I want it saved.
- Otherwise, treat `$ARGUMENTS` as the raw JD text (there is no link).
- If a second token after a URL looks like a slug (single word, no spaces), use it as the company slug override.

## 1. Identify the company
- Extract the company name and role title from the JD.
- Derive a branch slug: lowercase, spaces/punctuation → hyphens (e.g. "Acme Corp" → `acme-corp`). Use my override if I gave one.
- Tell me the company, role, and the branch `apply/<slug>` you're about to use.

## 2. Set up the branch
- Run `git fetch origin` so `main` is current.
- Always base the work on `main` (the root branch):
  - If `apply/<slug>` does NOT exist locally or on origin, create it from the latest main:
    `git checkout main && git pull` then `git checkout -b apply/<slug>`.
  - If `apply/<slug>` already exists, check it out and pull it — I'm updating an existing application.
- Confirm you are now on `apply/<slug>`. **Never edit files, stage, or commit while on `main`.**
  If you're still on `main` for any reason (checkout failed, dirty tree, etc.), STOP and tell me — do not proceed.
  
## 3. Tailor the CV — lightly
- Find my CV `.tex` file (usually one main `*.tex`; if there are several, use the one named in CLAUDE.md, or ask).
- Make LIGHT, honest edits only:
  - Adjust the summary/objective to speak to this role.
  - Reorder or lightly reword existing skills and bullets so the most relevant surface first and echo the JD's language.
  - Surface JD keywords only where they truthfully match my experience.
- Do NOT invent experience, add skills I don't have, change dates/titles/companies, or restructure the document. Keep the diff small — a handful of targeted edits, not a rewrite.
- Give me a 3–5 line summary of exactly what you changed.

## 4. Save the JD
- Write the JD to `applications/<slug>/job-description.md`.
- At the top include: role title, company, today's date, and the source URL (or "provided as text — no link" if none). Put the full JD text below.

## 5. Commit and push
- Stage the tailored `.tex` and the new JD file.
- Commit: `Tailor CV for <Company> — <Role>`.
- Push: `git push -u origin apply/<slug>`.
- Report the branch name and confirm the push succeeded.