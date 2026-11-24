// Gemeinsame Funktionen für alle Seiten. Normalerweise nichts zu ändern.
(function () {
  const E = window.EVENT;
  const DEMO = !E.scriptUrl;
  const DEMO_PIN = "1234";
  const DEMO_KEY = "demo-orc-anmeldungen";

  const ERRORS = {
    full: "Leider sind alle Plätze vergeben.",
    closed: "Die Anmeldung ist geschlossen.",
    invalid: "Bitte prüfe deine Angaben.",
    film: "Bitte wähle einen Film aus.",
    not_found: "Dieses Ticket ist nicht bekannt.",
    wrong_pin: "Die PIN ist falsch.",
    network: "Keine Verbindung zum Server. Bitte versuch es gleich noch einmal.",
  };

  const filmById = (id) => E.filme.find((f) => f.id === id);
  const votingOpen = () => !E.abstimmungBis || new Date() <= new Date(E.abstimmungBis);

  function demoRows() {
    try { return JSON.parse(localStorage.getItem(DEMO_KEY) || "[]"); } catch { return []; }
  }
  function demoSave(rows) {
    try { localStorage.setItem(DEMO_KEY, JSON.stringify(rows)); } catch {}
  }
  function newId() {
    const a = new Uint8Array(6);
    crypto.getRandomValues(a);
    return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  }
  function votes(rows) {
    const stimmen = Object.fromEntries(E.filme.map((f) => [f.id, 0]));
    rows.forEach((r) => { if (r.film in stimmen) stimmen[r.film]++; });
    return { ok: true, stimmen, gesamt: Object.values(stimmen).reduce((a, b) => a + b, 0) };
  }

  async function demoApi(action, p) {
    await new Promise((r) => setTimeout(r, 300));
    const rows = demoRows();
    const find = (id) => rows.find((r) => r.id === id);
    const pub = (r) => ({ vorname: r.vorname, nachname: r.nachname, klasse: r.klasse, film: r.film });
    switch (action) {
      case "register": {
        if (rows.some((r) => r.email.toLowerCase() === p.email.toLowerCase())) return { ok: true, resent: true };
        if (votingOpen() && !filmById(p.film)) return { ok: false, error: "film" };
        const row = { id: newId(), vorname: p.vorname, nachname: p.nachname, email: p.email, klasse: p.klasse, film: votingOpen() ? p.film : "", anmerkung: p.anmerkung || "", angemeldet: new Date().toISOString(), checkedIn: null };
        rows.push(row);
        demoSave(rows);
        return { ok: true, id: row.id };
      }
      case "ticket": {
        const r = find(p.id);
        return r ? { ok: true, ...pub(r), checkedIn: r.checkedIn } : { ok: false, error: "not_found" };
      }
      case "votes":
        return votes(rows);
      case "checkin": {
        if (p.pin !== DEMO_PIN) return { ok: false, error: "wrong_pin" };
        const r = find(p.id);
        if (!r) return { ok: false, error: "not_found" };
        if (r.checkedIn) return { ok: true, status: "already", zeit: r.checkedIn, ...pub(r) };
        r.checkedIn = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
        demoSave(rows);
        return { ok: true, status: "ok", zeit: r.checkedIn, ...pub(r) };
      }
      case "stats":
        if (p.pin !== DEMO_PIN) return { ok: false, error: "wrong_pin" };
        return { ok: true, anmeldungen: rows.length, eingecheckt: rows.filter((r) => r.checkedIn).length };
      case "list":
        if (p.pin !== DEMO_PIN) return { ok: false, error: "wrong_pin" };
        return {
          ok: true,
          teilnehmer: rows.map((r) => ({ id: r.id, vorname: r.vorname, nachname: r.nachname, email: r.email, klasse: r.klasse, film: r.film, anmerkung: r.anmerkung || "", angemeldet: r.angemeldet || null, checkedIn: r.checkedIn })),
        };
    }
    return { ok: false, error: "invalid" };
  }

  async function api(action, payload = {}) {
    if (DEMO) return demoApi(action, payload);
    try {
      // text/plain vermeidet die CORS-Vorabanfrage, die Apps Script nicht beantwortet
      const res = await fetch(E.scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action, ...payload }),
      });
      return await res.json();
    } catch {
      return { ok: false, error: "network" };
    }
  }

  function ticketUrl(id) {
    return new URL("ticket.html?id=" + encodeURIComponent(id), location.href).href;
  }

  // Liest die Ticket-Nummer aus einem gescannten QR-Code (Link oder reine Nummer)
  function parseTicketId(text) {
    let id = (text || "").trim();
    try { id = new URL(id).searchParams.get("id") || ""; } catch {}
    id = id.toUpperCase().replace(/[^A-F0-9]/g, "");
    return /^[A-F0-9]{12}$/.test(id) ? id : null;
  }

  const formatId = (id) => id.replace(/(.{4})(?=.)/g, "$1 ");

  function formatDeadline(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "long" }) + ", " + d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " Uhr";
  }

  function renderQr(el, text, size) {
    el.textContent = "";
    new QRCode(el, { text, width: size, height: size, colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
  }

  // Füllt alle Elemente mit data-event="feldname" aus der Konfiguration
  function fillEventFields(root = document) {
    root.querySelectorAll("[data-event]").forEach((el) => {
      const v = E[el.dataset.event];
      if (v) el.textContent = v;
      else if (el.dataset.hideEmpty !== undefined) el.hidden = true;
    });
    document.querySelectorAll("[data-demo]").forEach((el) => (el.hidden = !DEMO));
    document.querySelectorAll("[data-link]").forEach((el) => (el.href = E[el.dataset.link]));
  }

  // Baut die Kinokarte. t = { id, vorname, nachname, klasse, film, checkedIn }
  function renderTicket(el, t) {
    el.innerHTML = `
      <article class="ticket">
        <div class="ticket-head"><img src="assets/logo/offscreen-mark-weiss.svg" alt=""><span></span><small>Eintrittskarte</small></div>
        <div class="ticket-body">
          <div><p class="who"></p><p class="klasse"></p></div>
          <dl class="tgrid">
            <div><dt>Datum</dt><dd data-f="datumKurz"></dd></div>
            <div><dt>Einlass</dt><dd data-f="einlass"></dd></div>
            <div><dt>Filmstart</dt><dd data-f="filmstart"></dd></div>
            <div class="wide"><dt>Ort</dt><dd data-f="ort"></dd></div>
            <div><dt>Platz</dt><dd>Freie Wahl</dd></div>
            <div style="grid-column: span 2"><dt>Deine Filmstimme</dt><dd class="t-film"></dd></div>
          </dl>
        </div>
        <div class="perf" aria-hidden="true"></div>
        <div class="ticket-stub">
          <div class="qr" role="img" aria-label="QR-Code deines Tickets"></div>
          <div class="ticket-no"><small>Ticket-Nr.</small><span></span></div>
          <p class="stub-hint"></p>
        </div>
      </article>`;
    const q = (s) => el.querySelector(s);
    q(".ticket-head span").textContent = E.name;
    q(".who").textContent = [t.vorname, t.nachname].filter(Boolean).join(" ") || " ";
    q(".klasse").textContent = t.klasse ? "Klasse / Gruppe: " + t.klasse : "";
    el.querySelectorAll("[data-f]").forEach((d) => (d.textContent = E[d.dataset.f] + (/einlass|filmstart/.test(d.dataset.f) ? " Uhr" : "")));
    const f = filmById(t.film);
    q(".t-film").textContent = f ? f.titel : "–";
    q(".ticket-no span").textContent = formatId(t.id);
    q(".stub-hint").textContent = t.checkedIn
      ? "Eingecheckt um " + t.checkedIn + " Uhr. Viel Spaß beim Film!"
      : "Zeig diesen Code am Einlass vor.";
    renderQr(q(".qr"), ticketUrl(t.id), 200);
  }

  window.App = {
    E, DEMO, api, ticketUrl, parseTicketId, formatId, formatDeadline, renderQr, renderTicket, fillEventFields, filmById, votingOpen,
    errorText: (c) => ERRORS[c] || "Etwas ist schiefgelaufen. Bitte versuch es noch einmal.",
  };
})();
