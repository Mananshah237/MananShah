# AEGIS-OS — ANTI-VIBECODE FIX
# ============================================================
# The site currently LOOKS impressive but FEELS broken.
# That is worse than a simple site that works perfectly.
# Every broken interaction signals "AI built this, not me."
#
# This file fixes every broken thing. Claude Code must:
# 1. Open index.html
# 2. Test every single interaction listed below
# 3. Fix anything that doesn't work EXACTLY as described
# 4. Strip all AI-generated comments from JS
# 5. Run test-vibecode.js to verify
#
# DO NOT add new features. ONLY fix what's broken.
# A working simple thing beats a broken complex thing.
# ============================================================

## FIX STATE
FIX_BROKEN_INTERACTIONS:  [x] COMPLETE  — 2026-03-16
FIX_CURSOR_DUPLICATE:     [x] COMPLETE  — 2026-03-16
FIX_COMMENTS_STRIPPED:    [x] COMPLETE  — 2026-03-16
FIX_ONBOARDING:           [x] COMPLETE  — 2026-03-16
FIX_MOBILE:               [x] COMPLETE  — 2026-03-16
FIX_PERFORMANCE:          [x] COMPLETE  — 2026-03-16

---

## WHAT "VIBE CODED" MEANS HERE

The r/webdevelopment community specifically called out:
1. "lots of leftover AI comments in the code"
2. "many buttons don't outright work"
3. "cursor duplicates when hovering over links"
4. "couldn't find any info in the first 10 seconds"
5. "everything is inline — CSS, JS, HTML in one file"
6. "double click not intuitive for a website"
7. "terminal, case files, intel — meaningless to first-time user"

The fix is NOT aesthetics. The fix is EVERYTHING WORKS, EVERY TIME.

---

## FIX 1 — STRIP ALL AI COMMENTS

This is non-negotiable. AI-generated comments are the #1 signal
that code was vibe-coded. A senior engineer does not write:

```javascript
// ─── 1. STATE ───────────────────────────────────────────────────
// This module tracks all OS state
// windows: stores all open window references
// zIndex: tracks current highest z-index for focus management
```

They write nothing. Or at most: `// OS global state`

### Rules for comment stripping:

DELETE every comment matching these patterns:

```
// ─── anything ───        (decorative ASCII dividers)
// Step N:                 (numbered step comments)
// Implementation          (section label comments)
// Visual spec:            (describing CSS)
// In [function], each:    (explaining a loop)
// Called every Nms        (timing comments)
// Returns HTML string     (JSDoc without JSDoc syntax)
// opts: title, icon...    (inline parameter docs)
// [MODULE NAME]           (if it's just restating the function name)
/* any block comment describing what the next line does */
```

KEEP only:
```
// [single word or phrase — WHY this exists, not WHAT it does]
// e.g.: // skip if already booted
// e.g.: // clamp to menubar height
// e.g.: // lerp toward mouse
```

Target: reduce comment lines by 80%. If the code needs a paragraph
to explain it, rewrite the code to be self-explanatory.

### After stripping, minify variable names in non-critical helpers:
- Loop variables: use i, j, k
- Event params: use e
- Element refs: descriptive but short — el, btn, win, node

---

## FIX 2 — EVERY BROKEN INTERACTION

Go through this list. Test each one. Fix every failure.

### 2.1 Window Controls (Traffic Lights)

TEST: Open any app. Click the red close button.
EXPECTED: Window closes with shrink animation.
COMMON FAILURE: Nothing happens, or console error.

TEST: Click the yellow minimize button.
EXPECTED: Window animates to dock position, disappears.
COMMON FAILURE: Window just hides in place with no animation.

TEST: Click the green maximize button.
EXPECTED: Window expands to fill screen minus menubar.
Click again → restores to original size.
COMMON FAILURE: Nothing happens.

FIX PATTERN — make sure event listeners are attached AFTER
the window is created and inserted into DOM:
```javascript
// WRONG — element doesn't exist yet when this runs
document.querySelector('.wc-close').addEventListener(...)

// RIGHT — use event delegation on the desktop container
document.getElementById('desktop').addEventListener('click', e => {
  if (e.target.classList.contains('wc-close')) {
    const id = e.target.dataset.winId
    WM.close(id)
  }
  if (e.target.classList.contains('wc-minimize')) {
    WM.minimize(e.target.dataset.winId)
  }
  if (e.target.classList.contains('wc-maximize')) {
    WM.toggleMaximize(e.target.dataset.winId)
  }
})
```

