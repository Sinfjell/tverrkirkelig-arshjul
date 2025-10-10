<!-- e1f553fa-39ee-4574-b313-6416e43f7282 6c870cb6-7f13-4b79-bf0a-276716a92f41 -->
# Årshjul Static Site Setup

## 1. Datakonvertering og struktur

**Konverter CSV til JSON** (`data/tasks.json`)

- Parse CSV-filen med oppgaver
- Ekstrahere måned fra "Due Date"-feltet  
- Organisere data strukturert med: taskName, role (Hvem), month, quarter, tags, sopUrl, assignees, dueDate
- Filtrere bort test-oppgaver (f.eks. "test igjen")
- Håndtere duplikater ved å prioritere nyeste datoer

## 2. HTML-struktur

**Lag `index.html`**

- Header med logo fra tverrkirkelig.no
- Filterknapper for rolle: Alle, Styret, Admin, Lokallag
- Hovedcontainer for oppgaver organisert etter måned (Januar-Desember)
- Responsive layout

## 3. Styling

**Lag `styles.css`**

- Hente farger fra tverrkirkelig.no (inspisere nettsiden)
- Moderne, ren design
- Månedsoverskrifter
- Oppgavekort med:
  - Oppgavenavn
  - Rolle-badge (fargekodet)
  - Frist
  - Ansvarlig(e)
  - SOP-lenke (hvis tilgjengelig)
- Responsive design for mobil

## 4. JavaScript-funksjonalitet

**Lag `script.js`**

- Last inn tasks.json
- Implementer rollefiltrering:
  - Vis alle oppgaver som standard
  - Filtrer på "Styret", "Admin", "Lokallag"
  - Oppgaver uten rolle vises alltid
- Organiser oppgaver etter måned
- Dynamisk rendering av oppgavekort
- Smooth transitions ved filtrering

## 5. Prosjektstruktur

```
/Users/sinfjell/Downloads/arshjul-tverr/
├── index.html
├── styles.css
├── script.js
└── data/
    └── tasks.json
```

## Tekniske detaljer

- **Vanilla JavaScript**: Ingen build step, direkte deployment
- **Conditional logic**: JavaScript filter-funksjon basert på rolle
- **Data separation**: JSON for enkel vedlikehold
- **Static hosting**: Kan hostes direkte på GitHub Pages, Netlify, eller vanlig webserver

### To-dos

- [ ] Konverter CSV-data til strukturert JSON-fil med månedsinndeling
- [ ] Lag HTML-struktur med header, filter og oppgavecontainer
- [ ] Hente logo og farger fra tverrkirkelig.no for CSS
- [ ] Lag CSS med Tverrkirkelig branding og responsive design
- [ ] Implementer JavaScript for data loading, filtrering og rendering