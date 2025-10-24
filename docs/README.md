# Tverrkirkelig Årshjul

En statisk webapplikasjon for å administrere årlige oppgaver og viktige lenker for Tverrkirkelig.

## Mappestruktur

```
├── src/                    # Kildekode
│   ├── css/               # Stilark
│   │   └── styles.css
│   ├── js/                # JavaScript-filer
│   │   ├── script.js      # Hovedlogikk for årshjul
│   │   └── lenker.js      # Logikk for lenker-siden
│   └── pages/             # HTML-sider
│       ├── index.html     # Lenker-siden
│       ├── arshjul.html   # Årshjul-siden
│       └── 404.html       # 404-feilside
├── data/                  # Datafiler
│   └── tasks.json         # Oppgavedata
├── docs/                  # Dokumentasjon
│   ├── README.md          # Denne filen
│   └── CHANGELOG.md       # Endringslogg
├── assets/                # Statiske ressurser (reservert)
├── index.html             # Hovedside (redirecter til lenker)
├── arshjul.html           # Årshjul (redirecter til src/pages/)
├── VERSION                # Versjonsnummer
└── .htaccess              # Apache-konfigurasjon
```

## Funksjonalitet

### Lenker-siden (`/`)
- Ett-klikks tilgang til viktige ressurser
- Looker Studio rapport
- Google Docs for møtenotater
- ClickUp dashboard
- Google Sheets for budsjett

### Årshjul-siden (`/arshjul.html`)
- Månedlig organisering av oppgaver
- Rolle-basert og person-basert filtrering
- Firebase-integrasjon for synkronisering
- Fristhåndtering og forfalte oppgaver
- SOP-lenker for oppgaver
- Automatisk nullstilling ved nytt år

## Due Date Logic (Static Yearly Plan)

The system uses a static yearly plan approach for due dates:

- **Year in JSON is ignored**: Tasks use only month/day from `tasks.json`
- **Current year is used**: System always uses the current year for date comparison
- **Overdue detection**: A task is overdue if it's unchecked and the current date has passed the task's month/day this year
- **No year manipulation**: No localStorage caching or year changes - dates are calculated dynamically
- **Consistent across browsers**: All users see the same due date states since there's no local caching

## Teknisk informasjon

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Firebase Firestore
- **Hosting**: Statisk hosting med Cloudflare
- **Versjonering**: Semantic Versioning

## Utvikling

### Lokal utvikling
```bash
# Start lokal server
python3 -m http.server 3000

# Åpne i nettleser
open http://localhost:3000
```

### Versjonering
- Følger [Semantic Versioning](https://semver.org/)
- Versjoner dokumenteres i `CHANGELOG.md`
- Gjeldende versjon lagres i `VERSION`

## Deployment

Siden er en statisk webapplikasjon som kan deployes til:
- Apache/Nginx web server
- Cloudflare Pages
- GitHub Pages
- Andre statiske hosting-tjenester

## Lisens

© 2025 Tverrkirkelig. Alle rettigheter reservert.