### 2.2 Window Dragging

TEST: Click and drag the titlebar of any window.
EXPECTED: Window follows mouse smoothly.
COMMON FAILURE: Window jumps to wrong position, or doesn't move.

FIX: Make sure offset is calculated from window's current position,
not from (0,0):
```javascript
startDrag(e, id) {
  const win = document.getElementById('win-' + id)
  const rect = win.getBoundingClientRect()
  OS.dragState = {
    id,
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top
  }
  WM.focus(id)
},
onDrag(e) {
  if (!OS.dragState) return
  const win = document.getElementById('win-' + OS.dragState.id)
  let x = e.clientX - OS.dragState.offsetX
  let y = e.clientY - OS.dragState.offsetY
  // clamp — cannot drag above menubar
  y = Math.max(28, y)
  // clamp — cannot drag fully off screen
  x = Math.max(-win.offsetWidth + 60, Math.min(window.innerWidth - 60, x))
  win.style.left = x + 'px'
  win.style.top  = y + 'px'
}
```

### 2.3 Desktop Icons — Single Click to Open

TEST: Single-click any desktop icon.
EXPECTED: App opens immediately.
CURRENT BUG: Requires double-click (not intuitive for a website).

FIX: Change dblclick to click on all desktop icons:
```javascript
// Find every instance of 'dblclick' on desktop icons
// Replace with 'click'
iconEl.addEventListener('click', (e) => {
  e.stopPropagation()
  Desktop.openApp(iconEl.dataset.appId)
})
```

### 2.4 Terminal — All Commands Must Work

TEST: Open Terminal. Type each command. Press Enter.
EXPECTED: Every command produces output.

Go through EVERY command and verify it produces output.
Fix any that show "command not found" when they shouldn't:

```
help        → must list all commands in a formatted table
whoami      → must output Manan's details line by line
ls          → must output directory listing
ls projects/→ must list 4 projects
cat projects/phishnet      → full PhishNet detail
cat projects/aegisscan     → full AegisScan detail
cat projects/cloud-ir-lab  → full Cloud-IR-Lab detail
cat projects/log-aggregator→ full Log-Aggregator detail
cat skills  → categories + tools
cat research→ research items
ping github → fake ping + URL
curl contact→ JSON contact info
sudo hire manan → full easter egg sequence
clear       → clears terminal output
history     → last N commands
uname -a    → OS string
uptime      → fake uptime
pwd         → /home/manan/portfolio
exit        → funny response, does not close window
```

COMMON FAILURE: Commands that have spaces (like `ls projects/`)
not matching because the command parser only checks exact strings.

FIX the command parser to handle:
```javascript
// Split input into command + args
const parts = input.trim().toLowerCase().split(/\s+/)
const cmd = parts[0]
const args = parts.slice(1).join(' ')

// Then match on cmd + args combination:
if (cmd === 'cat' && args === 'projects/phishnet') { ... }
if (cmd === 'ls' && args === 'projects/') { ... }
if (cmd === 'ls' && args === '') { ... }
if (cmd === 'sudo' && args === 'hire manan') { ... }
```

### 2.5 App Sidebar Navigation (Projects + Finder)

TEST: Open Projects (Case Files). Click each project in sidebar.
EXPECTED: Right panel updates with that project's content.
COMMON FAILURE: Nothing happens on click, or console error.

TEST: Open About Me (Finder). Click 'Quick Stats', 'Status'.
EXPECTED: Main panel switches to that view.
COMMON FAILURE: Clicks do nothing.

FIX: Use event delegation, not direct addEventListener on sidebar items
(which are dynamically created and may not have listeners attached):
```javascript
document.getElementById('desktop').addEventListener('click', e => {
  const sidebarItem = e.target.closest('[data-view]')
  if (sidebarItem) {
    const viewId = sidebarItem.dataset.view
    const appId = sidebarItem.dataset.app
    // switch view
    switchView(appId, viewId)
  }

  const projItem = e.target.closest('[data-project]')
  if (projItem) {
    AppProjects.selectProject(projItem.dataset.project)
  }
})
```

