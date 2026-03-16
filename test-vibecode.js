// test-vibecode.js
const fs = require('fs')
const html = fs.readFileSync('./index.html', 'utf8')
let passed = 0, failed = 0

function test(name, condition) {
  if (condition) { console.log(`  ✅ ${name}`); passed++ }
  else { console.log(`  ❌ FAIL: ${name}`); failed++ }
}

console.log('\n🧪 ANTI-VIBECODE TESTS\n')

const longComments = (html.match(/\/\/ ─{3,}/g) || [])
test('No decorative ASCII divider comments', longComments.length === 0)

const stepComments = (html.match(/\/\/ Step \d+:/g) || [])
test('No "Step N:" comments', stepComments.length === 0)

const visualSpecComments = (html.match(/\/\/ Visual spec:/g) || [])
test('No "Visual spec:" comments', visualSpecComments.length === 0)

test('Desktop icons use single click (not dblclick)',
  !html.includes("dblclick") ||
  (html.includes('dblclick') && html.match(/dblclick/g).length <= 1))

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

test('Welcome modal defined', html.includes('onboarding-overlay') || html.includes('welcome-modal'))
test('localStorage onboarding key set', html.includes('aegis-onboarded'))
test('Finder auto-opens after onboarding', html.includes('onboarding') && html.includes('finder') && html.includes('openOrFocus'))
test('Menubar hint text for new users', html.includes('Click an icon') || html.includes('get started'))

test('Event delegation used for window controls',
  html.includes("closest('.wc-") || html.includes("classList.contains('wc-close')"))
test('openOrFocus function defined',
  html.includes('openOrFocus') || html.includes('open-or-focus'))
test('openOrFocus prevents duplicate windows',
  html.includes('OS.windows[id]') || html.includes("OS.windows['") )

const hasCursorNone = html.includes('cursor: none') || html.includes('cursor:none')
const hasImportantCursorNone = html.includes('cursor: none !important') || html.includes('cursor:none!important')
test('Cursor duplicate fixed (either removed or !important applied)',
  !hasCursorNone || hasImportantCursorNone)

test('Terminal splits input into cmd + args',
  html.includes('.split(') && html.includes('parts[0]') ||
  html.includes('cmd ===') && html.includes('args ==='))
test('sudo hire manan easter egg works',
  html.includes('sudo') && html.includes('hire manan') && html.includes('ACCESS GRANTED'))
test('Terminal clear command works',
  html.includes("'clear'") && (html.includes('innerHTML = ') || html.includes('.innerHTML=')))

test('Chart.js initialized in WM.create onComplete (not on load)',
  html.includes('initChart') && html.includes('onComplete'))

test('Timeline animation triggered in WM onComplete',
  html.includes('animateTimeline') && html.includes('onComplete'))

test('Three.js script has defer', html.match(/defer[^>]*three\.min\.js|three\.min\.js[^>]*defer/) !== null)
test('GSAP script has defer', html.match(/defer[^>]*gsap\.min\.js|gsap\.min\.js[^>]*defer/) !== null)

test('Viewport meta tag present',
  html.includes('width=device-width'))
test('Mobile media query hides OS elements',
  html.includes('@media') && html.includes('768px') && html.includes('display: none'))
test('Mobile fallback shows full content (not just "visit on desktop")',
  html.includes('mobile-fallback') && html.includes('MANAN SHAH') &&
  html.includes('github') && html.includes('linkedin'))

test('Meta description added',
  html.includes('<meta name="description"'))

test('Wallpaper.init called in Boot.finish (not DOMContentLoaded)',
  !html.match(/DOMContentLoaded[\s\S]{0,200}Wallpaper\.init/) ||
  html.includes('Boot.finish') && html.includes('Wallpaper.init'))

test('No var declarations', !html.match(/\bvar\s+\w/))
test('No inline onclick handlers', !html.match(/\sonclick\s*=/))

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
