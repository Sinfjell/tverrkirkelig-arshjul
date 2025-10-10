# 🚀 Plesk Deployment Guide

## Oversikt

Denne guiden viser deg hvordan du deployerer Tverrkirkelig Årshjul på Plesk hosting.

**Ressurskrav:**
- Diskplass: < 1 MB
- Båndbredde: Minimal
- Database: Ikke nødvendig (Firebase)
- PHP/Node.js: Ikke nødvendig

---

## Metode 1: File Manager (Enklest) ⭐

### Steg 1: Forbered filene

Last ned/klon prosjektet lokalt:
```bash
git clone https://github.com/Sinfjell/tverrkirkelig-arshjul.git
cd tverrkirkelig-arshjul
```

### Steg 2: Logg inn på Plesk

1. Gå til din Plesk-panel URL
2. Logg inn med dine credentials
3. Velg domenet/subdomenet `arshjul.tverrkirkelig.no`

### Steg 3: Last opp filer

1. Klikk på **"Files"** → **"File Manager"**
2. Naviger til `httpdocs/` (eller `public_html/`)
3. Last opp følgende filer/mapper:
   ```
   index.html
   styles.css
   script.js
   data/
   ├── tasks.json
   ```
4. Sørg for at mappestrukturen er korrekt

### Steg 4: Test

Åpne: `https://arshjul.tverrkirkelig.no`

---

## Metode 2: Git Deployment (Anbefalt) 🔥

### Fordeler:
- ✅ Automatisk oppdatering ved push til GitHub
- ✅ Versjonskontroll
- ✅ Enkel rollback
- ✅ Ingen manuell fil-opplasting

### Steg 1: Aktiver Git i Plesk

1. I Plesk, velg domenet `arshjul.tverrkirkelig.no`
2. Gå til **"Git"** (under Developer Tools)
3. Klikk **"Add Repository"**

### Steg 2: Konfigurer repository

**Repository URL:**
```
https://github.com/Sinfjell/tverrkirkelig-arshjul.git
```

**Branch:** `main`

**Document Root:** `/httpdocs`

**Deploy actions:**
- Huk av for "Deploy automatically after push"

### Steg 3: Deploy

1. Klikk **"Deploy"**
2. Vent på at Plesk laster ned og installerer filene
3. Status vises i Git-panelet

### Steg 4: Test

Åpne: `https://arshjul.tverrkirkelig.no`

### Fremtidige oppdateringer:

Når du gjør endringer:
```bash
git add .
git commit -m "Oppdatering"
git push origin main
```

Plesk vil automatisk deploye endringene! 🎉

---

## Metode 3: FTP/SFTP

### Steg 1: Hent FTP-credentials fra Plesk

1. I Plesk, gå til **"FTP Access"**
2. Noter ned:
   - FTP host
   - Brukernavn
   - Passord

### Steg 2: Koble til via FTP-klient

**Anbefalt klienter:**
- FileZilla (gratis)
- Cyberduck (gratis)
- Transmit (Mac, betalt)

### Steg 3: Last opp filer

1. Naviger til `/httpdocs`
2. Dra alle filer fra prosjektmappen
3. Behold mappestrukturen

---

## SSL-konfigurasjon (Anbefalt)

### Let's Encrypt (Gratis)

1. I Plesk, velg domenet
2. Gå til **"SSL/TLS Certificates"**
3. Klikk **"Install"** under Let's Encrypt
4. Huk av:
   - ☑ Secure the domain
   - ☑ Secure www.domain
5. Klikk **"Get it free"**
6. Vent ~2 minutter

**HTTPS er nå aktivert!** 🔒

---

## Subdomain-oppsett

### Opprett subdomain

1. I Plesk, gå til **"Subdomains"**
2. Klikk **"Add Subdomain"**
3. **Subdomain name:** `arshjul`
4. **Document root:** `/httpdocs` (eller egen mappe)
5. Klikk **"OK"**

### Konfigurer DNS (hvis nødvendig)

DNS oppdateres automatisk av Plesk i de fleste tilfeller.

Hvis du bruker eksterne DNS:
```
Type: A
Name: arshjul
Value: [Din server IP]
TTL: 3600
```

---

## Feilsøking

### Problem: "404 Not Found"

**Løsning:**
- Sjekk at filene er i riktig mappe (`/httpdocs`)
- Sjekk at `index.html` finnes
- Sjekk dokumentrot-innstillinger i Plesk

### Problem: "tasks.json not found"

**Løsning:**
- Sjekk at `data/` mappen eksisterer
- Sjekk at `tasks.json` er i `data/` mappen
- Sjekk filrettigheter (skal være 644)

### Problem: Firebase fungerer ikke

**Løsning:**
- Sjekk at Firebase-konfigurasjonen er korrekt i `index.html`
- Åpne Developer Tools (F12) → Console for feilmeldinger
- Sjekk Firestore-regler i Firebase Console

### Problem: CSS/JavaScript laster ikke

**Løsning:**
- Sjekk filstier i `index.html`
- Sjekk at filene faktisk er lastet opp
- Clear browser cache (Ctrl+Shift+R)

---

## Vedlikehold

### Oppdatere oppgaver

**Via Git (anbefalt):**
```bash
# Rediger tasks.json lokalt
vim data/tasks.json

# Commit og push
git add data/tasks.json
git commit -m "Oppdatert oppgaver"
git push origin main
```

**Via File Manager:**
1. Gå til File Manager i Plesk
2. Naviger til `data/tasks.json`
3. Klikk "Edit"
4. Gjør endringer
5. Lagre

### Backup

**Automatisk backup i Plesk:**
1. Gå til **"Backup Manager"**
2. Klikk **"Back Up"**
3. Velg hva som skal backes opp
4. Sett opp automatisk backup (anbefalt)

**Manuell backup:**
```bash
# Last ned via FTP/SFTP
# Eller via Git:
git pull origin main
```

---

## Performance-tips

### Enable Gzip Compression

1. I Plesk: **"Apache & nginx Settings"**
2. Under **"Additional nginx directives"**, legg til:
```nginx
gzip on;
gzip_types text/css application/javascript application/json;
gzip_min_length 1000;
```

### Browser Caching

Legg til i samme seksjon:
```nginx
location ~* \.(css|js|json)$ {
    expires 1d;
    add_header Cache-Control "public, immutable";
}
```

---

## Sikkerhet

### Firestore-regler (Firebase Console)

For produksjon, oppdater reglene:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /taskStatus/{taskId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### .htaccess (valgfritt)

Opprett `.htaccess` i `httpdocs/`:
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Disable directory listing
Options -Indexes
```

---

## Kostnader

- **Plesk hosting:** Inkludert i eksisterende plan
- **Diskplass:** < 1 MB (neglisjerbart)
- **Båndbredde:** Minimal
- **Firebase:** Gratis tier (50K reads, 20K writes/dag)
- **SSL:** Gratis (Let's Encrypt)

**Total ekstra kostnad: 0 kr** 💰

---

## Support

**Problem med deployment?**
- Sjekk Plesk logs: Tools & Settings → Logs
- GitHub Issues: https://github.com/Sinfjell/tverrkirkelig-arshjul/issues
- Firebase Console: https://console.firebase.google.com

**Nyttige lenker:**
- Repository: https://github.com/Sinfjell/tverrkirkelig-arshjul
- Firebase Setup: Se `FIREBASE-SETUP.md`
- Lokal testing: Se `QUICKSTART.md`

---

🎉 **Gratulerer! Årshjulet er nå live på Plesk!**