### 2.6 Skills App — Radar Chart Must Render

TEST: Open Skills app.
EXPECTED: Radar chart visible immediately on open.
COMMON FAILURE: Empty canvas, chart never renders.

Root cause: Chart.js tries to render before the canvas has dimensions
because the window animation hasn't completed yet.

FIX: Initialize chart AFTER window open animation completes:
```javascript
// In WM.create(), after GSAP open animation onComplete:
onComplete: () => {
  if (id === 'skills') AppSkills.initChart()
}
```

Also ensure the canvas has explicit dimensions:
```html
<canvas id="skills-radar" width="260" height="260"></canvas>
```

### 2.7 Experience App — Timeline Animation

TEST: Open Experience app.
EXPECTED: SVG line draws from top, then cards fade in sequentially.
COMMON FAILURE: Static layout, no animation, or cards all visible instantly.

FIX: Trigger animateTimeline() AFTER window open animation:
```javascript
onComplete: () => {
  if (id === 'experience') AppExperience.animateTimeline()
}
```

animateTimeline() must:
1. Set SVG line stroke-dashoffset to full length
2. GSAP animate dashoffset to 0 over 1.2s
3. For each card: set opacity 0, translateX 20px
4. Stagger reveal: each card fades in 250ms after previous

### 2.8 Network Mode — Fly to Node Must Work

TEST: Open Network mode (N key or dock icon).
EXPECTED: 3D network loads, nodes visible, clicking a node flies camera to it.
COMMON FAILURE: Black screen, or nodes appear but click does nothing.

FIX CHECKLIST:
- [ ] renderer is attached to #network-canvas, not a new canvas
- [ ] raycaster intersectObjects uses recursive:true for cluster nodes
- [ ] onClick is bound to the canvas element, not document
- [ ] flyToNode runs GSAP on camera.position (not on a proxy object)
- [ ] openPanel is called in onComplete of the GSAP tween, not immediately

### 2.9 Dock — All Icons Open Their Apps

TEST: Click every dock icon.
EXPECTED: Corresponding app window opens (or focuses if already open).
COMMON FAILURE: Some dock icons do nothing.

FIX: Verify the dock items array maps EXACTLY to app open functions:
```javascript
const DOCK_APPS = [
  { id: 'finder',     open: () => WM.create('finder',     { ...AppFinder.config,     content: AppFinder.render() }) },
  { id: 'terminal',   open: () => WM.create('terminal',   { ...AppTerminal.config,   content: AppTerminal.render() }) },
  { id: 'projects',   open: () => WM.create('projects',   { ...AppProjects.config,   content: AppProjects.render() }) },
  { id: 'research',   open: () => WM.create('research',   { ...AppResearch.config,   content: AppResearch.render() }) },
  { id: 'experience', open: () => WM.create('experience', { ...AppExperience.config, content: AppExperience.render() }) },
  { id: 'skills',     open: () => WM.create('skills',     { ...AppSkills.config,     content: AppSkills.render() }) },
  { id: 'contact',    open: () => WM.create('contact',    { ...AppContact.config,    content: AppContact.render() }) },
  { id: 'network',    open: () => NetworkMode.enter() },
  { id: 'resume',     open: () => { const a = document.createElement('a'); a.href='assets/resume.pdf'; a.download='Manan_Shah_Resume.pdf'; a.click() } },
]

// If app already open: focus it instead of opening a second instance
function openOrFocus(id) {
  if (OS.windows[id]) {
    WM.focus(id)
    if (OS.windows[id].minimized) WM.restore(id)
  } else {
    const app = DOCK_APPS.find(a => a.id === id)
    if (app) app.open()
  }
}
```

### 2.10 Keyboard Shortcuts Must All Work

