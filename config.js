// ============================================================
//  HIER ANPASSEN – alle Angaben zur Veranstaltung
//  Wichtig: Die Film-IDs müssen mit FILME in Code.gs übereinstimmen.
// ============================================================
window.EVENT = {
  // URL der Google-Apps-Script-Web-App (siehe ANLEITUNG.md, Schritt 3).
  // Leer lassen = Demo-Modus: Daten bleiben nur in diesem Browser, Einlass-PIN: 1234
  scriptUrl: "https://script.google.com/macros/s/AKfycbySrcUxK2vnpWBA6eLHm6AD7yPBM3pOBDrVPa8RESSFDCaD6oC5kx9gBfM2BMYLflHH/exec",

  name: "Offscreen",
  tagline: "", // Slogan, leer = keiner
  intro:
    "Am 3. Juni 2027 verwandeln wir den Skatepark auf dem Campus in ein Open-Air-Kino. Lounge, Foodtruck und ein Film, den ihr selbst wählt.",
  veranstalter: "Veranstaltungskaufleute der Robert-Schuman-Schule · Klasse W2VA2T",
  datum: "Donnerstag, 3. Juni 2027",
  datumKurz: "03.06.2027",
  ort: "Campus-Gelände, Skatepark",
  einlass: "19:30",
  filmstart: "20:15",
  ende: "ca. 22:00",
  countdownZiel: "2027-06-03T19:30:00+02:00", // Einlass, deutsche Sommerzeit
  kalenderDatei: "offscreen.ics",
  eintritt: "Der Eintritt ist komplett kostenlos.",

  // Filme zur Abstimmung (vorbehaltlich der Vorführrechte)
  filme: [
    { id: "projekt-x", titel: "Projekt X", genre: "Komödie", laufzeit: 88, fsk: 16, trailer: "https://www.youtube.com/watch?v=nTjK4Y4VLGs" },
    { id: "kindskoepfe", titel: "Kindsköpfe", genre: "Komödie", laufzeit: 102, fsk: 6, trailer: "https://www.youtube.com/watch?v=mPOB7j2a_Ro" },
    { id: "hangover", titel: "Hangover", genre: "Komödie", laufzeit: 100, fsk: 12, trailer: "https://www.youtube.com/watch?v=_lGl1cn9AS4" },
  ],
  // Online-Anmeldung (mit Filmwahl) ist bis zu diesem Zeitpunkt möglich. Danach nur noch Vor-Ort-Akkreditierung.
  anmeldungBis: "2027-05-19T23:59:59",
  abstimmungBis: "2027-05-19T23:59:59", // danach ist keine Filmwahl mehr möglich
  plaetzeOnline: 45, // nur zur Anzeige, die echte Grenze steht in Code.gs
  plaetzeVorOrt: 15,
  zwischenstandZeigen: false, // true = Zwischenstand auf der Startseite zeigen (braucht dann auch Code.gs-Anpassung)

  // Kontakt: leer lassen, bis E-Mail und Kanäle feststehen
  kontaktEmail: "offscreen.openair@gmail.com",
  instagram: "", // z. B. "offscreen" (ohne @)

  impressumUrl: "impressum.html",
  datenschutzUrl: "datenschutz.html",
};
