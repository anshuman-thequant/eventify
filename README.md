# Eventify – Responsive Event Management Website

A modern, fully responsive event management website built with **HTML5, CSS3 and vanilla JavaScript** (no frameworks, no build step). Users can explore upcoming events, search and filter them, read detailed information, and register through a validated form. Registrations are stored in the browser using Local Storage.

**Live demo:** _add your Vercel / Netlify / GitHub Pages link here_
**Repository:** _add your GitHub repository link here_

---

## Features

### Core
- **Hero section** with animated gradient background, call-to-action buttons and animated stats.
- **Featured events** and a full **Upcoming Events** grid of event cards (image, name, date, venue, short description, price).
- **Search** by name, venue, category or keyword (debounced, live results).
- **Category filter chips** (All, Tech, Music, Workshop, Sports, Art) plus **sorting** (soonest, A–Z, price).
- **Event details modal** with full description, date, time, venue, price, seats and agenda.
- **Registration form** collecting name, email, phone number, selected event (and ticket count).
- **JavaScript validation** with inline error messages, success/error states and focus on the first invalid field.
- **Confirmation message** with a unique booking ID after a successful submission.
- **Fully responsive** layout for mobile, tablet and desktop, with a hamburger menu on small screens.

### Bonus challenges implemented
- 🌗 **Dark / light mode** – remembers the choice and respects the system preference on first visit.
- ⏱️ **Event countdown timers** – live days/hours/minutes/seconds in the details modal, and a mini countdown on each card.
- ✨ **Animations** – scroll-reveal, card hover effects, modal transitions, animated counters, floating hero blobs (all disabled automatically for users with `prefers-reduced-motion`).
- 💾 **Local Storage registration management** – registrations persist across reloads, shown in a **My Tickets** section, and can be cancelled. Duplicate registrations (same email + event) are blocked.

---

## Tech stack
| Area | Technology |
| --- | --- |
| Structure | HTML5 (semantic elements, ARIA attributes) |
| Styling | CSS3 (custom properties, Grid, Flexbox, media queries, `color-mix`) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | Browser Local Storage |
| Fonts / images | Google Fonts (Outfit, Inter), picsum.photos placeholder images |
| Version control / hosting | Git, GitHub, GitHub Pages / Netlify / Vercel |

---

## Project structure
```
eventify/
├── index.html   # Page structure and sections
├── styles.css   # Design tokens, layout, components, themes, responsive rules
├── script.js    # Data, rendering, search/filter, validation, storage, theme, animations
└── README.md
```

---

## How it works

**Event data** lives in a JavaScript array in `script.js`. Dates are generated relative to today, so the events always appear as "upcoming". To use fixed dates, replace the `daysFromNow(n)` calls with ISO date strings.

**Rendering** – card HTML is generated from the data for both the featured section and the main grid. Search, category and sort controls update a small `state` object and re-render the grid.

**Validation rules**
| Field | Rule |
| --- | --- |
| Name | Required, at least 3 characters, letters/spaces/`.`/`'`/`-` only |
| Email | Required, valid `name@domain.tld` format |
| Phone | Required, exactly 10 digits, starting with 6–9 (optional +91 / 0 prefix accepted) |
| Event | Must select an event |

Fields validate on blur and re-validate as the user types after an error, so feedback is immediate but not annoying.

**Local Storage keys**
- `eventify_registrations` – array of registration objects (id, eventId, name, email, phone, tickets, total, createdAt)
- `eventify_theme` – `"light"` or `"dark"`

**Accessibility** – skip link, keyboard-friendly controls, visible focus states, `aria-live` regions for results and errors, modal closes with `Esc`, and focus is restored after closing.

---

## Run locally
No installation needed.

```bash
git clone <your-repo-url>
cd eventify
# open index.html in your browser, or serve it:
npx serve .
```

---

## Deployment

**GitHub Pages**
1. Push the project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. Your site will be live at `https://<username>.github.io/<repo>/`.

**Netlify** – drag and drop the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop), or connect the GitHub repo (no build command, publish directory `.`).

**Vercel** – import the repo at [vercel.com/new](https://vercel.com/new) and deploy with the default settings (Framework Preset: *Other*).

---

## Git workflow used
```bash
git init
git add .
git commit -m "feat: add event listing, search and filters"
git branch -M main
git remote add origin https://github.com/<username>/eventify.git
git push -u origin main
```
Suggested commit history: layout & hero → event cards → search/filter → details modal → registration form + validation → Local Storage → dark mode & countdown → responsiveness polish → README.

---

## Possible future improvements
- Backend / database for real registrations and email confirmations
- User accounts and an organizer dashboard
- Calendar export (.ics) and map integration for venues
- Payment gateway for paid events

---

## Author
Built as part of the **K Explore – Web Designing** task.
