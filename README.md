# AEGIS-OS

A fully interactive fake operating system that runs in the browser — Manan Shah's cybersecurity portfolio.

## What it is

AEGIS-OS simulates a desktop OS experience in the browser. It features a boot sequence, window manager, dock, and 7 interactive apps showcasing projects, research, experience, and skills.

## How to run

Just open `index.html` in a browser. No build step. No npm. No dependencies to install.

```bash
open index.html
# or drag it into Chrome/Firefox/Edge
```

For the best experience, use a desktop browser (Chrome or Firefox recommended).

## How to deploy (GitHub Pages)

1. Create a new GitHub repository
2. Push this project to it:
   ```bash
   git init
   git add index.html assets/
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. Go to **Settings → Pages → Source: main branch** → Save
4. Your portfolio will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## What to customize

| What | Where |
|------|-------|
| Email address | Search `mailto:` in index.html |
| LinkedIn URL | Search `linkedin.com/in/` in index.html |
| Resume PDF | Replace `assets/resume.pdf` with your real resume |
| OG preview image | Add a 1200×630 screenshot as `assets/og-preview.png` |
| Boot skip preference | Delete `localStorage.removeItem('aegis-booted')` or clear site data |

## Tech stack

- Vanilla JS (ES6+) — no frameworks
- Three.js r128 (CDN) — 3D wallpaper
- GSAP 3.12 (CDN) — animations
- Chart.js 4.4 (CDN) — radar chart
- Google Fonts — Syne, DM Sans, JetBrains Mono
- Single file: `index.html` (~90KB)

## Structure

```
Portfolio/
├── index.html          # Entire application
├── assets/
│   ├── resume.pdf      # Replace with your real resume
│   └── og-preview.png  # Add a 1200×630 screenshot for social sharing
└── README.md
```
