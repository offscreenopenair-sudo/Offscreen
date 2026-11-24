// ============================================================
//  HIER ANPASSEN – alle Angaben zur Veranstaltung
//  Wichtig: Die Film-IDs müssen mit FILME in Code.gs übereinstimmen.
// ============================================================
window.EVENT = {
  // URL der Google-Apps-Script-Web-App (siehe ANLEITUNG.md, Schritt 3).
  // Leer lassen = Demo-Modus: Daten bleiben nur in diesem Browser, Einlass-PIN: 1234
  scriptUrl: "https://script.google.com/macros/s/AKfycbySrcUxK2vnpWBA6eLHm6AD7yPBM3pOBDrVPa8RESSFDCaD6oC5kx9gBfM2BMYLflHH/exec",

  name: "Offscreen",
  tagline: "Film ab, wenn es dunkel wird.",
  intro:
    "Am 3. Juni 2027 verwandeln wir den Skatepark auf dem Campus in ein Open-Air-Kino. Lounge, Foodtruck und ein Film, den ihr selbst wählt.",
  veranstalter: "Veranstaltungskaufleute der RSB · Klasse W2VA2T",
  datum: "Donnerstag, 3. Juni 2027",
  datumKurz: "03.06.2027",
  ort: "Campus-Gelände, Skatepark",
  einlass: "19:30",
  filmstart: "20:15",
  ende: "ca. 22:00",
  eintritt: "Der Eintritt ist komplett kostenlos.",

  // Filme zur Abstimmung (vorbehaltlich der Vorführrechte)
  filme: [
    { id: "projekt-x", titel: "Projekt X", genre: "Komödie", laufzeit: 88, fsk: 16, trailer: "https://www.youtube.com/watch?v=nTjK4Y4VLGs" },
    { id: "kindskoepfe", titel: "Kindsköpfe", genre: "Komödie", laufzeit: 102, fsk: 6, trailer: "https://www.youtube.com/watch?v=mPOB7j2a_Ro" },
    { id: "hangover", titel: "Hangover", genre: "Komödie", laufzeit: 100, fsk: 12, trailer: "https://www.youtube.com/watch?v=_lGl1cn9AS4" },
  ],
  abstimmungBis: "2027-05-27T23:59:00", // danach ist keine Filmwahl mehr möglich
  zwischenstandZeigen: true,

  // Kontakt: leer lassen, bis E-Mail und Kanäle feststehen
  kontaktEmail: "",
  instagram: "", // z. B. "offscreen" (ohne @)

  impressumUrl: "impressum.html",
  datenschutzUrl: "datenschutz.html",
};
