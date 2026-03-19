# PHISH_SHIELD

AI-powered phishing detection dashboard built with React, Vite, Tailwind CSS, Framer Motion, and Three.js.

## Overview

PHISH_SHIELD is a multi-page security dashboard experience with:
- Interactive detection workspace
- Analysis results and explainability view
- Threat Intelligence, Policy, and Logs pages
- Security module pages (Mail Guard, Link Analyzer, Vault, System Health)
- Privacy, Terms, Trust Center, and Status informational pages
- Animated Three.js threat scanner in the home hero

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 3
- Framer Motion
- Three.js with @react-three/fiber and @react-three/drei

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

By default Vite uses port `5173`. If busy, it will automatically move to another port (for example `5174`).

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build locally

```bash
npm run preview
```

## Scripts

- `npm run dev` - start development server
- `npm run build` - create production build in `dist/`
- `npm run preview` - preview built app
- `npm run deploy:vercel` - one-command Vercel deploy (`build + vercel --prod`)

## Deployment (Vercel)

This project is configured for Vercel using `vercel.json`.

One-command deployment:

```bash
npm run deploy:vercel
```

Notes:
- First deploy may ask you to authenticate/link your Vercel account in terminal.
- Output directory is `dist`.

## Page Map

- `home` - dashboard landing page with 3D scanner
- `workspace` - Detection Workspace (email/url/file analysis)
- `analysis` - Analysis Results
- `threat-intel` - Threat Intelligence
- `policy` - Policy
- `logs` - Logs
- `mail-guard` - Mail Guard
- `link-analyzer` - Link Analyzer
- `vault` - Vault
- `system-health` - System Health
- `privacy` - Privacy Protocol
- `terms` - Terms of Engagement
- `trust` - Trust Center
- `status` - Status

## Project Structure

```text
src/
  App.jsx
  Home.jsx
  DetectionWorkspace.jsx
  AnalysisResults.jsx
  OperationsPage.jsx
  SecurityToolPage.jsx
  InfoPage.jsx
  components/
    ThreatScanner3D.jsx
```

## Build Notes

You may see a chunk-size warning for the Home chunk due to Three.js dependencies. This does not block deployment.
