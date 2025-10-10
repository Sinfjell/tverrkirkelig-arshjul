# 🗓️ Tverrkirkelig Årshjul

Et statisk årshjul for oppgavehåndtering med automatisk årlig reset og delt sjekkboks-lagring.

## ✨ Funksjoner

- **🗓️ Årshjul-logikk**: Automatisk reset 1. januar hvert år
- **📋 Sjekkbokser**: Delt på tvers av alle brukere via Firebase
- **⚠️ Over fristen**: Automatisk seksjon for forsinkede oppgaver
- **🎯 Rollefiltrering**: Styret, Admin, Lokallag, Alle
- **📱 Responsivt design**: Fungerer på alle enheter
- **🔄 Smart sortering**: Forsinkede oppgaver øverst
- **📄 SOP-lenker**: Direktelenker til Standard Operating Procedures

## 🚀 Deployment

### Kinsta (Anbefalt)
1. Connect GitHub repository: `Sinfjell/tverrkirkelig-arshjul`
2. **Root directory**: `/` (tom)
3. **Build command**: `None`
4. **Publish directory**: `/` (tom)
5. **Index file**: `index.html`
6. **Error file**: `404.html`

### Plesk
1. **Git Deployment**: Legg til repository URL
2. **Document Root**: `/httpdocs`
3. **Automatic deployment**: Aktiver

### Andre plattformer
- **Netlify**: Drag & drop `index.html`
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Enable Pages i repository settings

## 🔥 Firebase Setup

1. **Opprett Firebase-prosjekt**: https://console.firebase.google.com
2. **Aktiver Firestore Database** i test mode
3. **Kopier konfigurasjon** til `index.html` (linje 50-57)
4. **Test**: Åpne siden og sjekk Developer Console

## 📁 Prosjektstruktur

```
├── index.html          # Hovedside
├── styles.css          # Styling
├── script.js           # JavaScript logikk
├── 404.html            # Error page
├── data/
│   └── tasks.json      # Oppgavedata
└── README.md           # Denne filen
```

## 🛠️ Utvikling

### Lokal testing
```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server

# Åpne: http://localhost:8000
```

### Endre oppgaver
Rediger `data/tasks.json`:
```json
{
  "id": "unique-id",
  "taskName": "Oppgavenavn",
  "role": "Styret|Admin|Lokallag",
  "month": 1-12,
  "monthName": "Januar",
  "tags": ["Tag1", "Tag2"],
  "sopUrl": "https://...",
  "assignees": ["Navn 1", "Navn 2"],
  "dueDate": "YYYY-MM-DD"
}
```

## 🔄 Årshjul-logikk

### Automatisk reset 1. januar
- Alle oppgaver blir "unchecked"
- Frist flyttes tilbake til inneværende år
- Fresh start for det nye året

### Smart frist-håndtering
- **Ferdigstilt oppgave**: Frist flyttes til neste år
- **Avhakt oppgave**: Frist flyttes til inneværende år
- **Over fristen**: Viser forsinkede oppgaver øverst

### UI-enkelhet
- Ingen år vises (kun måned og dato)
- Årshjul-logikk håndteres automatisk
- Fokus på det som er relevant

## 🎨 Branding

- **Farger**: Fra tverrkirkelig.no
- **Logo**: Offisiell Tverrkirkelig logo
- **Font**: System fonts for optimal ytelse

## 📊 Ytelse

- **Størrelse**: < 100 KB total
- **Loading**: < 1 sekund
- **Offline**: Fungerer med cached filer
- **Mobile**: Optimalisert for alle enheter

## 🔧 Vedlikehold

### Oppdatere oppgaver
```bash
# Rediger tasks.json
vim data/tasks.json

# Commit og deploy
git add data/tasks.json
git commit -m "Oppdatert oppgaver"
git push origin main
```

### Firebase vedlikehold
- **Gratis tier**: 50K reads, 20K writes per dag
- **Backup**: Automatisk i Firebase
- **Monitoring**: Firebase Console

## 🆘 Support

- **GitHub Issues**: https://github.com/Sinfjell/tverrkirkelig-arshjul/issues
- **Firebase Console**: https://console.firebase.google.com
- **Tverrkirkelig**: Kontakt IT-ansvarlig

---

**🎉 Et robust årshjul som fungerer år etter år!**