TEST each shortcut:
```
Ctrl/Cmd + 1   → opens/focuses About Me
Ctrl/Cmd + 2   → opens/focuses Terminal
Ctrl/Cmd + 3   → opens/focuses Projects
Ctrl/Cmd + W   → closes focused window
Ctrl/Cmd + M   → minimizes focused window
` (backtick)   → toggles Terminal
Escape         → closes context menu OR closes focused panel
N              → toggles Network Mode
```

FIX: Ensure keydown handler checks OS.activeWindow before Ctrl+W/M:
```javascript
document.addEventListener('keydown', e => {
  const ctrl = e.ctrlKey || e.metaKey
  if (ctrl && e.key === 'w' && OS.activeWindow) {
    e.preventDefault()
    WM.close(OS.activeWindow)
  }
  if (ctrl && e.key === 'm' && OS.activeWindow) {
    e.preventDefault()
    WM.minimize(OS.activeWindow)
  }
  if (e.key === '`') {
    e.preventDefault()
    if (OS.windows['terminal']) {
      if (OS.windows['terminal'].minimized) WM.restore('terminal')
      else WM.focus('terminal')
    } else {
      openOrFocus('terminal')
    }
  }
  if (e.key === 'n' || e.key === 'N') {
    if (!document.activeElement.matches('input, textarea')) {
      NetworkMode.active ? NetworkMode.exit() : NetworkMode.enter()
    }
  }
})
```

---

## FIX 3 — CURSOR DUPLICATE BUG

The native cursor is showing through the custom cursor on hover.
This creates a double-cursor effect that looks broken.

OPTION A (recommended): Remove custom cursor entirely.
- DELETE: #cursor element
- DELETE: Cursor module  
- DELETE: `cursor: none` from body
- ADD: proper cursor CSS states (see below)
- RESULT: Zero bugs, works everywhere, recruiters not confused

```css
body                          { cursor: default; }
a, button, .dock-item,
.desktop-icon, [data-app],
[data-project], [data-view]   { cursor: pointer; }
.window-titlebar              { cursor: grab; }
.window-titlebar:active       { cursor: grabbing; }
.window-resize-handle         { cursor: se-resize; }
#network-canvas               { cursor: crosshair; }
#network-canvas.hovering-node { cursor: pointer; }
```

OPTION B (if keeping custom cursor): Fix the duplicate.
The issue is `cursor: none` is not cascading to all elements.
Fix:
```css
*, *::before, *::after { cursor: none !important; }
```
AND increase lerp speed from 0.18 to 0.4 to reduce lag.

---

## FIX 4 — ONBOARDING

No user should open the site and feel lost.
First 10 seconds must communicate: who Manan is, and how to navigate.

### 4.1 — Rename apps to plain English (DO THIS FIRST)

| Current label  | New label     |
|----------------|---------------|
| Finder         | About Me      |
| Case Files     | Projects      |
| Intel          | Research      |
| Field Record   | Experience    |
| Capabilities   | Skills        |

Change ONLY display strings. Internal IDs stay the same.

### 4.2 — Welcome modal on first visit

Show once, dismissed with one click, stored in localStorage.
Content:
- Title: "Welcome to AEGIS-OS"
- Body: "Manan's portfolio — built as an interactive desktop."
- Instruction line 1: "Click any icon to open an app."
- Instruction line 2: "Start with About Me to learn who Manan is."
- Button: "Start exploring →"

Style: centered modal, var(--os-glass) background, blur backdrop,
border-radius 16px, max-width 420px. Clean. Not distracting.

### 4.3 — Finder (About Me) opens automatically after onboarding dismissed

When user clicks "Start exploring →" on the welcome modal:
1. Dismiss modal
2. Immediately open About Me (Finder) window
3. This ensures the user immediately sees Manan's name, role, and bio

```javascript
document.getElementById('onboarding-dismiss').addEventListener('click', () => {
  // dismiss modal
  gsap.to(overlay, { opacity: 0, duration: 0.3 })
  localStorage.setItem('aegis-onboarded', '1')
  // open About Me
  setTimeout(() => openOrFocus('finder'), 400)
})
```

### 4.4 — Menubar shows hint text before any window is open

In the menubar app-name slot, before any window is focused, show:
"Click an icon to get started" in var(--os-text-3), italic.
When a window is focused, replace with the app name as normal.

---

## FIX 5 — MOBILE

### 5.1 — Viewport meta (verify exists)
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 5.2 — Mobile media query (replace entire existing one)
```css
@media (max-width: 768px) {
  #menubar, #dock, #desktop-icons,
  #network-overlay, .window,
  #onboarding-overlay, #help-btn { display: none !important; }

  #mobile-fallback { display: flex !important; }
}
```

### 5.3 — Mobile fallback content (replace existing)

The mobile fallback must show a clean, complete, usable page.
Not just a message saying "visit on desktop". Give them the content.

Structure:
```
[Shield icon — 40px, --os-accent]

