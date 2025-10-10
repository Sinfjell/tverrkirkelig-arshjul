# Årshjul for Tverrkirkelig

En enkel statisk nettside som viser årshjulet for Tverrkirkelig organisert etter måned, med filtrering basert på rolle.

## 🎯 Funksjonalitet

- **Månedsorganisert visning**: Alle oppgaver er organisert etter måned (Januar-Desember + Løpende)
- **Rollefiltrering**: Filtrer oppgaver basert på hvem som skal gjøre dem:
  - Styret
  - Admin
  - Lokallag
  - Alle (ingen filter)
- **Responsivt design**: Fungerer på desktop, tablet og mobil
- **SOP-lenker**: Direktelenker til Standard Operating Procedures der det er relevant
- **Tverrkirkelig branding**: Bruker offisielle farger og logo fra tverrkirkelig.no
- **Delt sjekkboks-lagring**: Firebase Firestore for real-time synkronisering mellom brukere

## 📁 Prosjektstruktur

```
arshjul-tverr/
├── index.html          # Hovedside med struktur og Firebase SDK
├── styles.css          # Styling med Tverrkirkelig farger
├── script.js           # JavaScript for filtrering, rendering og Firebase
├── data/
│   └── tasks.json      # Oppgavedata
├── firebase-config.js  # Firebase konfigurasjon (eksempel)
├── FIREBASE-SETUP.md   # Detaljert Firebase oppsett-guide
└── README.md           # Denne filen
```

## 🎨 Fargepalett (fra tverrkirkelig.no)

- **Primær blå**: #21428c
- **Sekundær blå**: #58bcea
- **Mørk grå**: #3a3a3a
- **Grå**: #4B4F58
- **Hvit**: #ffffff
- **Lys grå**: #f9f9f9
- **Accent turkis**: #75c7ac
- **Grønn**: #60ba45

## 📝 Datastruktur

Oppgaver lagres i `data/tasks.json` med følgende struktur:

```json
{
  "id": "unique-id",
  "taskName": "Oppgavenavn",
  "role": "Styret|Admin|Lokallag",
  "month": 1-12 eller null,
  "monthName": "Månedsnavn",
  "quarter": "Q1|Q2|Q3|Q4",
  "tags": ["tag1", "tag2"],
  "sopUrl": "URL til SOP",
  "assignees": ["Navn 1", "Navn 2"],
  "dueDate": "YYYY-MM-DD"
}
```

## 🔥 Firebase Setup (Anbefalt)

For delt sjekkboks-lagring på tvers av brukere:

1. **Følg `FIREBASE-SETUP.md`** for detaljert guide
2. **Opprett Firebase-prosjekt** (gratis)
3. **Oppdater konfigurasjon** i `index.html`
4. **Test lokalt** - alle brukere ser samme sjekkboks-status!

**Uten Firebase:** Sjekkbokser lagres lokalt per bruker (localStorage fallback)

## 🚀 Deployment

### Lokal testing

1. Åpne `index.html` direkte i en nettleser
2. Eller bruk en lokal webserver:
   ```bash
   # Med Python 3
   python3 -m http.server 8001
   
   # Med Node.js (npx)
   npx http-server
   ```

### Hosting

Siden er statisk og kan hostes hvor som helst:

- **GitHub Pages**: Push til GitHub og aktiver Pages
- **Netlify**: Dra og slipp mappen til Netlify
- **Vercel**: Deploy med `vercel --prod`
- **Vanlig webserver**: Last opp alle filer til server

For subdomain `arshjul.tverrkirkelig.no`:
1. Host filene på en webserver
2. Sett opp en CNAME record i DNS som peker til serveradressen
3. Konfigurer webserveren til å svare på dette domenet

## 🔧 Vedlikehold

### Legge til nye oppgaver

1. Åpne `data/tasks.json`
2. Legg til et nytt objekt i array:
   ```json
   {
     "id": "unique-id",
     "taskName": "Ny oppgave",
     "role": "Admin",
     "month": 3,
     "monthName": "Mars",
     "quarter": "Q1",
     "tags": [],
     "sopUrl": "",
     "assignees": ["Navn"],
     "dueDate": "2026-03-15"
   }
   ```
3. Lagre filen - endringene vises automatisk

### Oppdatere eksisterende oppgaver

1. Finn oppgaven i `data/tasks.json`
2. Endre feltene du ønsker
3. Lagre filen

### Slette oppgaver

1. Finn oppgaven i `data/tasks.json`
2. Fjern hele objektet fra arrayet
3. Lagre filen

## 🌐 Nettleserstøtte

- Chrome/Edge (moderne versjoner)
- Firefox (moderne versjoner)
- Safari (moderne versjoner)
- Mobile browsers (iOS Safari, Chrome Android)

## 📄 Lisens

© 2025 Tverrkirkelig. Alle rettigheter reservert.

## 👥 Kontakt

For spørsmål eller support, kontakt Tverrkirkelig administrasjon.

