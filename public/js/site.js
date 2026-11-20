/* MaLinda Perry Consulting — page behavior */
(function () {
  "use strict";
  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function isUrl(u) { return typeof u === "string" && /^https?:\/\//i.test(u); }
  function extLink(url, label, cls) {
    return '<a class="' + cls + '" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + "</a>";
  }

  /* ---------- Year ---------- */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Email ---------- */
  $$(".js-email").forEach(function (a) {
    if (S.email) { a.href = "mailto:" + S.email; a.textContent = S.email; }
  });

  /* ---------- Social ---------- */
  var icons = {
    linkedin: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5v.01"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z"/></svg>'
  };
  var soc = $("#social");
  if (soc && S.social) {
    Object.keys(S.social).forEach(function (k) {
      if (isUrl(S.social[k])) soc.insertAdjacentHTML("beforeend",
        '<a href="' + esc(S.social[k]) + '" target="_blank" rel="noopener" aria-label="' + k + '">' + (icons[k] || k) + "</a>");
    });
  }

  /* ---------- Scheduling buttons ----------
     With a scheduleUrl: open it in a new tab.
     Without: scroll to the contact form and preselect the interest. */
  function setInterest(v) {
    var sel = $("#f-interest");
    if (sel && v) { $$("option", sel).forEach(function (o) { if (o.text === v) sel.value = o.value || o.text; }); }
  }
  function wireSchedule(root) {
    $$(".js-schedule", root).forEach(function (a) {
      if (isUrl(S.scheduleUrl)) {
        a.href = S.scheduleUrl; a.target = "_blank"; a.rel = "noopener";
      }
    });
  }
  wireSchedule(document);
  if (isUrl(S.scheduleUrl)) $$(".schedule-only").forEach(function (el) { el.hidden = false; });

  document.addEventListener("click", function (e) {
    var a = e.target.closest(".js-schedule, .js-interest");
    if (!a) return;
    if (a.target === "_blank") return; // external scheduler
    setInterest(a.getAttribute("data-interest") || (a.classList.contains("js-schedule") ? "" : null));
    closeModal();
    setTimeout(function () { var n = $("#f-name"); if (n) n.focus({ preventScroll: true }); }, 500);
  });

  /* ---------- Books ---------- */
  function coverHTML(b) {
    var bonus = b.bonus ? '<span class="cover-bonus">+ free workbook</span>' : "";
    if (b.cover) return '<img src="' + esc(b.cover) + '" alt="Cover of ' + esc(b.title) + '" loading="lazy">' + bonus;
    return '<div class="cover-art" aria-hidden="true"><small>' + esc(S.name || "") + '</small><span class="cover-arch"></span><b>' + esc(b.title) + "</b></div>";
  }
  function buyButtons(b, big) {
    var live = (b.buy || []).filter(function (l) { return isUrl(l.url); });
    if (!live.length) return '<span class="soon">Available soon</span>';
    return live.map(function (l, i) {
      var cls = "btn " + (i === 0 ? "btn-primary" : "btn-ghost") + (big ? "" : " btn-sm");
      // Payhip checkout opens in a new tab so this site stays open behind it.
      // Payhip emails the PDF after purchase.
      var url = payhipCode(l.url) ? "https://payhip.com/buy?link=" + payhipCode(l.url) : l.url;
      return extLink(url, l.label, cls);
    }).join("");
  }
  function payhipCode(url) {
    var m = /^https:\/\/payhip\.com\/b\/([A-Za-z0-9]+)\/?$/.exec(url || "");
    return m ? m[1] : "";
  }
  var bookList = $("#bookList");
  if (bookList) {
    var books = S.books || [];
    bookList.innerHTML = books.length ? books.map(function (b, i) {
      return '<article class="book reveal">' +
        '<div class="book-cover">' + coverHTML(b) + "</div>" +
        "<div>" +
          (b.format ? '<p class="book-meta">' + esc(b.format) + (b.price ? " &middot; " + esc(b.price) : "") + "</p>" : "") +
          "<h3>" + esc(b.title) + "</h3>" +
          (b.subtitle ? '<p class="book-sub">' + esc(b.subtitle) + "</p>" : "") +
          "<p>" + esc(b.blurb) + "</p>" +
          '<div class="card-actions">' + buyButtons(b) +
            '<button class="btn-text" data-book="' + i + '">About this book</button></div>' +
        "</div></article>";
    }).join("") : '<div class="empty"><h3>New books are on the way</h3><p>Leave your email in the contact form and I\'ll let you know when they\'re out.</p></div>';
  }
  // Price shown on hand-written buy buttons (hero, /unstuck page).
  var firstBook = (S.books || [])[0];
  if (firstBook && firstBook.price) {
    document.querySelectorAll(".js-price").forEach(function (el) { el.textContent = firstBook.price; });
  }

  /* ---------- Events ---------- */
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  function parseDate(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var events = (S.events || [])
    .map(function (e, i) { e._i = i; e._d = parseDate(e.date); return e; })
    .filter(function (e) { return !isNaN(e._d) && e._d >= today; })
    .sort(function (a, b) { return a._d - b._d; });

  var pin = '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
  var clock = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  var tag = '<svg viewBox="0 0 24 24"><path d="M3 12V4h8l10 10-8 8L3 12Z"/><circle cx="7.5" cy="8.5" r="1.5"/></svg>';

  function registerBtn(e, big) {
    var cls = "btn btn-primary" + (big ? "" : " btn-sm");
    if (isUrl(e.registerUrl)) return extLink(e.registerUrl, "Save my seat", cls);
    return '<a href="#contact" class="' + cls + ' js-interest" data-interest="An event" data-event="' + esc(e.title) + '">Save my seat</a>';
  }
  var eventList = $("#eventList");
  if (eventList) {
    eventList.innerHTML = events.length ? events.map(function (e) {
      return '<article class="event reveal">' +
        '<div class="event-date"><span class="m">' + MONTHS[e._d.getMonth()] + '</span><span class="d">' + e._d.getDate() + '</span><span class="w">' + DAYS[e._d.getDay()] + "</span></div>" +
        "<div><h3>" + esc(e.title) + "</h3>" +
          '<div class="event-info">' +
            (e.time ? "<span>" + clock + esc(e.time) + "</span>" : "") +
            (e.location ? "<span>" + pin + esc(e.location) + "</span>" : "") +
            (e.price ? "<span>" + tag + esc(e.price) + "</span>" : "") +
          "</div><p>" + esc(e.summary) + "</p></div>" +
        '<div class="card-actions">' + registerBtn(e) +
          '<button class="btn-text" data-event-i="' + e._i + '">Event details</button></div>' +
      "</article>";
    }).join("") : '<div class="empty"><h3>No events on the calendar right now</h3><p>New dates are added often. <a href="#contact" class="js-interest" data-interest="An event">Ask to hear about the next one</a>.</p></div>';
  }
  // Pre-fill message when "Save my seat" falls back to the form
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-event]");
    if (!a) return;
    var m = $("#f-msg");
    if (m && !m.value) m.value = "I'd like to save a seat for: " + a.getAttribute("data-event");
  });

  /* ---------- Modal ---------- */
  var modal = $("#modal"), body = $("#modalBody"), lastFocus = null;
  function openModal(html) {
    if (!modal) return;
    lastFocus = document.activeElement;
    body.innerHTML = html;
    wireSchedule(body);
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    document.documentElement.style.overflow = "hidden";
    var c = $(".modal-close", modal); if (c) c.focus();
  }
  function closeModal() {
    if (!modal || !modal.open) return;
    if (typeof modal.close === "function") modal.close(); else modal.removeAttribute("open");
  }
  if (modal) {
    modal.addEventListener("close", function () {
      document.documentElement.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-close]")) closeModal();
    });
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-modal]");
    if (t) {
      var tpl = document.getElementById(t.getAttribute("data-modal"));
      if (tpl) openModal(tpl.innerHTML);
      return;
    }
    var bk = e.target.closest("[data-book]");
    if (bk) {
      var b = (S.books || [])[+bk.getAttribute("data-book")];
      if (!b) return;
      openModal(
        '<div class="modal-book"><div class="book-cover">' + coverHTML(b) + "</div><div>" +
          (b.format ? '<p class="book-meta">' + esc(b.format) + "</p>" : "") +
          '<h2 id="modal-title">' + esc(b.title) + "</h2>" +
          (b.subtitle ? '<p class="book-sub">' + esc(b.subtitle) + "</p>" : "") +
        "</div></div>" +
        (b.details || [b.blurb]).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
        '<div class="modal-actions">' + buyButtons(b, true) + "</div>"
      );
      return;
    }
    var ev = e.target.closest("[data-event-i]");
    if (ev) {
      var x = (S.events || [])[+ev.getAttribute("data-event-i")];
      if (!x) return;
      var d = parseDate(x.date);
      openModal(
        '<p class="eyebrow">Event</p><h2 id="modal-title">' + esc(x.title) + "</h2>" +
        '<dl class="modal-facts">' +
          "<div><dt>Date</dt><dd>" + d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }) + "</dd></div>" +
          (x.time ? "<div><dt>Time</dt><dd>" + esc(x.time) + "</dd></div>" : "") +
          (x.location ? "<div><dt>Where</dt><dd>" + esc(x.location) + "</dd></div>" : "") +
          (x.price ? "<div><dt>Cost</dt><dd>" + esc(x.price) + "</dd></div>" : "") +
        "</dl>" +
        (x.details || [x.summary]).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
        '<div class="modal-actions">' + registerBtn(x, true) + "</div>"
      );
    }
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = $("#menuBtn"), nav = $("#nav");
  function setMenu(open) {
    if (!menuBtn) return;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("open", open);
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- Header shadow, mobile bar, active nav ---------- */
  var header = $(".header"), bar = $(".mobile-bar"), hero = $(".hero");
  function onScroll() {
    var yy = window.scrollY;
    if (header) header.classList.toggle("scrolled", yy > 8);
    if (bar && hero) bar.classList.toggle("show", yy > hero.offsetHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  if ("IntersectionObserver" in window) {
    var links = $$(".nav a");
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { spy.observe(s); });

    $$(".offer, .head, .statement p").forEach(function (el) { el.classList.add("reveal"); });
    var rv = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); rv.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (el) { rv.observe(el); });
  }

  /* ---------- Contact form (Cloudflare Pages Function at /api/contact) ---------- */
  var form = $("form.form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = $("button[type=submit]", form), old = btn.textContent;
      btn.textContent = "Sending…"; btn.disabled = true;
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.ok === false) throw new Error(j.error || "Send failed"); }); })
        .then(function () {
          form.innerHTML = '<div class="empty" style="border:0"><h3>Thank you. Your note is on its way.</h3><p>I\'ll get back to you within one business day.</p></div>';
        })
        .catch(function () {
          btn.textContent = old; btn.disabled = false;
          var msg = $(".form-error", form);
          if (!msg) { msg = document.createElement("p"); msg.className = "form-error soon"; form.appendChild(msg); }
          msg.innerHTML = "That didn't go through. Please try again, or email " +
            (S.email ? '<a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a>" : "me directly") + ".";
        });
    });
  }
})();
