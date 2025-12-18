# PANDA - Polizeiliche Analyse Nichtmenschlicher Digitaler Artefakte

Ein modernes Web-Tool zur Unterstützung von Polizeibeamten bei der Erkennung KI-generierter Inhalte und rechtlichen Einordnung.

## Features

- Modernes Design 
- Vollständig responsive (Mobile & Desktop)
- Interaktiver Entscheidungsbaum
- Tipps zur Erkennung von KI-generierten Inhalten
- Automatische rechtliche Einordnung nach StGB
- Animierter Hintergrund
- eigenes Logo

## Inhaltstypen

Das Tool unterstützt die Bewertung von:
- E-Mails (Bedrohung, Erpressung/Sextortion, Phishing)
- Bildern/Videos (Pornografie, Kinderpornografie, Deepfakes)
- Audioinhalten (Falscher Polizeibeamter, Enkeltrick/Schockanruf)

## Projektstruktur

```
PANDA/
├── index.html              # HTML
├── styles/
│   ├── main.css           # Styling
│   ├── components.css     # Komponentenstyling
│   └── animations.css     # Animationen
├── js/
│   └── app-bundle.js                # Komplette gebündelte App-Logik
│       ├── AppState                 # State-Management (answers, history, progress)
│       ├── DecisionLogic            # Rechtliche Bewertung & KI-Erkennungstipps
│       ├── ScreenHelpers            # Logo Header, Back Button, Event Listeners
│       ├── NavigationController     # Screen-Wechsel mit Fade-Animationen
│       └── Screens:
│           ├── StartScreen
│           ├── ContentTypeScreen
│           ├── AICheckScreen
│           ├── UnsureHelpScreen
│           ├── EmailContentScreen
│           ├── PornographicCheckScreen
│           ├── ChildrenCheckScreen
│           ├── VictimVisibleCheckScreen
│           ├── AudioTypeScreen
│           ├── MoneyPaidScreen
│           └── ResultScreen
├── assets/
|   ├── logo-panda.svg          # Haupt-Logo (SVG)
|   ├── logo-panda.png          # Logo Fallback (PNG)
|   ├── logo-panda-white.svg    # Weiße Logo-Variante (SVG)
|   ├── logo-panda-white.png    # Weiße Logo-Variante (PNG)
|   └── logo-panda.ico          # Favicon
|   └── logo-panda-white.ico    # Weiße Favicon-Variante
├── favicon.ico         # Favicon
└── readme.md           # Readme-Datei
```

## Design & UI

