# PANDA - KI-Erkennungstool für Polizeibehörden

Ein modernes Web-Tool zur Unterstützung von Polizeibeamten bei der Erkennung KI-generierter Inhalte und rechtlichen Einordnung.

## Features

- Modernes Design
- Vollständig responsive
- Interaktiver Entscheidungsbaum
- Tipps zur Erkennung von KI-generierten Inhalten
- Automatische rechtliche Einordnung nach StGB

## Inhaltstypen

Das Tool unterstützt die Bewertung von:
- E-Mails
- Bildern/Videos
- Audioinhalten

## Projektstruktur

```
PANDA/
├── index.html              # Haupt-HTML-Datei
├── styles/
│   ├── main.css           # Haupt-Styling
│   ├── components.css     # Button- und Komponenten-Styles
│   └── animations.css     # Animationen
├── js/
│   ├── app.js            # Haupt-App-Logik
│   ├── state.js          # State-Management
│   ├── navigation.js     # Navigation-Controller
│   ├── logic.js          # Entscheidungslogik
│   └── screens/
│       ├── startScreen.js
│       ├── contentTypeScreen.js
│       ├── aiCheckScreen.js
│       ├── emailContentScreen.js
│       ├── pornographicCheckScreen.js
│       ├── childrenCheckScreen.js
│       ├── audioTypeScreen.js
│       ├── moneyPaidScreen.js
│       └── resultScreen.js
└── assets/
    └── panda-logo.png  
```

## Logo

Selbst designt.

## Browser-Kompatibilität

- Chrome/Edge (empfohlen)
- Firefox
- Safari
- Mobile Browser

## Technologien

- JavaScript
- CSS3 mit Animationen
- Responsive Design

## Nutzung

1. Klicken Sie auf "Start"
2. Wählen Sie den Inhaltstyp
3. Beantworten Sie die Fragen
4. Erhalten Sie die rechtliche Einordnung

### Navigation
- **Zurück-Button**: Auf jedem Fragebogen-Screen, um zur vorherigen Frage zurückzukehren
- **Logo-Klick**: Klick auf das Logo im Header kehrt zum Start zurück 

## Entscheidungspfade und Ergebnisse

### 📧 E-Mail

#### Mit KI generiert = JA
**Pfad 1: Bedrohung**
- E-Mail → KI: Ja → Inhalt: Bedrohung
- **Ergebnis:** § 241 StGB - Bedrohung

**Pfad 2: Erpressung**
- E-Mail → KI: Ja → Inhalt: Erpressung → Geld bezahlt: Ja
- **Ergebnis:** § 253 StGB - Erpressung, § 263 StGB - Betrug (vollendet)

- E-Mail → KI: Ja → Inhalt: Erpressung → Geld bezahlt: Nein
- **Ergebnis:** § 253 StGB - Erpressung, § 263 StGB - Betrug (Versuch)

**Pfad 3: Phishing-Link**
- E-Mail → KI: Ja → Inhalt: Link (Phishing)
- **Ergebnis:** § 263a StGB - Computerbetrug, § 202a StGB - Ausspähen von Daten

#### Ohne KI generiert = NEIN
**Pfad 4: Bedrohung (nicht KI)**
- E-Mail → KI: Nein → Inhalt: Bedrohung
- **Ergebnis:** § 241 StGB - Bedrohung

**Pfad 5: Erpressung (nicht KI)**
- E-Mail → KI: Nein → Inhalt: Erpressung → Geld bezahlt: Ja
- **Ergebnis:** § 253 StGB - Erpressung, § 263 StGB - Betrug (vollendet)

- E-Mail → KI: Nein → Inhalt: Erpressung → Geld bezahlt: Nein
- **Ergebnis:** § 253 StGB - Erpressung

**Pfad 6: Phishing-Link (nicht KI)**
- E-Mail → KI: Nein → Inhalt: Link (Phishing)
- **Ergebnis:** § 263a StGB - Computerbetrug, § 202a StGB - Ausspähen von Daten

---

### 🖼️ Bilder / Videos

#### Mit KI generiert = JA

**Pfad 7: Kinderpornografische Inhalte**
- Bilder/Videos → KI: Ja → Pornografisch: Ja → Kinder: Ja
- **Ergebnis:** § 184b StGB - Verbreitung kinderpornografischer Inhalte

**Pfad 8: Pornografische Inhalte mit sichtbarer Person**
- Bilder/Videos → KI: Ja → Pornografisch: Ja → Kinder: Nein → Person sichtbar: Ja
- **Ergebnis:** § 184 StGB - Verbreitung pornografischer Inhalte, § 201a StGB - Verletzung des höchstpersönlichen Lebensbereichs, § 33 KUG - Recht am eigenen Bild

**Pfad 9: Pornografische Inhalte ohne sichtbare Person**
- Bilder/Videos → KI: Ja → Pornografisch: Ja → Kinder: Nein → Person sichtbar: Nein
- **Ergebnis:** § 184 StGB - Verbreitung pornografischer Inhalte

