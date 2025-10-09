# Deployment Guide - Årshjul Tverrkirkelig

## 📋 Forutsetninger

- Tilgang til DNS-innstillinger for `tverrkirkelig.no`
- En webserver eller hosting-tjeneste
- Filene fra dette prosjektet

## 🚀 Deployment til arshjul.tverrkirkelig.no

### Alternativ 1: GitHub Pages med Custom Domain

1. **Opprett GitHub Repository**
   ```bash
   cd /Users/sinfjell/Downloads/arshjul-tverr
   git init
   git add .
   git commit -m "Initial commit: Årshjul static site"
   ```

2. **Push til GitHub**
   ```bash
   # Opprett et nytt repository på github.com først
   git remote add origin https://github.com/BRUKERNAVN/arshjul-tverrkirkelig.git
   git branch -M main
   git push -u origin main
   ```

3. **Aktiver GitHub Pages**
   - Gå til repository settings
   - Scroll ned til "Pages"
   - Velg "main" branch som kilde
   - Klikk "Save"

4. **Konfigurer Custom Domain**
   - I GitHub Pages settings, legg til: `arshjul.tverrkirkelig.no`
   - Opprett en `CNAME` fil i prosjektet:
     ```bash
     echo "arshjul.tverrkirkelig.no" > CNAME
     git add CNAME
     git commit -m "Add CNAME for custom domain"
     git push
     ```

5. **Oppdater DNS**
   - Logg inn på DNS-leverandøren for `tverrkirkelig.no`
   - Legg til en CNAME record:
     ```
     Type: CNAME
     Name: arshjul
     Value: BRUKERNAVN.github.io
     TTL: 3600 (eller standard)
     ```
   - Vent 5-30 minutter på DNS-propagering

### Alternativ 2: Netlify (Anbefalt - enklest)

1. **Installer Netlify CLI** (valgfritt)
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy via Drag & Drop**
   - Gå til https://app.netlify.com
   - Dra mappen `/Users/sinfjell/Downloads/arshjul-tverr` til Netlify
   - Netlify vil automatisk deploye siden

3. **Eller deploy via CLI**
   ```bash
   cd /Users/sinfjell/Downloads/arshjul-tverr
   netlify deploy --prod
   ```

4. **Konfigurer Custom Domain**
   - I Netlify dashboard: Site settings → Domain management
   - Klikk "Add custom domain"
   - Skriv inn: `arshjul.tverrkirkelig.no`
   - Følg instruksjonene for DNS-oppsett

5. **Oppdater DNS**
   - Legg til CNAME record hos DNS-leverandør:
     ```
     Type: CNAME
     Name: arshjul
     Value: [site-name].netlify.app
     ```

### Alternativ 3: Tradisjonell Webserver

1. **Kopier filer til server**
   ```bash
   scp -r /Users/sinfjell/Downloads/arshjul-tverr/* user@server:/var/www/arshjul
   ```

2. **Konfigurer webserver (Nginx eksempel)**
   ```nginx
   server {
       listen 80;
       server_name arshjul.tverrkirkelig.no;
       root /var/www/arshjul;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Enable gzip
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   }
   ```

3. **Oppdater DNS**
   - Legg til A record eller CNAME:
     ```
     Type: CNAME (eller A hvis du bruker IP)
     Name: arshjul
     Value: server.tverrkirkelig.no (eller IP-adresse)
     ```

4. **Aktiver SSL (anbefalt)**
   ```bash
   sudo certbot --nginx -d arshjul.tverrkirkelig.no
   ```

### Alternativ 4: Vercel

1. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd /Users/sinfjell/Downloads/arshjul-tverr
   vercel --prod
   ```

3. **Konfigurer Custom Domain**
   - I Vercel dashboard: Settings → Domains
   - Legg til: `arshjul.tverrkirkelig.no`
   - Følg DNS-instruksjonene

## 🔒 SSL/HTTPS

Alle de anbefalte løsningene over støtter automatisk SSL:
- GitHub Pages: Automatisk SSL via Let's Encrypt
- Netlify: Automatisk SSL
- Vercel: Automatisk SSL
- Tradisjonell server: Bruk Certbot (se ovenfor)

## 📊 Estimert tid

- **GitHub Pages**: 15-20 minutter
- **Netlify**: 5-10 minutter (raskest!)
- **Vercel**: 10-15 minutter
- **Tradisjonell server**: 30-60 minutter

## ✅ Verifisering

Etter deployment, sjekk at:
1. Siden lastes på `https://arshjul.tverrkirkelig.no`
2. Alle oppgaver vises korrekt
3. Filtrering fungerer
4. Siden er responsiv på mobil
5. SOP-lenker fungerer
6. SSL-sertifikat er aktivt (grønn hengelås i nettleser)

## 🔄 Oppdateringer

### For GitHub Pages/Netlify/Vercel
```bash
# Gjør endringer i filene
git add .
git commit -m "Beskrivelse av endringer"
git push
# Automatisk re-deployment!
```

### For tradisjonell server
```bash
scp -r /Users/sinfjell/Downloads/arshjul-tverr/* user@server:/var/www/arshjul
```

## 🆘 Feilsøking

### DNS propagerer ikke
- Vent 24-48 timer (sjelden nødvendig, vanligvis 5-30 min)
- Sjekk DNS med: `nslookup arshjul.tverrkirkelig.no`
- Tøm DNS-cache: `sudo dscacheutil -flushcache` (macOS)

### 404 Error
- Sjekk at `index.html` er i rotmappen
- Verifiser webserver-konfigurasjon

### JSON laster ikke
- Åpne browser developer tools (F12)
- Sjekk Console for feilmeldinger
- Verifiser at `data/tasks.json` finnes og er gyldig

### CORS-feil (lokalt)
- Bruk en lokal webserver (ikke bare åpne `index.html`)
- Kjør: `python3 -m http.server 8000`

## 📞 Support

For spørsmål om deployment, kontakt IT-ansvarlig i Tverrkirkelig.