### Farbschema & Schriftarten
- **Primary Color:** Pastel-Grün (#A8E6CF)
- **Schrift:** Google Fonts: Host Grotesk (Body), Cherry Bomb One (Titel)

### Animationen
- **Gradient:** 45s Farbverlauf im Hintergrund
- **Fallende Rechtecke:** Hintergrundanimation
- **Screen-Transitions:** Fade-in/Fade-out zwischen Screens
- **Button-Animationen** Hover mit Schattenwurf und Klick mit Feedback

### Responsive Design
- **Card-Breite:** Max. 600px
- **Logo-Größen:** 120px (Start), 80px (Frage-Screens)
- **Mobile-optimiert:** Touch-freundliche Button-Größen

### Logo
In Adobe Illustrator erstellt in weiß und schwarz für unterschiedliche Hintergründe.

## Browser-Kompatibilität
- Chrome/Edge (empfohlen)
- Firefox
- Safari
- Mobile Browser (iOS, Android)

## Technologien
- **JavaScript** für die Logik
- **CSS3** mit Custom Properties und Animationen
- **Responsive Design** (Flexbox, Media Queries)
- **Single-Page Application** (SPA) ohne Framework

## Nutzung
1. "Start" klicken
2. Inhaltstyp wählen (E-Mail, Bilder/Videos, Ton)
3. Fragen zum Inhalt beantworten
4. Bei "Nicht sicher": Hilfe-Screen mit Beispielen
5. Rechtliche Einordnung mit relevanten Paragraphen erhalten

## Navigation
- **Zurück-Button:** Zur vorherigen Frage zurückkehren
- **Logo-Klick:** Zum Start zurückkehren und von vorne beginnen
- **"Neue Prüfung starten":** Nach Ergebnis von vorne Beginnen


## Entscheidungspfade und Ergebnisse

### E-Mail

#### Mit KI generiert = JA
**Pfad 1: Bedrohung**
- E-Mail → KI: Ja → Inhalt: Bedrohung
- **Ergebnis:** § 241 StGB - Bedrohung

**Pfad 2: Erpressung / Sextortion**
- E-Mail → KI: Ja → Inhalt: Erpressung
- **Ergebnis:** 
  - § 253 StGB - Erpressung
  - § 201a StGB - Verletzung des höchstpersönlichen Lebensbereichs (Sextortion)
  - § 201 StGB - Verletzung der Vertraulichkeit des Wortes
  - § 184 StGB - Verbreitung pornografischer Inhalte (falls veröffentlicht)

**Pfad 3: Phishing-Link**
- E-Mail → KI: Ja → Inhalt: Link (Phishing)
- **Ergebnis:** 
  - § 263a StGB - Computerbetrug
  - § 202a StGB - Ausspähen von Daten
  - § 202b StGB - Abfangen von Daten
  - § 269 StGB - Fälschung beweiserheblicher Daten

#### Ohne KI generiert = NEIN
**Pfad 4: Bedrohung (nicht KI)**
- E-Mail → KI: Nein → Inhalt: Bedrohung
- **Ergebnis:** § 241 StGB - Bedrohung

**Pfad 5: Erpressung / Sextortion (nicht KI)**
- E-Mail → KI: Nein → Inhalt: Erpressung
- **Ergebnis:** 
  - § 253 StGB - Erpressung
  - § 201a StGB - Verletzung des höchstpersönlichen Lebensbereichs (Sextortion)
  - § 201 StGB - Verletzung der Vertraulichkeit des Wortes
  - § 184 StGB - Verbreitung pornografischer Inhalte (falls veröffentlicht)

**Pfad 6: Phishing-Link (nicht KI)**
- E-Mail → KI: Nein → Inhalt: Link (Phishing)
- **Ergebnis:** 
  - § 263a StGB - Computerbetrug
  - § 202a StGB - Ausspähen von Daten
  - § 202b StGB - Abfangen von Daten
  - § 269 StGB - Fälschung beweiserheblicher Daten

---

### Bilder / Videos

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
- **Ergebnis:** § 33 KUG - Recht am eigenen Bild

**Pfad 11: Nicht-pornografische Inhalte ohne sichtbare Person**
- Bilder/Videos → KI: Ja → Pornografisch: Nein → Person sichtbar: Nein
- **Ergebnis:** Voraussichtlich keine strafbaren Handlungen

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
- **Ergebnis:** § 33 KUG - Recht am eigenen Bild

**Pfad 16: Nicht-pornografische Inhalte ohne sichtbare Person (nicht KI)**
- Bilder/Videos → KI: Nein → Pornografisch: Nein → Person sichtbar: Nein
- **Ergebnis:** Voraussichtlich keine strafbaren Handlungen

---

### Ton / Audio

#### Mit KI generiert = JA

**Pfad 17: Falscher Polizeibeamter mit Schaden**
- Ton → KI: Ja → Phänomen: Falscher Polizeibeamter → Geld bezahlt: Ja
- **Ergebnis:** § 132 StGB - Amtsanmaßung, § 263 StGB - Betrug

**Pfad 18: Falscher Polizeibeamter ohne Schaden**
- Ton → KI: Ja → Phänomen: Falscher Polizeibeamter → Geld bezahlt: Nein
- **Ergebnis:** § 132 StGB - Amtsanmaßung, § 263 StGB - Betrug (Versuch)

**Pfad 19: Enkeltrick mit Schaden**
- Ton → KI: Ja → Phänomen: Enkeltrick/Schockanruf → Geld bezahlt: Ja
- **Ergebnis:** § 263 StGB - Betrug, § 253 StGB - Erpressung

**Pfad 20: Enkeltrick ohne Schaden**
- Ton → KI: Ja → Phänomen: Enkeltrick/Schockanruf → Geld bezahlt: Nein
- **Ergebnis:** § 263 StGB - Betrug (Versuch), § 253 StGB - Erpressung (Versuch)

#### Ohne KI generiert = NEIN

**Pfad 21: Audio-Inhalte (nicht KI)**
- Ton → KI: Nein
- **Ergebnis:** § 263 StGB - Betrug (falls betrügerische Absichten vorliegen)

---

### Nicht sicher

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

```mermaid
graph LR;
    A(["Start"])-->B["Inhalt?"];
    
    %% E-Mail
    B-->C["E-Mail"];
    C-->C1["KI?"];
    
    %% E-Mail mit KI
    C1-->C2["Ja"];
    C2-->C3["Inhalt?"];
    
    %% Bedrohung
    C3-->C4["Bedrohung"];
    C4-->C4A[["§241 StGB"]];
    
    %% Erpressung
    C3-->C5["Erpressung"];
    C5-->C5A["Erfolg?"];
    C5A-->C5B["Ja"];
    C5B-->C5B1[["§253 StGB"]];
    C5B-->C5B2[["§201a StGB bei Sextortion"]];
    C5B-->C5B3[["§184 StGB bei Sextortion"]];
    C5B-->C5B4[["§201 StGB bei Aufzeichnung von Kommunikation"]];
    C5A-->C5C["Nein"];
    C5C-->C5C1[["§253 StGB (Versuch)"]];
    C5C-->C5C2[["§201a StGB bei Sextortion"]];
    C5C-->C5C3[["§184 StGB bei Sextortion"]];
    C5C-->C5C4[["§201 StGB bei Aufzeichnung von Kommunikation"]];
    
    %% Link (Phishing)
    C3-->C6["Link (Phishing)"];
    C6-->C6A["Erfolg?"];
    C6A-->C6B["Ja"];
    C6B-->C6B1[["§263a StGB"]];
    C6B-->C6B2[["§202a StGB"]];
    C6B-->C6B3[["§202b StGB"]];
    C6B-->C6B4[["§269 StGB"]];
    C6A-->C6C["Nein"];
    C6C-->C6C1[["§263a StGB (Versuch)"]];
    C6C-->C6C2[["§202a StGB"]];
    C6C-->C6C3[["§202b StGB"]];
    C6C-->C6C4[["§269 StGB"]];

    %% E-Mail ohne KI
    C1-->C45["Nein"];
    C45-->C46["Inhalt?"];
    
    %% Bedrohung
    C46-->C47["Bedrohung"];
    C47-->C47A[["§241 StGB"]];
    
    %% Erpressung
    C46-->C48["Erpressung"];
    C48-->C48A["Erfolg?"];
    C48A-->C48B["Ja"];
    C48B-->C48B1[["§253 StGB"]];
    C48B-->C48B2[["§201a StGB bei Sextortion"]];
    C48B-->C48B3[["§184 StGB bei Sextortion"]];
    C48B-->C48B4[["§201 StGB bei Aufzeichnung von Kommunikation"]];
    C48A-->C48C["Nein"];
    C48C-->C48C1[["§253 StGB (Versuch)"]];
    C48C-->C48C2[["§201a StGB bei Sextortion"]];
    C48C-->C48C3[["§184 StGB bei Sextortion"]];
    C48C-->C48C4[["§201 StGB bei Aufzeichnung von Kommunikation"]];
    
    %% Link
    C46-->C49["Link (Phishing)"];
    C49-->C49A["Erfolg?"];
    C49A-->C49B["Ja"];
    C49B-->C49B1[["§263a StGB"]];
    C49B-->C49B2[["§202a StGB"]];
    C49B-->C49B3[["§202b StGB"]];
    C49B-->C49B4[["§269 StGB"]];
    C49A-->C49C["Nein"];
    C49C-->C49C1[["§263a StGB (Versuch)"]];
    C49C-->C49C2[["§202a StGB"]];
    C49C-->C49C3[["§202b StGB"]];
    C49C-->C49C4[["§269 StGB"]];

    %% Bilder/Videos
    B-->D["Bilder/Videos"];
    D-->D1["KI?"];
    
    %% Bilder mit KI
    D1-->D2["Ja"];
    D2-->D4["Pornografisch?"];
    D4-->D4A["Ja"];
    D4A-->D4A1["Kinder?"];
    D4A1-->D4A1A["Ja"];
    D4A1A-->D4A1A1[["§184b StGB"]];
    D4A1-->D4A1B["Nein"];
    D4A1B-->D4A1B1["Person sichtbar?"];
    D4A1B1-->D4A1B1A["Ja"];
    D4A1B1A-->D4A1B1A1[["§184 StGB"]];
    D4A1B1A-->D4A1B1A2[["§201a StGB"]];
    D4A1B1A-->D4A1B1A3[["§33 KUG"]];
    D4A1B1-->D4A1B1B["Nein"];
    D4A1B1B-->D4A1B1B1[["§184 StGB"]];
    
    D4-->D4B["Nein"];
    D4B-->D4B1["Person sichtbar?"];
    D4B1-->D4B1A["Ja"];
    D4B1A-->D4B1A1[["§33 KUG"]];
    D4B1-->D4B1B["Nein"];
    D4B1B-->D4B1B1[["Keine Straftat"]];

    %% Bilder ohne KI
    D1-->D3["Nein"];
    D3-->D5["Pornografisch?"];
    D5-->D5A["Ja"];
    D5A-->D5A1["Kinder?"];
    D5A1-->D5A1A["Ja"];
    D5A1A-->D5A1A1[["§184b StGB"]];
    D5A1-->D5A1B["Nein"];
    D5A1B-->D5A1B1["Person sichtbar?"];
    D5A1B1-->D5A1B1A["Ja"];
    D5A1B1A-->D5A1B1A1[["§184 StGB"]];
    D5A1B1A-->D5A1B1A2[["§201a StGB"]];
    D5A1B1A-->D5A1B1A3[["§33 KUG"]];
    D5A1B1-->D5A1B1B["Nein"];
    D5A1B1B-->D5A1B1B1[["§184 StGB"]];
    
    D5-->D5B["Nein"];
    D5B-->D5B1["Person sichtbar?"];
    D5B1-->D5B1A["Ja"];
    D5B1A-->D5B1A1[["§33 KUG"]];
    D5B1-->D5B1B["Nein"];
    D5B1B-->D5B1B1[["Keine Straftat"]];

    %% Ton 
    B-->E["Ton"];
    E-->E1["KI?"];
    
    %% Ton mit KI
    E1-->E2["Ja"];
    E2-->E3["Phänomen?"];
    E3-->E4["Falscher PVB"];
    E4-->E4A["Erfolg?"];
    E4A-->E4A1["Ja"];
    E4A1-->E4A1A[["§132 StGB"]];
    E4A1-->E4A1B[["§263 StGB"]];
    E4A-->E4A2["Nein"];
    E4A2-->E4A2A[["§132 StGB"]];
    E4A2-->E4A2B[["§263 StGB (Versuch)"]];
    
    E3-->E5["Enkeltrick"];
    E5-->E5A["Erfolg?"];
    E5A-->E5A1["Ja"];
    E5A1-->E5A1A[["§263 StGB"]];
    E5A1-->E5A1B[["§253 StGB"]];
    E5A-->E5A2["Nein"];
    E5A2-->E5A2A[["§263 StGB (Versuch)"]];
    E5A2-->E5A2B[["§253 StGB (Versuch)"]];
    
    %% Ton ohne KI
    E1-->E6["Nein"];
    E6-->E6A[["§263 StGB"]];

    %% Nicht sicher
    B-->F["Nicht sicher"];
    F-->F1[["Infotext"]];
```

## Rechtliche Hinweise

Dieses Tool dient als Unterstützung und ersetzt keine rechtliche Beratung oder detaillierte Prüfung durch Experten. Die angezeigten Straftatbestände sind Hinweise auf möglicherweise relevante Normen und bedürfen einer individuellen juristischen Bewertung im Einzelfall.

## Lizenz

Für den internen Gebrauch in Polizeibehörden.

