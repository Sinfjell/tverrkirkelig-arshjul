#!/bin/bash
# Script for å sette opp GitHub repository for Årshjul

echo "🚀 Setter opp GitHub repository for Årshjul"
echo ""
echo "Følg disse stegene:"
echo ""
echo "1️⃣  Gå til: https://github.com/new"
echo "2️⃣  Repository navn: arshjul-tverrkirkelig"
echo "3️⃣  Beskrivelse: Årshjul for Tverrkirkelig - oppgaveoversikt organisert etter måned"
echo "4️⃣  Velg Public (for GitHub Pages gratis hosting)"
echo "5️⃣  IKKE initialiser med README (du har allerede filer)"
echo "6️⃣  Klikk 'Create repository'"
echo ""
echo "Når repository er opprettet, kopier HTTPS URL-en (f.eks. https://github.com/brukernavn/arshjul-tverrkirkelig.git)"
echo ""
read -p "Lim inn repository URL her: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Ingen URL oppgitt. Avbryter."
    exit 1
fi

echo ""
echo "📤 Setter opp remote og pusher til GitHub..."
git remote add origin "$REPO_URL"
git branch -M main
git push -u origin main

echo ""
echo "✅ Ferdig! Repository er satt opp og koden er pushet!"
echo ""
echo "🌐 For å sette opp GitHub Pages:"
echo "   1. Gå til repository → Settings → Pages"
echo "   2. Source: Deploy from branch → main → / (root)"
echo "   3. Klikk Save"
echo "   4. Vent 1-2 minutter"
echo "   5. Siden vil være live på: https://BRUKERNAVN.github.io/arshjul-tverrkirkelig/"
echo ""
echo "🔗 For custom domain (arshjul.tverrkirkelig.no):"
echo "   1. I Pages settings, legg til: arshjul.tverrkirkelig.no"
echo "   2. Gå til DNS-leverandør og legg til CNAME record:"
echo "      Type: CNAME"
echo "      Name: arshjul"
echo "      Value: BRUKERNAVN.github.io"
echo ""

