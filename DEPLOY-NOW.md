# 🚀 Deploy Årshjul NÅ!

## Metode 1: Netlify CLI (Anbefalt - du har allerede CLI installert!)

### Steg 1: Login til Netlify
```bash
cd /Users/sinfjell/Downloads/arshjul-tverr
netlify login
```
Dette åpner nettleseren - logg inn med GitHub/email.

### Steg 2: Deploy!
```bash
netlify deploy --prod
```

Velg "Create & configure a new site" når du blir spurt.

Det er det! Du får en live URL umiddelbart! 🎉

### Steg 3: Sett custom domain (valgfritt)
I Netlify dashboard:
- Site settings → Domain management
- Add custom domain: `arshjul.tverrkirkelig.no`
- Følg DNS-instruksjonene

---

## Metode 2: Netlify Drag & Drop (Enda enklere!)

1. Åpne: https://app.netlify.com/drop
2. Dra denne mappen til nettleseren: `/Users/sinfjell/Downloads/arshjul-tverr`
3. Ferdig! Får umiddelbart en live URL! 🎉

---

## Metode 3: GitHub Pages

### Steg 1: Opprett GitHub repo
Gå til: https://github.com/new
- Navn: `arshjul-tverrkirkelig`
- Public
- Klikk "Create repository"

### Steg 2: Push koden
```bash
cd /Users/sinfjell/Downloads/arshjul-tverr
git remote add origin https://github.com/DIN-BRUKER/arshjul-tverrkirkelig.git
git push -u origin main
```

### Steg 3: Aktiver Pages
- Gå til repo → Settings → Pages
- Source: `main` branch
- Save

Live på: `https://DIN-BRUKER.github.io/arshjul-tverrkirkelig/`

---

## 🧪 Test lokalt først (valgfritt)

Din lokale server kjører på:
👉 **http://localhost:8001**

Åpne i nettleseren for å teste!

---

## ⚡ Hvilken metode bør jeg velge?

- **Raskest**: Netlify Drag & Drop (2 minutter)
- **Best for kontinuerlige oppdateringer**: Netlify CLI eller GitHub Pages
- **Best for team**: GitHub Pages (alle kan se koden)

Anbefaling: Start med Netlify Drag & Drop, bytt til GitHub Pages senere hvis nødvendig.

