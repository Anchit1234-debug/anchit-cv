# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CV repo conventions
- Main CV: `anchit-resume.tex`
- One branch per company: `apply/<company-slug>`, based off `main`.
- JDs saved under `applications/<company-slug>/job-description.md`.
- Tailoring is intentionally light: emphasize and reorder what's already true, never fabricate. Keep diffs small.

## Architecture

This repo serves two purposes:

1. **LaTeX CV** — `anchit-resume.tex` is the single source of truth for all CV content.
2. **React portfolio site** — a Vite + React + TypeScript app (`src/`) that renders the CV as a web page.

The critical link between them: `scripts/parse-tex.js` reads `anchit-resume.tex` and generates `src/cv-data.ts` as a typed data module. The build script runs this parser automatically before TypeScript and Vite. If you change the `.tex` file and want the site to reflect it locally, run `npm run parse-tex` first (or just `npm run build`).

## Commands

```bash
npm run dev          # start Vite dev server (site reflects current cv-data.ts)
npm run parse-tex    # regenerate src/cv-data.ts from anchit-resume.tex
npm run build        # parse-tex → tsc → vite build (full production build)
npm run lint         # ESLint
npm run preview      # serve the dist/ output locally

# Compile PDF (requires Docker):
npm run compile-pdf  # runs pdflatex in texlive container, copies result to public/
```

## Deployment

- CI runs on every push/PR to `main` via `.github/workflows/ci.yml`: lint → build → Docker image.
- On push to `main`, the workflow also pushes to Docker Hub (`anchit123/anchit-cv`) and deploys to AWS Elastic Beanstalk (region `ap-southeast-2`, app `anchit-cv`).
- The Docker image is a two-stage build: Node builder → nginx:alpine serving `dist/`.