**Pfad 10: Nicht-pornografische Inhalte mit sichtbarer Person**
- Bilder/Videos → KI: Ja → Pornografisch: Nein → Person sichtbar: Ja
- **Ergebnis:** § 201a StGB - Verletzung des höchstpersönlichen Lebensbereichs, § 33 KUG - Recht am eigenen Bild

**Pfad 11: Nicht-pornografische Inhalte ohne sichtbare Person**
- Bilder/Videos → KI: Ja → Pornografisch: Nein → Person sichtbar: Nein
- **Ergebnis:** § 201a StGB - Verletzung des höchstpersönlichen Lebensbereichs

#### Ohne KI generiert = NEIN

**Pfad 12: Kinderpornografische Inhalte (nicht KI)**
- Bilder/Videos → KI: Nein → Pornografisch: Ja → Kinder: Ja
- **Ergebnis:** § 184b StGB - Verbreitung kinderpornografischer Inhalte

**Pfad 13: Pornografische Inhalte mit sichtbarer Person (nicht KI)**
- Bilder/Videos → KI: Nein → Pornografisch: Ja → Kinder: Nein → Person sichtbar: Ja
- **Ergebnis:** § 184 StGB - Verbreitung pornografischer Inhalte, § 201a StGB - Verletzung des höchstpersönlichen Lebensbereichs, § 33 KUG - Recht am eigenen Bild

**Pfad 14: Pornografische Inhalte ohne sichtbare Person (nicht KI)**
- Bilder/Videos → KI: Nein → Pornografisch: Ja → Kinder: Nein → Person sichtbar: Nein
- **Ergebnis:** § 184 StGB - Verbreitung pornografischer Inhalte

**Pfad 15: Nicht-pornografische Inhalte mit sichtbarer Person (nicht KI)**
- Bilder/Videos → KI: Nein → Pornografisch: Nein → Person sichtbar: Ja
- **Ergebnis:** § 201a StGB - Verletzung des höchstpersönlichen Lebensbereichs, § 33 KUG - Recht am eigenen Bild

**Pfad 16: Nicht-pornografische Inhalte ohne sichtbare Person (nicht KI)**
- Bilder/Videos → KI: Nein → Pornografisch: Nein → Person sichtbar: Nein
- **Ergebnis:** § 201a StGB - Verletzung des höchstpersönlichen Lebensbereichs

---

### 🎙️ Ton / Audio

#### Mit KI generiert = JA

**Pfad 17: Falscher Polizeibeamter mit Schaden**
- Ton → KI: Ja → Phänomen: Falscher PVB → Geld bezahlt: Ja
- **Ergebnis:** § 132 StGB - Amtsanmaßung, § 263 StGB - Betrug (vollendet)

**Pfad 18: Falscher Polizeibeamter ohne Schaden**
- Ton → KI: Ja → Phänomen: Falscher PVB → Geld bezahlt: Nein
- **Ergebnis:** § 132 StGB - Amtsanmaßung, § 263 StGB - Betrug (Versuch)

**Pfad 19: Enkeltrick mit Schaden**
- Ton → KI: Ja → Phänomen: Enkeltrick/Schockanruf → Geld bezahlt: Ja
- **Ergebnis:** § 263 StGB - Betrug (vollendet), § 253 StGB - Erpressung

**Pfad 20: Enkeltrick ohne Schaden**
- Ton → KI: Ja → Phänomen: Enkeltrick/Schockanruf → Geld bezahlt: Nein
- **Ergebnis:** § 263 StGB - Betrug (Versuch), § 253 StGB - Erpressung

#### Ohne KI generiert = NEIN

**Pfad 21: Echte Tonaufnahmen (nicht KI)**
- Ton → KI: Nein
- **Ergebnis:** § 201 StGB - Verletzung der Vertraulichkeit des Wortes, § 263 StGB - Betrug

---

### ❓ Nicht sicher

**Was passiert bei "Nicht sicher"?**
- Nicht sicher
- **Ergebnis:** Hilfe-Screen mit Erklärungen und Beispielen für jede Kategorie:
  - **E-Mail**: Bei E-Mail-Nachrichten, Phishing-Verdacht, Bedrohungen per E-Mail
    - *Beispiele: Erpresser-Mails, Fake-Rechnungen, Phishing-Links*
  - **Bilder/Videos**: Bei Foto-/Videomaterial, Deepfake-Verdacht, manipulierten Bildern
    - *Beispiele: Manipulierte Fotos, KI-generierte Gesichter, Deepfake-Videos*
  - **Ton**: Bei Audiodateien, Voice-Cloning-Verdacht, gefälschten Anrufen
    - *Beispiele: Enkeltrick mit geklonter Stimme, falscher Polizeibeamter*
  
Nach der Hilfe kann zur Inhaltsauswahl zurückgekehrt werden.

## Rechtliche Hinweise

Dieses Tool dient als Unterstützung und ersetzt keine rechtliche Beratung oder detaillierte Prüfung durch Experten. Die angezeigten Straftatbestände sind Hinweise auf möglicherweise relevante Normen und bedürfen einer individuellen juristischen Bewertung im Einzelfall.

## Lizenz

Für den internen Gebrauch in Polizeibehörden.
