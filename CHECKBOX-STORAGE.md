# Sjekkboks-lagring i Årshjul

## 📝 Hvordan fungerer sjekkboks-lagring?

### 🏠 **Lokal lagring (localStorage)**
- Sjekkbokser lagres i **nettleserens localStorage**
- Dette betyr at hver bruker har sin egen status
- Status overlever nettleser-restart og computer-restart
- **IKKE delt** mellom brukere

### 🔄 **Hva skjer når du sjekker av:**
1. **Du sjekker av** en oppgave → lagres i din nettleser
2. **Du refresher siden** → status er bevart
3. **Du lukker nettleseren** → status er bevart
4. **Du åpner siden igjen** → status er bevart

### 👥 **Hva skjer med andre brukere:**
- **Hver bruker ser sin egen status**
- Hvis du sjekker av en oppgave, ser andre brukere den fortsatt som usjekket
- Dette er **intensjonelt** - hver bruker har sin egen følge-opp

### 💾 **Teknisk implementering:**
```javascript
// Lagrer i nettleserens localStorage
localStorage.setItem('completedTasks', JSON.stringify([...completedTasks]));

// Laster fra localStorage ved oppstart
const saved = localStorage.getItem('completedTasks');
if (saved) {
    completedTasks = new Set(JSON.parse(saved));
}
```

### 🌐 **For delt status (fremtidig):**
Hvis dere ønsker at alle brukere skal se samme status, kan vi implementere:
- **Backend database** (f.eks. Firebase, Supabase)
- **Server-side lagring** med brukerinnlogging
- **Real-time synkronisering**

Men for nå er lokal lagring mest praktisk for individuell oppfølging.

---

## 🧪 **Test dette:**
1. Åpne siden i to forskjellige nettleservinduer
2. Sjekk av en oppgave i det ene vinduet
3. Refresh det andre vinduet
4. Oppgaven er fortsatt usjekket i det andre vinduet

Dette viser at lagring er lokal per nettleser-instans.