MANAN SHAH
[Syne 800, 2rem, --os-text-1]

Cybersecurity Engineer
[DM Sans, 0.88rem, --os-accent, letter-spacing 0.15em]

UTA · May 2026 · Open to full-time roles
[DM Sans, 0.8rem, --os-text-3]

──────────────────

About:
I build tools that find what attackers look for before they do.
Container security researcher at UTA. AppSec + cloud security
internship background. Graduating May 2026.
[DM Sans, 0.88rem, --os-text-2, line-height 1.8]

──────────────────

[GitHub button — full width, outlined]
[LinkedIn button — full width, outlined]
[Email button — full width, outlined]
[Resume button — full width, filled --os-accent]

──────────────────

For the full interactive experience, visit on desktop.
[DM Sans, 0.72rem, --os-text-3, italic, centered]
```

Button style: full width, 48px height, border-radius 10px,
DM Sans 0.88rem 600, gap 12px between buttons.

---

## FIX 6 — PERFORMANCE

### 6.1 — Add defer to all CDN scripts
```html
<script defer src="...three.min.js"></script>
<script defer src="...gsap.min.js"></script>
<script defer src="...chart.umd.min.js"></script>
```

### 6.2 — Add meta description
```html
<meta name="description" content="Manan Shah — Cybersecurity Engineer. Container security, AppSec, cloud IR. UTA 2026.">
```

### 6.3 — Initialize Three.js AFTER boot completes
Move `Wallpaper.init()` call from DOMContentLoaded to inside
`Boot.finish()`, after the desktop fade-in. This prevents Three.js
from competing with the boot animation for CPU on load.

### 6.4 — Initialize Chart.js only when Skills window opens
Chart.js should NOT be initialized on page load.
Call `AppSkills.initChart()` only in the WM.create onComplete
callback when id === 'skills'.

---

## TEST FILE

```javascript
// test-vibecode.js
// Run: node test-vibecode.js
// Tests that all fixes are applied correctly

const fs = require('fs')
const html = fs.readFileSync('./index.html', 'utf8')
let passed = 0, failed = 0

function test(name, condition) {
  if (condition) { console.log(`  ✅ ${name}`); passed++ }
  else { console.log(`  ❌ FAIL: ${name}`); failed++ }
}

console.log('\n🧪 ANTI-VIBECODE TESTS\n')

// Comment stripping
const longComments = (html.match(/\/\/ ─{3,}/g) || [])
test('No decorative ASCII divider comments', longComments.length === 0)

const stepComments = (html.match(/\/\/ Step \d+:/g) || [])
test('No "Step N:" comments', stepComments.length === 0)

const visualSpecComments = (html.match(/\/\/ Visual spec:/g) || [])
test('No "Visual spec:" comments', visualSpecComments.length === 0)

// Single click (not double click) on desktop icons
test('Desktop icons use single click (not dblclick)',
  !html.includes("dblclick") ||
  (html.includes('dblclick') && html.match(/dblclick/g).length <= 1))

// App labels renamed
test("'About Me' label used (not 'Finder')",
  html.includes('About Me'))
test("'Projects' label used (not 'Case Files')",
  html.includes('Projects') && !html.includes('Case Files'))
test("'Research' label used (not 'Intel')",
  !html.includes(">Intel<") && !html.includes("'Intel'"))
test("'Experience' label used (not 'Field Record')",
  !html.includes('Field Record'))
test("'Skills' label used (not 'Capabilities')",
  !html.includes('Capabilities'))

// Onboarding
test('Welcome modal defined', html.includes('onboarding-overlay') || html.includes('welcome-modal'))
test('localStorage onboarding key set', html.includes('aegis-onboarded'))
test('Finder auto-opens after onboarding', html.includes('onboarding') && html.includes('finder') && html.includes('openOrFocus'))
test('Menubar hint text for new users', html.includes('Click an icon') || html.includes('get started'))

// Event delegation (not direct listeners on dynamic elements)
test('Event delegation used for window controls',
  html.includes("closest('.wc-") || html.includes("classList.contains('wc-close')"))
test('openOrFocus function defined',
  html.includes('openOrFocus') || html.includes('open-or-focus'))
