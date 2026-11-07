/* =========================================================
   Eventify – main script
   Features: render/search/filter/sort events, details modal,
   validated registration form, Local Storage tickets,
   countdown timers, dark/light theme, scroll animations.
   ========================================================= */
(() => {
  "use strict";

  /* ---------- Data ---------- */
  // Dates are generated relative to today so the "upcoming" list never goes stale.
  const daysFromNow = (d, hour = 10) => {
    const dt = new Date();
    dt.setDate(dt.getDate() + d);
    dt.setHours(hour, 0, 0, 0);
    return dt.toISOString();
  };

  const EVENTS = [
    { id: 1, name: "CodeSprint 24-Hour Hackathon", category: "Tech", date: daysFromNow(9, 9), venue: "Tech Park Auditorium, Bhubaneswar", price: 0, seats: 200, featured: true, seed: "hackathon",
      short: "Build, break and ship projects in a non-stop 24-hour coding marathon.",
      description: "Team up with fellow developers, designers and makers to solve real-world problems. Mentors from top companies, free meals and prizes worth ₹1,00,000 are waiting.",
      agenda: ["Kick-off & problem statements", "Hacking begins", "Mentor sessions", "Final demos & judging"] },
    { id: 2, name: "Sunset Indie Music Fest", category: "Music", date: daysFromNow(14, 17), venue: "Marine Drive Open Grounds", price: 799, seats: 800, featured: true, seed: "musicfest",
      short: "An open-air evening of indie bands, acoustic sets and food stalls.",
      description: "Eight live acts, craft food trucks and a golden-hour stage setup. Bring your friends and a picnic blanket for an unforgettable evening under the sky.",
      agenda: ["Gates open", "Acoustic opening acts", "Headline performance", "Closing DJ set"] },
    { id: 3, name: "UI/UX Design Masterclass", category: "Workshop", date: daysFromNow(6, 11), venue: "Creative Hub, Patia", price: 299, seats: 60, featured: true, seed: "designclass",
      short: "Hands-on Figma workshop covering research, wireframes and prototypes.",
      description: "Learn the full design process from user research to polished prototypes. Laptop required. Certificates provided to all participants.",
      agenda: ["Design thinking basics", "Wireframing in Figma", "Prototyping & testing", "Portfolio review"] },
    { id: 4, name: "City Marathon 10K", category: "Sports", date: daysFromNow(21, 6), venue: "Kalinga Stadium", price: 399, seats: 1500, featured: false, seed: "marathon",
      short: "Lace up for a scenic 10K run through the heart of the city.",
      description: "Chip-timed route with hydration points, medals for all finishers and a post-run breakfast. Open to all fitness levels.",
      agenda: ["Warm-up zumba", "Flag-off", "Finish line celebrations", "Prize distribution"] },
    { id: 4.5, name: "Contemporary Art Expo", category: "Art", date: daysFromNow(12, 11), venue: "Odisha Art Gallery", price: 150, seats: 300, featured: false, seed: "artexpo",
      short: "Explore paintings, sculptures and installations from 40+ artists.",
      description: "A curated showcase of contemporary regional and national artists with live painting demos and an artist meet-and-greet.",
      agenda: ["Gallery walk", "Live painting demo", "Artist talk", "Closing reception"] },
    { id: 5, name: "AI & Machine Learning Summit", category: "Tech", date: daysFromNow(28, 9), venue: "Convention Centre, Janpath", price: 999, seats: 500, featured: true, seed: "aisummit",
      short: "Talks and demos from industry leaders on the future of AI.",
      description: "Two tracks, 20+ speakers and live demos covering generative AI, MLOps and responsible AI. Networking lunch included.",
      agenda: ["Keynote", "Track A: GenAI", "Track B: MLOps", "Panel & networking"] },
    { id: 6, name: "Acoustic Nights – Open Mic", category: "Music", date: daysFromNow(4, 19), venue: "The Brew House Café", price: 0, seats: 80, featured: false, seed: "openmic",
      short: "Sing, strum or just listen at the city's friendliest open mic.",
      description: "Sign up on the spot to perform or relax with great coffee and live talent. All genres, all instruments welcome.",
      agenda: ["Sign-ups", "Open performances", "Featured artist set"] },
    { id: 7, name: "Web Development Bootcamp", category: "Workshop", date: daysFromNow(17, 10), venue: "Skill Lab, Chandrasekharpur", price: 499, seats: 80, featured: false, seed: "webdev",
      short: "A one-day sprint through HTML, CSS and JavaScript fundamentals.",
      description: "Build and deploy your first responsive website in a single day with guided exercises and a mentor on every table.",
      agenda: ["HTML5 & semantics", "CSS layouts", "JavaScript basics", "Deploy to GitHub Pages"] },
    { id: 8, name: "Inter-College Football Cup", category: "Sports", date: daysFromNow(33, 15), venue: "University Sports Ground", price: 100, seats: 600, featured: false, seed: "football",
      short: "Cheer on 16 college teams battling for the championship trophy.",
      description: "Knock-out format with spectacular finals, food stalls and cheer squads. Come support your college!",
      agenda: ["Opening ceremony", "Group matches", "Semi-finals", "Grand final"] },
    { id: 9, name: "Photography Walk & Workshop", category: "Art", date: daysFromNow(8, 7), venue: "Old Town Heritage Lane", price: 249, seats: 40, featured: false, seed: "photowalk",
      short: "Capture the city's heritage with a pro photographer guiding you.",
      description: "Learn composition, light and street-photography ethics on a guided 3-hour walk. Any camera or phone works.",
      agenda: ["Basics briefing", "Guided shoot", "Photo critique over chai"] },
    { id: 10, name: "Startup Pitch Night", category: "Tech", date: daysFromNow(24, 18), venue: "Innovation Garage, KIIT", price: 199, seats: 250, featured: false, seed: "startup",
      short: "Ten startups, five investors and one winner. Watch the pitches live.",
      description: "Meet founders, watch live pitches and network with investors and mentors from the startup ecosystem.",
      agenda: ["Networking", "Pitch round", "Investor Q&A", "Winner announced"] },
    { id: 11, name: "Classical Dance Evening", category: "Art", date: daysFromNow(19, 18), venue: "Rabindra Mandap", price: 350, seats: 400, featured: false, seed: "dance",
      short: "An enchanting evening of Odissi and other classical performances.",
      description: "Celebrated performers present a curated programme of classical dance, with commentary that makes the art form accessible to all.",
      agenda: ["Welcome", "Odissi performance", "Interval", "Ensemble finale"] }
  ].map((e, i) => ({ ...e, id: i + 1 }));

  const CATEGORIES = ["All", ...new Set(EVENTS.map(e => e.category))];
  const LS_KEY = "eventify_registrations";
  const THEME_KEY = "eventify_theme";

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const img = (seed, w = 800, h = 500) => `https://picsum.photos/seed/eventify-${seed}/${w}/${h}`;
  const money = p => (p === 0 ? "Free" : `₹${p.toLocaleString("en-IN")}`);
  const fmtDate = iso => new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const fmtTime = iso => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const getEvent = id => EVENTS.find(e => e.id === Number(id));
  const FALLBACK = "onerror=\"this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22500%22><defs><linearGradient id=%22g%22 x1=%220%22 y1=%220%22 x2=%221%22 y2=%221%22><stop offset=%220%22 stop-color=%22%236c4cf5%22/><stop offset=%221%22 stop-color=%22%23ff5fa2%22/></linearGradient></defs><rect width=%22800%22 height=%22500%22 fill=%22url(%23g)%22/></svg>'\"";

  const timeLeft = iso => {
    const diff = new Date(iso) - new Date();
    if (diff <= 0) return null;
    return {
      d: Math.floor(diff / 864e5),
      h: Math.floor((diff / 36e5) % 24),
      m: Math.floor((diff / 6e4) % 60),
      s: Math.floor((diff / 1e3) % 60)
    };
  };

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
  }

  /* ---------- Local Storage ---------- */
  const loadRegs = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
  };
  const saveRegs = list => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch { toast("Could not save – storage unavailable."); }
  };

  /* ---------- State ---------- */
  const state = { category: "All", query: "", sort: "date" };

  /* ---------- Rendering: cards ---------- */
  function cardHTML(e, i = 0) {
    const tl = timeLeft(e.date);
    return `
      <article class="card" style="animation-delay:${Math.min(i, 8) * 60}ms" data-id="${e.id}">
        <div class="card-media">
          <img src="${img(e.seed)}" alt="${esc(e.name)}" loading="lazy" ${FALLBACK} />
          <span class="tag">${esc(e.category)}</span>
          ${e.featured ? '<span class="star">★ Featured</span>' : ""}
        </div>
        <div class="card-body">
          <h3>${esc(e.name)}</h3>
          <div class="meta">
            <span>📅 ${fmtDate(e.date)} · ${fmtTime(e.date)}</span>
            <span>📍 ${esc(e.venue)}</span>
          </div>
          <p>${esc(e.short)}</p>
          ${tl ? `<span class="countdown-mini" data-countdown="${e.date}">⏳ ${tl.d}d ${tl.h}h ${tl.m}m left</span>` : ""}
          <div class="card-foot">
            <span class="price">${money(e.price)}</span>
            <div class="card-actions">
              <button class="btn btn-ghost btn-sm" data-action="details" data-id="${e.id}">Details</button>
              <button class="btn btn-primary btn-sm" data-action="register" data-id="${e.id}">Register</button>
            </div>
          </div>
        </div>
      </article>`;
  }

  function renderFeatured() {
    $("#featured-grid").innerHTML = EVENTS.filter(e => e.featured).slice(0, 3).map(cardHTML).join("");
  }

  function getFiltered() {
    const q = state.query.trim().toLowerCase();
    let list = EVENTS.filter(e =>
      (state.category === "All" || e.category === state.category) &&
      (!q || [e.name, e.venue, e.category, e.short, e.description].join(" ").toLowerCase().includes(q))
    );
    const sorters = {
      date: (a, b) => new Date(a.date) - new Date(b.date),
      name: (a, b) => a.name.localeCompare(b.name),
      price: (a, b) => a.price - b.price
    };
    return list.sort(sorters[state.sort]);
  }

  function renderEvents() {
    const list = getFiltered();
    $("#events-grid").innerHTML = list.map(cardHTML).join("");
    $("#empty").classList.toggle("hidden", list.length > 0);
    $("#result-count").textContent = `Showing ${list.length} of ${EVENTS.length} events`;
  }

  function renderChips() {
    $("#chips").innerHTML = CATEGORIES.map(c =>
      `<button class="chip ${c === state.category ? "active" : ""}" data-cat="${c}" aria-pressed="${c === state.category}">${c}</button>`).join("");
  }

  /* ---------- Details modal ---------- */
  let lastFocus = null;
  function openModal(id) {
    const modal = $(`#${id}`);
    lastFocus = document.activeElement;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    $(".modal-panel", modal).focus();
  }
  function closeModals() {
    $$(".modal").forEach(m => m.classList.add("hidden"));
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  let modalTimer;
  function showDetails(id) {
    const e = getEvent(id);
    if (!e) return;
    $("#modal-content").innerHTML = `
      <div class="detail-hero"><img src="${img(e.seed, 1200, 520)}" alt="${esc(e.name)}" ${FALLBACK} /></div>
      <div class="detail-body">
        <span class="eyebrow">${esc(e.category)}</span>
        <h2 id="modal-title" style="margin-top:12px">${esc(e.name)}</h2>
        <p class="muted">${esc(e.description)}</p>
        <div class="countdown" id="modal-countdown" aria-label="Time until event starts"></div>
        <div class="detail-grid">
          <div class="detail-item"><small>Date</small><strong>${fmtDate(e.date)}</strong></div>
          <div class="detail-item"><small>Time</small><strong>${fmtTime(e.date)}</strong></div>
          <div class="detail-item"><small>Venue</small><strong>${esc(e.venue)}</strong></div>
          <div class="detail-item"><small>Price</small><strong>${money(e.price)}</strong></div>
          <div class="detail-item"><small>Seats</small><strong>${e.seats} available</strong></div>
        </div>
        <h4>Agenda</h4>
        <ol class="agenda">${e.agenda.map(a => `<li>${esc(a)}</li>`).join("")}</ol>
        <button class="btn btn-primary btn-block" data-action="register" data-id="${e.id}" style="margin-top:20px">Register for this event</button>
      </div>`;
    const tick = () => {
      const box = $("#modal-countdown");
      if (!box) return;
      const t = timeLeft(e.date);
      box.innerHTML = t
        ? [["d", "Days"], ["h", "Hours"], ["m", "Mins"], ["s", "Secs"]].map(([k, l]) => `<div class="cd-box"><strong>${String(t[k]).padStart(2, "0")}</strong><span>${l}</span></div>`).join("")
        : "<p><strong>This event has started.</strong></p>";
    };
    tick();
    clearInterval(modalTimer);
    modalTimer = setInterval(tick, 1000);
    openModal("modal");
  }

  /* ---------- Registration form ---------- */
  const form = $("#reg-form");
  const eventSelect = $("#event");

  function fillEventSelect() {
    eventSelect.innerHTML = `<option value="">— Choose an event —</option>` +
      EVENTS.map(e => `<option value="${e.id}">${esc(e.name)} (${fmtDate(e.date)})</option>`).join("");
  }

  function updatePreview() {
    const e = getEvent(eventSelect.value);
    $("#selected-preview").innerHTML = e ? `
      <div class="preview-card">
        <img src="${img(e.seed, 200, 150)}" alt="" ${FALLBACK} />
        <div><h4>${esc(e.name)}</h4><span>${fmtDate(e.date)} · ${esc(e.venue)} · ${money(e.price)}</span></div>
      </div>` : "";
  }

  const validators = {
    name: v => {
      v = v.trim();
      if (!v) return "Please enter your full name.";
      if (v.length < 3) return "Name must be at least 3 characters.";
      if (!/^[A-Za-z][A-Za-z .'-]*$/.test(v)) return "Name can only contain letters, spaces, . ' and -";
      return "";
    },
    email: v => {
      v = v.trim();
      if (!v) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v)) return "Enter a valid email, e.g. you@example.com";
      return "";
    },
    phone: v => {
      v = v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
      if (!v) return "Please enter your phone number.";
      if (!/^\d+$/.test(v)) return "Phone number can only contain digits.";
      if (v.length !== 10) return "Phone number must be exactly 10 digits.";
      if (!/^[6-9]/.test(v)) return "Mobile numbers start with 6, 7, 8 or 9.";
      return "";
    },
    event: v => (v ? "" : "Please select an event.")
  };

  function validateField(name) {
    const input = form.elements[name];
    const msg = validators[name](input.value);
    const wrap = input.closest(".field");
    $(`#${name}-error`).textContent = msg;
    wrap.classList.toggle("invalid", !!msg);
    wrap.classList.toggle("valid", !msg && input.value !== "");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  Object.keys(validators).forEach(name => {
    const input = form.elements[name];
    input.addEventListener("blur", () => validateField(name));
    input.addEventListener("input", () => { if (input.closest(".field").classList.contains("invalid")) validateField(name); });
  });
  eventSelect.addEventListener("change", () => { validateField("event"); updatePreview(); });

  form.addEventListener("submit", ev => {
    ev.preventDefault();
    const results = Object.keys(validators).map(validateField);
    if (results.includes(false)) {
      const firstBad = $(".field.invalid input, .field.invalid select", form);
      if (firstBad) firstBad.focus();
      return;
    }
    const e = getEvent(eventSelect.value);
    const tickets = Number(form.elements.tickets.value);
    const regs = loadRegs();

    const email = form.elements.email.value.trim().toLowerCase();
    if (regs.some(r => r.eventId === e.id && r.email === email)) {
      $("#email-error").textContent = "This email is already registered for this event.";
      $("#email").closest(".field").classList.add("invalid");
      $("#email").focus();
      return;
    }

    const reg = {
      id: "EVT-" + Date.now().toString(36).toUpperCase().slice(-6),
      eventId: e.id,
      name: form.elements.name.value.trim(),
      email,
      phone: form.elements.phone.value.replace(/[\s-]/g, ""),
      tickets,
      total: e.price * tickets,
      createdAt: new Date().toISOString()
    };
    regs.push(reg);
    saveRegs(regs);
    renderTickets();
    showConfirmation(reg, e);
    form.reset();
    $$(".field", form).forEach(f => f.classList.remove("valid", "invalid"));
    $$(".error", form).forEach(x => (x.textContent = ""));
    updatePreview();
  });

  function showConfirmation(reg, e) {
    $("#confirm-body").innerHTML = `
      <div class="check" aria-hidden="true">✓</div>
      <h3 id="confirm-title">You're registered! 🎉</h3>
      <p class="muted">A confirmation has been saved for <strong>${esc(reg.email)}</strong>.</p>
      <div class="confirm-details">
        <div><span>Booking ID</span><strong>${reg.id}</strong></div>
        <div><span>Event</span><strong>${esc(e.name)}</strong></div>
        <div><span>Date</span><strong>${fmtDate(e.date)}</strong></div>
        <div><span>Tickets</span><strong>${reg.tickets}</strong></div>
        <div><span>Total</span><strong>${reg.total ? "₹" + reg.total.toLocaleString("en-IN") : "Free"}</strong></div>
      </div>
      <button class="btn btn-primary btn-block" data-close>Done</button>`;
    openModal("confirm-modal");
  }

  /* ---------- My tickets ---------- */
  function renderTickets() {
    const regs = loadRegs();
    $("#ticket-count").textContent = regs.length;
    $("#tickets-list").innerHTML = regs.length
      ? regs.slice().reverse().map(r => {
          const e = getEvent(r.eventId);
          return `
            <div class="ticket">
              <h4>${esc(e ? e.name : "Event")}</h4>
              <p>${e ? fmtDate(e.date) + " · " + esc(e.venue) : ""}</p>
              <p>${esc(r.name)} · ${r.tickets} ticket${r.tickets > 1 ? "s" : ""}</p>
              <p>Booking ID: <span class="ticket-id">${r.id}</span></p>
              <button class="btn btn-ghost btn-sm" data-action="cancel" data-reg="${r.id}">Cancel registration</button>
            </div>`;
        }).join("")
      : `<p class="tickets-empty">No registrations yet. Pick an event above and reserve your spot!</p>`;
  }

  /* ---------- Event delegation ---------- */
  function goRegister(id) {
    closeModals();
    eventSelect.value = id;
    validateField("event");
    updatePreview();
    $("#register").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => $("#name").focus({ preventScroll: true }), 600);
  }

  document.addEventListener("click", ev => {
    const btn = ev.target.closest("[data-action]");
    if (btn) {
      const { action, id, reg } = btn.dataset;
      if (action === "details") showDetails(id);
      if (action === "register") goRegister(id);
      if (action === "cancel") {
        saveRegs(loadRegs().filter(r => r.id !== reg));
        renderTickets();
        toast("Registration cancelled.");
      }
      return;
    }
    if (ev.target.closest("[data-close]")) { clearInterval(modalTimer); closeModals(); return; }
    const chip = ev.target.closest(".chip");
    if (chip) {
      state.category = chip.dataset.cat;
      renderChips();
      renderEvents();
    }
  });

  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape") { clearInterval(modalTimer); closeModals(); }
  });

  /* ---------- Search / sort ---------- */
  let searchTimer;
  $("#search").addEventListener("input", ev => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.query = ev.target.value; renderEvents(); }, 180);
  });
  $("#sort").addEventListener("change", ev => { state.sort = ev.target.value; renderEvents(); });
  $("#reset-filters").addEventListener("click", () => {
    state.category = "All"; state.query = ""; state.sort = "date";
    $("#search").value = ""; $("#sort").value = "date";
    renderChips(); renderEvents();
  });

  /* ---------- Theme ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    $("#theme-toggle").textContent = t === "dark" ? "☀️" : "🌙";
  }
  (() => {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch {}
    applyTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  })();
  $("#theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch {}
  });

  /* ---------- Mobile menu + navbar ---------- */
  const menuBtn = $("#menu-toggle"), navLinks = $("#nav-links");
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.textContent = open ? "✕" : "☰";
  });
  navLinks.addEventListener("click", ev => {
    if (ev.target.closest("a")) { navLinks.classList.remove("open"); menuBtn.textContent = "☰"; menuBtn.setAttribute("aria-expanded", "false"); }
  });
  window.addEventListener("scroll", () => $("#navbar").classList.toggle("scrolled", window.scrollY > 10), { passive: true });

  // Highlight active nav link
  const sections = $$("main section[id]");
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        $$(".nav-links a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- Scroll reveal + stat counters ---------- */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("visible"); revealObs.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => revealObs.observe(el));

  function animateCounters() {
    $$("[data-count]").forEach(el => {
      const target = Number(el.dataset.count);
      const start = performance.now(), dur = 1400;
      const step = now => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString("en-IN") + (p === 1 && target > 1000 ? "+" : "");
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- Live mini-countdowns on cards ---------- */
  setInterval(() => {
    $$("[data-countdown]").forEach(el => {
      const t = timeLeft(el.dataset.countdown);
      el.textContent = t ? `⏳ ${t.d}d ${t.h}h ${t.m}m left` : "🔴 Started";
    });
  }, 30000);

  /* ---------- Init ---------- */
  $("#year").textContent = new Date().getFullYear();
  // Keep the hero stats honest with the real data
  $('[data-count="12"]').dataset.count = EVENTS.length;
  $('[data-count="5"]').dataset.count = CATEGORIES.length - 1;
  renderFeatured();
  renderChips();
  renderEvents();
  fillEventSelect();
  renderTickets();
  animateCounters();
})();
