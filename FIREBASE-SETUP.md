# 🔥 Firebase Firestore Setup Guide

## 🚀 Trinn-for-trinn oppsett (15 minutter)

### 1. Opprett Firebase-prosjekt

1. **Gå til Firebase Console:**
   - Åpne: https://console.firebase.google.com
   - Logg inn med Google-konto

2. **Opprett nytt prosjekt:**
   - Klikk "Add project" eller "Legg til prosjekt"
   - Navn: `tverrkirkelig-arshjul` (eller valgfritt)
   - Aktiver Google Analytics (valgfritt)
   - Klikk "Create project"

### 2. Aktiver Firestore Database

1. **I Firebase Console:**
   - Velg ditt prosjekt
   - I venstre meny: "Firestore Database"
   - Klikk "Create database"

2. **Velg sikkerhetsregler:**
   - Velg "Start in test mode" (for enkel testing)
   - Velg nærmeste region (europe-west1 for Norge)
   - Klikk "Done"

### 3. Få Firebase-konfigurasjon

1. **I Firebase Console:**
   - Gå til Project Settings (⚙️ ikon)
   - Scroll ned til "Your apps"
   - Klikk "Web" ikon (`</>`)

2. **Registrer app:**
   - App nickname: `arshjul-web`
   - Ikke huk av "Firebase Hosting"
   - Klikk "Register app"

3. **Kopier konfigurasjon:**
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "tverrkirkelig-arshjul.firebaseapp.com",
     projectId: "tverrkirkelig-arshjul",
     storageBucket: "tverrkirkelig-arshjul.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123def456"
   };
   ```

### 4. Oppdater koden

1. **Åpne `index.html`:**
   - Finn Firebase-konfigurasjonen (linje 50-57)
   - Erstatt placeholder-verdiene med dine ekte verdier:

   ```javascript
   const firebaseConfig = {
       apiKey: "AIzaSyC...", // Din API-nøkkel
       authDomain: "tverrkirkelig-arshjul.firebaseapp.com", // Ditt auth domain
       projectId: "tverrkirkelig-arshjul", // Ditt project ID
       storageBucket: "tverrkirkelig-arshjul.appspot.com", // Ditt storage bucket
       messagingSenderId: "123456789", // Din sender ID
       appId: "1:123456789:web:abc123def456" // Din app ID
   };
   ```

### 5. Test lokalt

1. **Start lokal server:**
   ```bash
   cd /Users/sinfjell/Downloads/arshjul-tverr
   python3 -m http.server 8001
   ```

2. **Åpne i nettleser:**
   - Gå til: http://localhost:8001
   - Åpne Developer Tools (F12)
   - Gå til Console-fanen
   - Du skal se: "Loaded completed tasks from Firebase: 0"

3. **Test sjekkbokser:**
   - Kryss av en oppgave
   - Du skal se: "Saved completed tasks to Firebase: 1"
   - Åpne nytt nettleservindu → status er synkronisert!

## 🔒 Sikkerhetsregler (valgfritt)

For produksjon, oppdater Firestore-reglene:

1. **I Firebase Console:**
   - Firestore Database → Rules

2. **Erstatt med:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /taskStatus/{taskId} {
         allow read, write: if true; // Åpen for alle (enkel løsning)
       }
     }
   }
   ```

## 🎯 Hvordan det fungerer

### **Database-struktur:**
```
Firestore/
└── taskStatus/
    ├── 2w9vrh3/
    │   ├── completed: true
    │   ├── lastUpdated: timestamp
    │   └── taskId: "2w9vrh3"
    ├── 2xhx29v/
    │   ├── completed: false
    │   ├── lastUpdated: timestamp
    │   └── taskId: "2xhx29v"
    └── ...
```

### **Real-time synkronisering:**
- ✅ En bruker sjekker av → lagres til Firebase
- ✅ Alle andre brukere ser endringen umiddelbart
- ✅ Ingen refresh nødvendig
- ✅ Fallback til localStorage hvis Firebase ikke er tilgjengelig

## 🚨 Feilsøking

### **"Firebase not initialized"**
- Sjekk at konfigurasjonen er riktig i `index.html`
- Sjekk at alle verdier er kopiert korrekt

### **"Permission denied"**
- Sjekk Firestore-reglene (skal være åpne for testing)
- Sjekk at Firestore er aktivert i Firebase Console

### **Ingen data synkronisering**
- Åpne Developer Tools (F12) → Console
- Se etter feilmeldinger
- Sjekk Network-fanen for Firebase-forespørsler

## 💰 Kostnad

- **Gratis tier:** 50,000 reads, 20,000 writes per dag
- **Din bruk:** ~100 reads/writes per dag
- **Kostnad:** Gratis for lang tid fremover!

## 🚀 Deployment

Når Firebase er satt opp:
1. Deploy til Netlify/GitHub Pages som vanlig
2. Firebase fungerer automatisk på alle domener
3. Ingen ekstra konfigurasjon nødvendig

---

**🎉 Gratulerer! Du har nå delt sjekkboks-lagring på tvers av alle brukere!**