test('openOrFocus prevents duplicate windows',
  html.includes('OS.windows[id]') || html.includes("OS.windows['") )

// Cursor fix
const hasCursorNone = html.includes('cursor: none') || html.includes('cursor:none')
const hasImportantCursorNone = html.includes('cursor: none !important') || html.includes('cursor:none!important')
test('Cursor duplicate fixed (either removed or !important applied)',
  !hasCursorNone || hasImportantCursorNone)

// Terminal command parser
test('Terminal splits input into cmd + args',
  html.includes('.split(') && html.includes('parts[0]') ||
  html.includes('cmd ===') && html.includes('args ==='))
test('sudo hire manan easter egg works',
  html.includes('sudo') && html.includes('hire manan') && html.includes('ACCESS GRANTED'))
test('Terminal clear command works',
  html.includes("'clear'") && (html.includes('innerHTML = ') || html.includes('.innerHTML=')))

// Chart.js lazy init
test('Chart.js initialized in WM.create onComplete (not on load)',
  html.includes('initChart') && html.includes('onComplete'))

// Experience timeline triggered correctly
test('Timeline animation triggered in WM onComplete',
  html.includes('animateTimeline') && html.includes('onComplete'))

// Scripts deferred
test('Three.js script has defer', html.match(/defer[^>]*three\.min\.js|three\.min\.js[^>]*defer/) !== null)
test('GSAP script has defer', html.match(/defer[^>]*gsap\.min\.js|gsap\.min\.js[^>]*defer/) !== null)

// Mobile
test('Viewport meta tag present',
  html.includes('width=device-width'))
test('Mobile media query hides OS elements',
  html.includes('@media') && html.includes('768px') && html.includes('display: none'))
test('Mobile fallback shows full content (not just "visit on desktop")',
  html.includes('mobile-fallback') && html.includes('MANAN SHAH') &&
  html.includes('github') && html.includes('linkedin'))

// Meta description
test('Meta description added',
  html.includes('<meta name="description"'))

// Wallpaper lazy init
test('Wallpaper.init called in Boot.finish (not DOMContentLoaded)',
  !html.match(/DOMContentLoaded[\s\S]{0,200}Wallpaper\.init/) ||
  html.includes('Boot.finish') && html.includes('Wallpaper.init'))

// No var declarations
test('No var declarations', !html.match(/\bvar\s+\w/))

// No inline onclick
test('No inline onclick handlers', !html.match(/\sonclick\s*=/))

// All 9 dock apps mapped
test('All dock apps have open handlers',
  ['finder','terminal','projects','research','experience','skills','contact','network','resume']
    .every(id => html.includes(`'${id}'`)))

console.log(`\n📊 ${passed} passed, ${failed} failed`)
if (failed > 0) {
  console.log('\n🔴 Vibe-code issues remain. Fix all failures above.\n')
  process.exit(1)
} else {
  console.log('\n🟢 All fixes applied. Site no longer feels vibe-coded.\n')
  process.exit(0)
}
```

---

## PRIORITY ORDER

If time is limited, fix in this order:

1. **Single click on icons** — most complained about, 5 minute fix
2. **Rename app labels** — instant credibility boost, 10 minute fix
3. **Welcome modal + auto-open Finder** — fixes "couldn't find info in 10s"
4. **Event delegation for all clicks** — fixes buttons that don't work
5. **Cursor duplicate** — highly visible bug, embarrassing
6. **Terminal command parser** — fixes commands that don't respond
7. **Chart.js + timeline in onComplete** — fixes broken app content
8. **Strip comments** — removes "vibe-coded" signal from source code
9. **Mobile fallback** — makes site usable on phones
10. **Script defer + lazy init** — performance polish

---

## DEFINITION OF DONE

The site is no longer vibe-coded when:

- [ ] A first-time visitor can find Manan's name, role, and GitHub
      within 10 seconds without any instructions
- [ ] Every single click on every interactive element does something
- [ ] No console errors on any interaction
- [ ] The terminal responds to every documented command
- [ ] The radar chart renders when Skills is opened
- [ ] The timeline animates when Experience is opened
- [ ] Network mode loads and clicking a node flies the camera to it
- [ ] Mobile shows a complete, usable fallback page
- [ ] Opening the browser DevTools source shows clean, readable code
      with minimal comments — not walls of AI explanation text
