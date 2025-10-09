# Quick Start Guide - Årshjul

## 🚀 Kom i gang på 2 minutter

### Lokal testing

1. **Åpne en terminal** i prosjektmappen:
   ```bash
   cd /Users/sinfjell/Downloads/arshjul-tverr
   ```

2. **Start en lokal webserver**:
   ```bash
   # Med Python (innebygd på Mac/Linux)
   python3 -m http.server 8000
   ```

3. **Åpne nettleseren**:
   - Gå til: http://localhost:8000
   - Siden skal vise seg med alle oppgaver!

### Test funksjonalitet

✅ **Filtrering**
- Klikk på "Styret" → Ser bare Styret-oppgaver
- Klikk på "Admin" → Ser bare Admin-oppgaver
- Klikk på "Lokallag" → Ser bare Lokallag-oppgaver
- Klikk på "Alle" → Ser alle oppgaver

✅ **Organisering**
- Oppgaver er gruppert etter måned (Januar → Desember)
- "Løpende" oppgaver vises til slutt

✅ **Responsivt design**
- Gjør nettleservinduet smalt → Siden tilpasser seg
- Test på mobil for best opplevelse

## 📝 Rask redigering av oppgaver

### Legge til en ny oppgave

1. Åpne `data/tasks.json` i en teksteditor
2. Kopier en eksisterende oppgave
3. Endre verdiene:
   ```json
   {
     "id": "ny-unik-id",
     "taskName": "Min nye oppgave",
     "role": "Admin",
     "month": 3,
     "monthName": "Mars",
     "quarter": "Q1",
     "tags": ["tag1"],
     "sopUrl": "https://link.til.sop",
     "assignees": ["Navn Navnesen"],
     "dueDate": "2026-03-15"
   }
   ```
4. Lagre filen
5. Refresh nettleseren → Ny oppgave vises!

### Endre en oppgave

1. Finn oppgaven i `data/tasks.json`
2. Endre feltene du vil
3. Lagre
4. Refresh nettleseren

### Slette en oppgave

1. Finn og slett hele oppgave-objektet fra `data/tasks.json`
2. Lagre
3. Refresh nettleseren

## 🎨 Tilpasse farger

Alle farger er definert i `styles.css` under `:root`:

```css
:root {
    --color-primary: #21428c;      /* Hoved blåfarge */
    --color-secondary: #58bcea;    /* Lys blå */
    --color-accent: #75c7ac;       /* Turkis/grønn */
    /* ... osv */
}
```

Endre disse for å tilpasse fargeskjemaet.

## 🌐 Deploy til internett

**Raskeste metode (Netlify):**
1. Gå til https://app.netlify.com
2. Dra hele mappen til Netlify
3. Ferdig! Du får en URL som `https://site-name.netlify.app`

Se `DEPLOYMENT.md` for full guide til `arshjul.tverrkirkelig.no`.

## ❓ Vanlige spørsmål

**Q: Hvorfor vises ikke oppgaver?**
A: Sjekk browser console (F12) for feilmeldinger. Sjekk at `data/tasks.json` er gyldig JSON.

**Q: Kan jeg åpne index.html direkte?**
A: Ja, men noen nettlesere kan blokkere JSON-lasting pga. CORS. Bruk en lokal webserver.

**Q: Hvordan legger jeg til flere roller?**
A: Legg til nye roller i JSON, og oppdater filter-knappene i `index.html`.

**Q: Fungerer dette offline?**
A: Ja! (Bortsett fra logo som lastes fra tverrkirkelig.no)

## 📞 Hjelp

- Se `README.md` for fullstendig dokumentasjon
- Se `DEPLOYMENT.md` for deployment-instruksjoner
- Kontakt IT-support for teknisk hjelp

