# Work History

## 2026-03-10 — Initial Homepage Implementation

### What was done
- Created the Korean Defense Conference Deadlines homepage from scratch
- Designed and implemented a static site using vanilla HTML, CSS, and JavaScript (no frameworks)
- Ready for GitHub Pages deployment

### Files created
| File | Purpose |
|---|---|
| `index.html` | Main page with header, countdown section, conferences section, footer |
| `css/style.css` | Responsive styles with color-coded urgency indicators |
| `js/main.js` | Fetches `conferences.json`, renders countdown timers (auto-updates every 60s), conference cards, deadline tables, accepted papers |
| `data/conferences.json` | Central data file with 2 placeholder conferences (KDSA 2026, ADD Symposium 2026) |

### Key design decisions
- **Vanilla HTML/CSS/JS** — no build tools or frameworks needed; deploys directly on GitHub Pages
- **Data separated from presentation** — weekly updates only require editing `conferences.json`
- **Countdown timers** — client-side JS with color coding (green > 30 days, yellow 7-30 days, red < 7 days, gray = passed)
- **Mobile responsive** — flexbox layout adapts to small screens
- **Reference**: modeled after https://sec-deadlines.github.io/

### Next steps
- Replace placeholder conference data with real Korean defense conferences
- Enable GitHub Pages in repo settings (main branch, root directory)
- Add favicon/logo to `assets/`
