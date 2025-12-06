/*
 * PANDA - Polizeiliche Analyse Nichtmenschlicher Digitaler Artefakte
 */

// States
// speicherung des states
class AppState {
    constructor() {
        this.currentScreen = 'start';
        this.screenHistory = []; //historie für zurückfunktion
        this.answers = {
            contentType: null,  // email, images oder audio
            isAI: null,         // KI oder keine KI
            emailContent: null, // threat, extortion oder link
            audioType: null,    // false_official oder grandparent_scam
            isPornographic: null, // für Kipo / Jupo oder 201a
            hasChildren: null, // für kipo
            moneyPaid: null, //versuch vs vollendet
            victimVisible: null // Wichtig für §201a und §33 KUG
        };
        this.progress = 0;
    }

    setAnswer(key, value) {
        this.answers[key] = value;
    }

    getAnswer(key) {
        return this.answers[key];
    }

    addToHistory(screenName) {
        this.screenHistory.push(screenName);
    }

    goBack() {
        if (this.screenHistory.length > 0) {
            this.screenHistory.pop(); // letzten Schritt entfernen
            const previousScreen = this.screenHistory[this.screenHistory.length - 1];
            return previousScreen || 'start';
        }
        return 'start';
    }

    reset() {
        // zurück zum Start
        this.currentScreen = 'start';
        this.screenHistory = [];
        this.answers = {
            contentType: null,
            isAI: null,
            emailContent: null,
            audioType: null,
            isPornographic: null,
            hasChildren: null,
            moneyPaid: null,
            victimVisible: null
        };
        this.progress = 0;
    }

    setProgress(value) {
        this.progress = value;
    }
}

// Rechtliche Bewertung
class DecisionLogic {
    static getLaws(answers) {
        const laws = [];

        // wenn KI = ja
        if (answers.isAI === true) {
            // Bilder/Videos
            if (answers.contentType === 'images') {
                if (answers.isPornographic === true) {
                    if (answers.hasChildren === true) {
                        // Kipo immer 184b
                        laws.push({
                            title: '§ 184b StGB - Verbreitung kinderpornografischer Inhalte',
                            description: 'KI-generierte kinderpornografische Inhalte sind strafbar. Freiheitsstrafe von einem Jahr bis zu zehn Jahren.'
                        });
                    } else {
                        // Pornografisch, aber keine Kinder
                        laws.push({
                            title: '§ 184 StGB - Verbreitung pornografischer Inhalte',
                            description: 'Verbreitung, Erwerb und Besitz pornografischer Inhalte bei unter 18 Jährigen (14-18).'
                        });
                        //zbsp eigenes gesicht
                        if (answers.victimVisible === true) {
                            laws.push({
                                title: '§ 201a StGB - Verletzung des höchstpersönlichen Lebensbereichs',
                                description: 'Herstellung oder Übertragung bildlicher Aufnahmen, die geeignet sind, dem Ansehen erheblich zu schaden.'
                            });
                            laws.push({
                                title: '§ 33 KUG - Recht am eigenen Bild',
                                description: 'Bildnisse dürfen nur mit Einwilligung des Abgebildeten verbreitet oder öffentlich zur Schau gestellt werden.'
                            });
                        }
                    }
                } else {
                    // nicht pornografisch, aber bild der gesch. person
                    if (answers.victimVisible === true) {
                        laws.push({
                            title: '§ 33 KUG - Recht am eigenen Bild',
                            description: 'Bildnisse dürfen nur mit Einwilligung des Abgebildeten verbreitet oder öffentlich zur Schau gestellt werden.'
                        });
                    } else {
                        laws.push({
                            title: 'Voraussichtlich keine strafbaren Handlungen',
                            description: 'Prüfung notwendig, ob andere Straftatbestände erfüllt sind.'
                        });
                    }
                }
            }

            // E-Mails mit KI
            if (answers.contentType === 'email') {
                if (answers.emailContent === 'threat') {
                    // Bedrohung
                    laws.push({
                        title: '§ 241 StGB - Bedrohung',
                        description: 'Mit der Begehung eines Verbrechens gegen eine Person oder nahestehende Personen drohen.'
                    });
                } else if (answers.emailContent === 'extortion') {
                    // Erpressung / Sextortion
                    laws.push({
                        title: '§ 253 StGB - Erpressung',
                        description: 'Nötigung zu einer Vermögensverfügung durch Gewalt oder Drohung.'
                    });
                    laws.push({
                        title: '§ 201a StGB - Verletzung des höchstpersönlichen Lebensbereichs',
                        description: 'Bei Sextortion: Drohung mit Veröffentlichung intimer Aufnahmen, die geeignet sind, dem Ansehen erheblich zu schaden.'
                    });
                    laws.push({
                        title: '§ 201 StGB - Verletzung der Vertraulichkeit des Wortes',
                        description: 'Falls vertrauliche Kommunikation aufgezeichnet und zur Erpressung verwendet wurde.'
                    });
                    laws.push({
                        title: '§ 184 StGB - Verbreitung pornografischer Inhalte',
                        description: 'Bei Sextortion: Falls intime/pornografische Inhalte tatsächlich veröffentlicht wurden.'
                    });
                } else if (answers.emailContent === 'link') {
                    // Phishing
                    laws.push({
                        title: '§ 263a StGB - Computerbetrug',
                        description: 'Unbefugte Verwendung von Daten mit der Absicht, sich oder einem Dritten einen rechtswidrigen Vermögensvorteil zu verschaffen.'
                    });
                    laws.push({
                        title: '§ 202a StGB - Ausspähen von Daten',
                        description: 'Verschaffung des Zugangs zu Daten, die gegen unberechtigten Zugang besonders gesichert sind.'
                    });
                    laws.push({
                        title: '§ 202b StGB - Abfangen von Daten',
                        description: 'Verschaffung von Daten aus einer nichtöffentlichen Datenübermittlung oder aus der elektromagnetischen Abstrahlung einer Datenverarbeitungsanlage.'
                    });
                    laws.push({
                        title: '§ 269 StGB - Fälschung beweiserheblicher Daten',
                        description: 'Speicherung oder Veränderung von Daten mit Beweiserheblichkeit in der Absicht, diese Daten rechtswidrig zu verwenden.'
                    });
                }
            }

            // Audio-Dateien mit KI (Voice-Cloning etc.)
            if (answers.contentType === 'audio') {
                if (answers.audioType === 'false_official') {
                    // falscher PVB
                    laws.push({
                        title: '§ 132 StGB - Amtsanmaßung',
                        description: 'Unbefugte Vornahme einer Handlung, welche nur kraft eines öffentlichen Amtes vorgenommen werden darf.'
                    });
                    if (answers.moneyPaid === true) {
                        laws.push({
                            title: '§ 263 StGB - Betrug',
                            description: 'Täuschung über die Identität als Amtsperson zur Erlangung von Vermögensvorteilen.'
                        });
                    } else if (answers.moneyPaid === false) {
                        laws.push({
                            title: '§ 263 StGB - Betrug (Versuch)',
                            description: 'Versuchter Betrug. Täuschung über die Identität als Amtsperson zur Erlangung von Vermögensvorteilen.'
                        });
                    }
                } else if (answers.audioType === 'grandparent_scam') {
                    // Enkeltrick/Schockanruf
                    laws.push({
                        title: '§ 263 StGB - Betrug',
                        description: 'Täuschung über Notlagen von Familienangehörigen zur Erlangung von Geld oder Wertsachen.'
                    });
                    laws.push({
                        title: '§ 253 StGB - Erpressung',
                        description: 'Falls Drohungen ausgesprochen wurden, um Vermögensverfügungen zu erzwingen.'
                    });
                }

                // Versuch oder vollendet
                if (answers.moneyPaid === true) {
                        laws.push({
                            title: '§ 263 StGB - Betrug',
                            description: 'Täuschung über Notlagen von Familienangehörigen zur Erlangung von Geld oder Wertsachen.'
                        });
                        laws.push({
                            title: '§ 253 StGB - Erpressung',
                            description: 'Falls Drohungen ausgesprochen wurden, um Vermögensverfügungen zu erzwingen.'
                        });
                    } else if (answers.moneyPaid === false) {
                        laws.push({
                            title: '§ 263 StGB - Betrug (Versuch)',
                            description: 'Versuchter Betrug bei Täuschung über Notlagen von Familienangehörigen zur Erlangung von Geld oder Wertsachen.'
                        });
                        laws.push({
                            title: '§ 253 StGB - Erpressung (Versuch)',
                            description: 'Versuchte Erpressung. Falls Drohungen ausgesprochen wurden, um Vermögensverfügungen zu erzwingen.'
                        });
                    }
                }
            }

        } else if (answers.isAI === false) {
            // Keine KI beteiligt - klassische Fälle
            if (answers.contentType === 'images') {
                // Bilder/videos
                if (answers.isPornographic === true) {
                    if (answers.hasChildren === true) {
                        // Kinderpornografie ist immer strafbar, egal ob KI oder nicht
                        laws.push({
                            title: '§ 184b StGB - Verbreitung kinderpornografischer Inhalte',
                            description: 'Kinderpornografische Inhalte sind strafbar. Freiheitsstrafe von einem Jahr bis zu zehn Jahren.'
                        });
                    } else {
                        // Pornografisch ohne Kinder
                        laws.push({
                            title: '§ 184 StGB - Verbreitung pornografischer Inhalte',
                            description: 'Bei pornografischen Inhalten ohne Einwilligung der abgebildeten Personen.'
                        });
                        // Wenn eine Person sichtbar ist
                        if (answers.victimVisible === true) {
                            laws.push({
                                title: '§ 201a StGB - Verletzung des höchstpersönlichen Lebensbereichs',
                                description: 'Unbefugte Bildaufnahmen aus dem höchstpersönlichen Lebensbereich.'
                            });
                            laws.push({
                                title: '§ 33 KUG - Recht am eigenen Bild',
                                description: 'Verletzung des Rechts am eigenen Bild durch unerlaubte Verbreitung.'
                            });
                        }
                    }
                } else {
                    // Nicht pornografisch
                    if (answers.victimVisible === true) {
                        laws.push({
                            title: '§ 33 KUG - Recht am eigenen Bild',
                            description: 'Verletzung des Rechts am eigenen Bild durch unerlaubte Verbreitung.'
                        });
                    // just ai slob
                    } else {
                        laws.push({
                            title: 'Voraussichtlich keine strafbaren Handlungen',
                            description: 'Prüfung notwendig, ob andere Straftatbestände erfüllt sind.'
                        });
                    }
                }
            } else if (answers.contentType === 'email') {
                // E-Mails ohne KI zbsp. klassisches Phishing/sextortion
                if (answers.emailContent === 'threat') {
                    laws.push({
                        title: '§ 241 StGB - Bedrohung',
                        description: 'Bedrohung mit der Begehung eines Verbrechens.'
                    });
                } else if (answers.emailContent === 'extortion') {
                    laws.push({
                        title: '§ 253 StGB - Erpressung',
                        description: 'Erpressung durch Drohung mit einem empfindlichen Übel.'
                    });
                    laws.push({
                        title: '§ 201a StGB - Verletzung des höchstpersönlichen Lebensbereichs',
                        description: 'Bei Sextortion: Drohung mit Veröffentlichung intimer Aufnahmen, die geeignet sind, dem Ansehen erheblich zu schaden.'
                    });
                    laws.push({
                        title: '§ 201 StGB - Verletzung der Vertraulichkeit des Wortes',
                        description: 'Falls vertrauliche Kommunikation aufgezeichnet und zur Erpressung verwendet wurde.'
                    });
                    laws.push({
                        title: '§ 184 StGB - Verbreitung pornografischer Inhalte',
                        description: 'Bei Sextortion: Falls intime/pornografische Inhalte tatsächlich veröffentlicht wurden.'
                    });
                } else if (answers.emailContent === 'link') {
                    laws.push({
                        title: '§ 263a StGB - Computerbetrug',
                        description: 'Phishing-Versuch zur unbefugten Datenerlangung.'
                    });
                    laws.push({
                        title: '§ 202a StGB - Ausspähen von Daten',
                        description: 'Versuch des unbefugten Zugangs zu geschützten Daten.'
                    });
                    laws.push({
                        title: '§ 202b StGB - Abfangen von Daten',
                        description: 'Verschaffung von Daten aus einer nichtöffentlichen Datenübermittlung oder aus der elektromagnetischen Abstrahlung einer Datenverarbeitungsanlage.'
                    });
                    laws.push({
                        title: '§ 269 StGB - Fälschung beweiserheblicher Daten',
                        description: 'Speicherung oder Veränderung von Daten mit Beweiserheblichkeit in der Absicht, diese Daten rechtswidrig zu verwenden.'
                    });
                }
            } else if (answers.contentType === 'audio') {
                // Audio ohne KI
                laws.push({
                    title: '§ 263 StGB - Betrug',
                    description: 'Falls betrügerische Absichten vorliegen.'
                });
            }
        }

        // fallback 
        if (laws.length === 0) {
            laws.push({
                title: 'Weitere Prüfung erforderlich',
                description: 'Basierend auf den Angaben können verschiedene Straftatbestände in Betracht kommen. Eine detaillierte rechtliche Prüfung ist erforderlich.'
            });
        }

        return laws;
    }

    static getAIRecognitionTips(contentType) {
        // tipps, um KI zu erkennen
        const tips = {
            email: 'KI-generierte E-Mails erkennst du oft an:\n• Ungewöhnlich perfekter Grammatik und Satzbau\n• Fehlender persönlicher Note oder spezifischen Details\n• Generischen Formulierungen\n• Unpassenden Kontextinformationen\n• Widersprüchen im Text',
            images: 'KI-generierte Bilder erkennst du oft an:\n• Unnatürlichen Händen oder Fingern\n• Verschwommenen Hintergründen\n• Unrealistischen Schatten oder Lichtreflexionen\n• Seltsamen Texturen oder Mustern\n• Asymmetrien bei symmetrischen Objekten\n• Unlogischen Details',
            audio: 'KI-generierte Audioinhalte erkennst du oft an:\n• Unnatürlicher Betonung oder Sprachmelodie\n• Fehlenden Atemgeräuschen\n• Roboterhaft klingender Aussprache\n• Gleichbleibender Tonhöhe ohne natürliche Variationen\n• Artefakte oder Störungen in der Stimme',
            unsure: 'Allgemeine Hinweise zur KI-Erkennung:\n• Fordere weitere Informationen oder Beweise an\n• Nutze spezialisierte KI-Erkennungstools\n• Prüfe Metadaten der Dateien\n• Konsultiere Experten bei Unsicherheit\n• Dokumentiere alle Auffälligkeiten'
        };

        return tips[contentType] || tips.unsure;
    }
}

// Screens und UI

// Hilfsfunktionen die von allen Screens benutzt werden
class ScreenHelpers {
    static createLogoHeader(navigation, state) {
        // logo, klick für start
        const header = document.createElement('div');
        header.className = 'screen-header';
        header.innerHTML = `
            <div class="logo-container-small" id="header-logo">
                <img src="assets/logo-panda.svg" alt="PANDA Logo" class="logo-small" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23A8E6CF%22 rx=%2220%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22white%22%3EP%3C/text%3E%3C/svg%3E'">
            </div>
        `; // onerror zeigt grünes P falls Logo fehlt
        return header;
    }

    //zurück button
    static createBackButton(navigation, state) {
        const backBtn = document.createElement('button');
        backBtn.className = 'rounded-button back-button';
        backBtn.innerHTML = 'Zurück';
        backBtn.id = 'back-button';
        return backBtn;
    }

    // zurück button listener
    static attachBackButtonListener(navigation, state) {
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                // letzten step aus history laden
                const previousScreen = state.goBack();
                navigation.navigateTo(previousScreen, { contentType: state.getAnswer('contentType') }, true);
            });
        }
    }

    static attachLogoListener(navigation, state) {
        const logo = document.getElementById('header-logo');
        if (logo) {
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', () => {
                // Logo-Klick = zurück zum Start + alles resetten
                state.reset();
                navigation.navigateTo('start', {}, true);
            });
        }
    }
}

class StartScreen {
    static render() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        
        screen.innerHTML = `
            <div class="logo-container">
                <img src="assets/logo-panda.svg" alt="PANDA Logo" class="logo" id="logo-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22%3E%3Crect width=%22240%22 height=%22240%22 fill=%22%23A8E6CF%22 rx=%2240%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%22120%22 fill=%22white%22 font-weight=%22bold%22%3EP%3C/text%3E%3C/svg%3E'">
            </div>
            <h1>PANDA</h1>
            <p class="subtitle">Polizeiliche Analyse Nichtmenschlicher Digitaler Artefakte</p>
            <div class="info-text" style="margin-top: 20px; margin-bottom: 20px; font-size: 0.9em; opacity: 0.85;">
                ⚠️ <strong>Hinweis:</strong> Dieses Tool dient als erste Orientierungshilfe. 
                Eine manuelle rechtliche Prüfung wird dringend empfohlen. 
                Es wird keine Garantie für die Vollständigkeit oder Richtigkeit der Angaben übernommen.
            </div>
            <div class="button-group">
                <button class="rounded-button primary" id="start-button">
                    Start
                </button>
            </div>
        `;

        const logo = screen.querySelector('#logo-image');
        logo.onerror = function() {
            this.style.display = 'none'; // Verstecken falls Logo nicht lädt
        };

        return screen;
    }

    static attachEventListeners(navigation, state) {
        const startButton = document.getElementById('start-button');
        startButton.addEventListener('click', () => {
            state.setProgress(1); // Erste frage
            navigation.navigateTo('contentType');
        });
    }
}

class ContentTypeScreen {
    static render() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        
        // Logo 
        const header = ScreenHelpers.createLogoHeader();
        screen.appendChild(header);
        
        //Inhaltstyp
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="progress-dots">
                <div class="progress-dot active"></div>
                <div class="progress-dot"></div>
                <div class="progress-dot"></div>
            </div>
            <h2>Um welchen Inhalt handelt es sich?</h2>
            <p class="subtitle">Wähle die Art des zu prüfenden Materials</p>
            <div class="button-group">
                <button class="rounded-button option" data-type="email">
                    E-Mail
                </button>
                <button class="rounded-button option" data-type="images">
                    Bilder / Videos
                </button>
                <button class="rounded-button option" data-type="audio">
                    Ton
                </button>
                <button class="rounded-button option" data-type="unsure">
                    Ich bin mir nicht sicher
                </button>
            </div>
        `;
        screen.appendChild(content);
        
        // Zurück button
        const backBtn = ScreenHelpers.createBackButton();
        content.appendChild(backBtn);

        return screen;
    }

    static attachEventListeners(navigation, state) {
        ScreenHelpers.attachLogoListener(navigation, state);
        ScreenHelpers.attachBackButtonListener(navigation, state);
        
        const buttons = document.querySelectorAll('[data-type]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const contentType = e.target.dataset.type;
                state.setAnswer('contentType', contentType);
                state.setProgress(2); // Zweite frage
                
                // nicht sicher = help, ansonsten aiCheck
                if (contentType === 'unsure') {
                    navigation.navigateTo('unsureHelp');
                } else {
                    navigation.navigateTo('aiCheck', { contentType });
                }
            });
        });
    }
}

class AICheckScreen {
    static render(data) {
        const screen = document.createElement('div');
        screen.className = 'screen';
        
        // Logo
        const header = ScreenHelpers.createLogoHeader();
        screen.appendChild(header);
        
        //help
        const contentType = data.contentType;
        const tips = DecisionLogic.getAIRecognitionTips(contentType);
        
        //aiChecker
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="progress-dots">
                <div class="progress-dot"></div>
                <div class="progress-dot active"></div>
                <div class="progress-dot"></div>
            </div>
            <h2>Handelt es sich um KI?</h2>
            <div class="info-text">
                ${tips.split('\n').map(line => `<div>${line}</div>`).join('')}
            </div>
            <div class="button-group">
                <button class="rounded-button yes" data-answer="yes">
                    Ja
                </button>
                <button class="rounded-button no" data-answer="no">
                    Nein
                </button>
            </div>
        `;
        screen.appendChild(content);
        
        // Zurück button
        const backBtn = ScreenHelpers.createBackButton();
        content.appendChild(backBtn);

        return screen;
    }

    static attachEventListeners(navigation, state) {
        ScreenHelpers.attachLogoListener(navigation, state);
        ScreenHelpers.attachBackButtonListener(navigation, state);
        const buttons = document.querySelectorAll('[data-answer]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const isAI = e.target.dataset.answer === 'yes';
                state.setAnswer('isAI', isAI);
                state.setProgress(3); // Dritte frage
                
                const contentType = state.getAnswer('contentType');
                
                // Je nach art der medium und ki status weitere fragen
                if (isAI) {
                    // Bilder-> pornografie abfrage. E-Mail -> art der mail. Ton: art des anrufs
                    if (contentType === 'images') {
                        navigation.navigateTo('pornographicCheck');
                    } else if (contentType === 'email') {
                        navigation.navigateTo('emailContent');
                    } else if (contentType === 'audio') {
                        navigation.navigateTo('audioType');
                    } else {
                        navigation.navigateTo('result', { answers: state.answers });
                    }
                } else {
                    // ohne KI
                    if (contentType === 'email') {
                        navigation.navigateTo('emailContent');
                    } else if (contentType === 'images') {
                        // Bei Bildern/Videos stellen wir die Fragen auch ohne KI
                        navigation.navigateTo('pornographicCheck');
                    } else {
                        navigation.navigateTo('result', { answers: state.answers });
                    }
                }
            });
        });
    }
}

class EmailContentScreen {
    static render() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        
        const header = ScreenHelpers.createLogoHeader();
        screen.appendChild(header);
        
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="progress-dots">
                <div class="progress-dot"></div>
                <div class="progress-dot"></div>
                <div class="progress-dot active"></div>
            </div>
            <h2>Was ist der Inhalt der E-Mail?</h2>
            <p class="subtitle">Wähle die zutreffende Kategorie</p>
            <div class="button-group">
                <button class="rounded-button option" data-content="threat">
                    Bedrohung
                </button>
                <button class="rounded-button option" data-content="extortion">
                    Erpressung
                </button>
                <button class="rounded-button option" data-content="link">
                    Link (Phishing)
                </button>
            </div>
        `;
        screen.appendChild(content);
        
        const backBtn = ScreenHelpers.createBackButton();
        content.appendChild(backBtn);

        return screen;
    }

    static attachEventListeners(navigation, state) {
        ScreenHelpers.attachLogoListener(navigation, state);
        ScreenHelpers.attachBackButtonListener(navigation, state);
        const buttons = document.querySelectorAll('[data-content]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const emailContent = e.target.dataset.content;
                state.setAnswer('emailContent', emailContent);
                
                // Erpressung braucht noch moneyPaid-Frage, Rest direkt zu Result
                if (emailContent === 'extortion') {
                    navigation.navigateTo('moneyPaid');
                } else {
                    navigation.navigateTo('result', { answers: state.answers });
                }
            });
        });
    }
}

class PornographicCheckScreen {
    static render() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        
        const header = ScreenHelpers.createLogoHeader();
        screen.appendChild(header);
        
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="progress-dots">
                <div class="progress-dot"></div>
                <div class="progress-dot"></div>
                <div class="progress-dot active"></div>
            </div>
            <h2>Handelt es sich um pornografische Inhalte?</h2>
            <p class="subtitle">Bitte prüfe den Inhalt sorgfältig</p>
            <div class="button-group">
                <button class="rounded-button yes" data-answer="yes">
                    Ja
                </button>
                <button class="rounded-button no" data-answer="no">
                    Nein
                </button>
            </div>
        `;
        screen.appendChild(content);
        
        const backBtn = ScreenHelpers.createBackButton();
        content.appendChild(backBtn);

        return screen;
    }

    static attachEventListeners(navigation, state) {
        ScreenHelpers.attachLogoListener(navigation, state);
        ScreenHelpers.attachBackButtonListener(navigation, state);
        const buttons = document.querySelectorAll('[data-answer]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const isPornographic = e.target.dataset.answer === 'yes';
                state.setAnswer('isPornographic', isPornographic);
                
                // Porno -> Kinder-Check. Kein Porno -> Opfer sichtbar?
                if (isPornographic) {
                    navigation.navigateTo('childrenCheck');
                } else {
                    navigation.navigateTo('victimVisibleCheck');
                }
            });
        });
    }
}

class ChildrenCheckScreen {
    static render() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        
        const header = ScreenHelpers.createLogoHeader();
        screen.appendChild(header);
        
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="progress-dots">
                <div class="progress-dot"></div>
                <div class="progress-dot"></div>
                <div class="progress-dot active"></div>
            </div>
            <h2>Sind Kinder zu sehen?</h2>
            <p class="subtitle">Prüfung auf kinderpornografische Inhalte</p>
            <div class="button-group">
                <button class="rounded-button yes" data-answer="yes">
                    Ja
                </button>
                <button class="rounded-button no" data-answer="no">
                    Nein
                </button>
            </div>
        `;
        screen.appendChild(content);
        
        const backBtn = ScreenHelpers.createBackButton();
        content.appendChild(backBtn);

        return screen;
    }

    static attachEventListeners(navigation, state) {
        ScreenHelpers.attachLogoListener(navigation, state);
        ScreenHelpers.attachBackButtonListener(navigation, state);
        const buttons = document.querySelectorAll('[data-answer]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const hasChildren = e.target.dataset.answer === 'yes';
                state.setAnswer('hasChildren', hasChildren);
                // Kinder vorhanden -> direkt zu Result (§184b). Sonst victimVisible-Frage
                if (hasChildren) {
                    navigation.navigateTo('result', { answers: state.answers });
                } else {
                    navigation.navigateTo('victimVisibleCheck');
                }
            });
        });
    }
}

class VictimVisibleCheckScreen {
    static render() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        
        const header = ScreenHelpers.createLogoHeader();
        screen.appendChild(header);
        
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="progress-dots">
                <div class="progress-dot"></div>
                <div class="progress-dot"></div>
                <div class="progress-dot active"></div>
            </div>
            <h2>Ist die geschädigte Person zu sehen?</h2>
            <p class="subtitle">Prüfung auf Persönlichkeitsrechtsverletzung</p>
            <div class="button-group">
                <button class="rounded-button yes" data-answer="yes">
                    Ja
                </button>
                <button class="rounded-button no" data-answer="no">
                    Nein
                </button>
            </div>
        `;
        screen.appendChild(content);
        
        const backBtn = ScreenHelpers.createBackButton();
        content.appendChild(backBtn);

        return screen;
    }

    static attachEventListeners(navigation, state) {
        ScreenHelpers.attachLogoListener(navigation, state);
        ScreenHelpers.attachBackButtonListener(navigation, state);
        const buttons = document.querySelectorAll('[data-answer]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const victimVisible = e.target.dataset.answer === 'yes';
                state.setAnswer('victimVisible', victimVisible);
                navigation.navigateTo('result', { answers: state.answers });
            });
        });
    }
}

class UnsureHelpScreen {
    static render() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        
        const header = ScreenHelpers.createLogoHeader();
        screen.appendChild(header);
        
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="progress-dots">
                <div class="progress-dot"></div>
                <div class="progress-dot active"></div>
                <div class="progress-dot"></div>
            </div>
            <h2>Hilfe zur Inhaltsauswahl</h2>
            <p class="subtitle">Wähle die passende Kategorie basierend auf dem vorliegenden Material</p>
            
            <div class="info-text" style="margin-bottom: 16px;">
                <strong> E-Mail wählen, wenn:</strong><br>
                • Eine E-Mail-Nachricht vorliegt<br>
                • Phishing-Verdacht besteht<br>
                • Bedrohungen oder Erpressungen per E-Mail<br>
                <em>Beispiel: Erpresser-Mail mit Zahlungsaufforderung, Fake-Rechnungen</em>
            </div>
            
            <div class="info-text" style="margin-bottom: 16px;">
                <strong> Bilder/Videos wählen, wenn:</strong><br>
                • Foto- oder Videomaterial vorliegt<br>
                • Deepfake-Verdacht besteht<br>
                • Manipulierte Bilder vermutet werden<br>
                <em>Beispiel: Manipulierte Fotos von Personen, KI-generierte Gesichter, Deepfake-Videos</em>
            </div>
            
            <div class="info-text" style="margin-bottom: 16px;">
                <strong> Ton wählen, wenn:</strong><br>
                • Audiodateien oder Sprachnachrichten vorliegen<br>
                • Voice-Cloning-Verdacht besteht<br>
                • Verdacht auf gefälschte Anrufe<br>
                <em>Beispiel: Enkeltrick-Anruf mit geklonter Stimme, falscher Polizeibeamter</em>
            </div>
            
            <div class="button-group">
                <button class="rounded-button back-button" id="back-to-start">
                    Zurück zur Auswahl
                </button>
            </div>
        `;
        screen.appendChild(content);

        return screen;
    }

    static attachEventListeners(navigation, state) {
        ScreenHelpers.attachLogoListener(navigation, state);
        
        const backButton = document.getElementById('back-to-start');
        backButton.addEventListener('click', () => {
            // Nicht goBack() verwenden, sonst loop. Direkt zu contentType.
            const previousScreen = state.goBack();
            navigation.navigateTo('contentType', {}, true);
        });
    }
}

class AudioTypeScreen {
    static render() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        
        const header = ScreenHelpers.createLogoHeader();
        screen.appendChild(header);
        
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="progress-dots">
                <div class="progress-dot"></div>
                <div class="progress-dot"></div>
                <div class="progress-dot active"></div>
            </div>
            <h2>Um welches Phänomen handelt es sich?</h2>
            <p class="subtitle">Wähle die zutreffende Kategorie</p>
            <div class="button-group">
                <button class="rounded-button option" data-type="false_official">
                    Falscher Polizeibeamter
                </button>
                <button class="rounded-button option" data-type="grandparent_scam">
                    Enkeltrick / Schockanruf
                </button>
            </div>
        `;
        screen.appendChild(content);
        
        const backBtn = ScreenHelpers.createBackButton();
        content.appendChild(backBtn);

        return screen;
    }

    static attachEventListeners(navigation, state) {
        ScreenHelpers.attachLogoListener(navigation, state);
        ScreenHelpers.attachBackButtonListener(navigation, state);
        const buttons = document.querySelectorAll('[data-type]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const audioType = e.target.dataset.type;
                state.setAnswer('audioType', audioType);
                // Bei Ton immer moneyPaid-Frage (Versuch vs vollendet)
                navigation.navigateTo('moneyPaid');
            });
        });
    }
}

class MoneyPaidScreen {
    static render() {
        const screen = document.createElement('div');
        screen.className = 'screen';
        
        const header = ScreenHelpers.createLogoHeader();
        screen.appendChild(header);
        
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="progress-dots">
                <div class="progress-dot"></div>
                <div class="progress-dot"></div>
                <div class="progress-dot active"></div>
            </div>
            <h2>Wurde den Anweisungen Folge geleistet?</h2>
            <p class="subtitle">Wurde Geld bezahlt oder Wertgegenstände übergeben?</p>
            <div class="button-group">
                <button class="rounded-button yes" data-answer="yes">
                    Ja
                </button>
                <button class="rounded-button no" data-answer="no">
                    Nein
                </button>
            </div>
        `;
        screen.appendChild(content);
        
        const backBtn = ScreenHelpers.createBackButton();
        content.appendChild(backBtn);

        return screen;
    }

    static attachEventListeners(navigation, state) {
        ScreenHelpers.attachLogoListener(navigation, state);
        ScreenHelpers.attachBackButtonListener(navigation, state);
        const buttons = document.querySelectorAll('[data-answer]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const moneyPaid = e.target.dataset.answer === 'yes';
                state.setAnswer('moneyPaid', moneyPaid);
                navigation.navigateTo('result', { answers: state.answers });
            });
        });
    }
}

class ResultScreen {
    static render(data) {
        const screen = document.createElement('div');
        screen.className = 'screen';
        
        // Logo
        const header = ScreenHelpers.createLogoHeader();
        screen.appendChild(header);
        
        // holt gesetze je nach antworten
        const laws = DecisionLogic.getLaws(data.answers);
        
        //aufbau gesetze
        const lawsHTML = laws.map(law => `
            <div class="law-item">
                <div class="law-title">${law.title}</div>
                <div class="law-description">${law.description}</div>
            </div>
        `).join('');
        
        //aufbau inhalt
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="progress-dots">
                <div class="progress-dot"></div>
                <div class="progress-dot"></div>
                <div class="progress-dot active"></div>
            </div>
            <h2>Rechtliche Einordnung</h2>
            <div class="result-container">
                <h3>Relevante Straftatbestände</h3>
                ${lawsHTML}
            </div>
            <div class="button-group">
                <button class="rounded-button back-button" id="back-button">
                    Zurück
                </button>
                <button class="rounded-button primary" id="restart-button">
                    Neue Prüfung starten
                </button>
            </div>
        `;
        screen.appendChild(content);
        return screen;
    }

    //event listener für neustart und zurück
    static attachEventListeners(navigation, state) {
        ScreenHelpers.attachLogoListener(navigation, state);
        ScreenHelpers.attachBackButtonListener(navigation, state);
        
        const restartButton = document.getElementById('restart-button');
        restartButton.addEventListener('click', () => {
            state.reset(); // Alles zurücksetzen
            navigation.navigateTo('start');
        });
    }
}

// Navigation
class NavigationController {
    constructor(state) {
        this.state = state;
        this.container = document.getElementById('app-content');
    }

    navigateTo(screenName, data = {}, skipHistory = false) {
        const currentScreen = this.container.querySelector('.screen');
        
        // history anlegen, bei zurück wird das geskippt
        if (!skipHistory && screenName !== 'start') {
            this.state.addToHistory(screenName);
        }
        
        //wenn screen da ist, fade out animation, bei start nicht
        if (currentScreen) {
            currentScreen.classList.add('fade-out');
            setTimeout(() => {
                this.renderScreen(screenName, data);
            }, 300);
        } else {
            this.renderScreen(screenName, data);
        }
    }

    renderScreen(screenName, data) {
        this.container.innerHTML = ''; // Alten Content löschen
        this.state.currentScreen = screenName; // Aktuellen Screen merken

        const screenModule = this.getScreenModule(screenName); // Screen klasse holen
        if (screenModule) {
            const screenElement = screenModule.render(data); // Screen HTML generieren
            this.container.appendChild(screenElement); 
            
            // erst einfügen wenn bereit
            setTimeout(() => {
                screenModule.attachEventListeners(this, this.state); // listeners aktivieren
            }, 0);
        }
    }

    getScreenModule(screenName) {
        // alle screens
        const screens = {
            start: StartScreen,
            contentType: ContentTypeScreen,
            aiCheck: AICheckScreen,
            unsureHelp: UnsureHelpScreen,
            emailContent: EmailContentScreen,
            pornographicCheck: PornographicCheckScreen,
            childrenCheck: ChildrenCheckScreen,
            victimVisibleCheck: VictimVisibleCheckScreen,
            audioType: AudioTypeScreen,
            moneyPaid: MoneyPaidScreen,
            result: ResultScreen
        };

        return screens[screenName];
    }
}

// Anwendung
class PandaApp {
    constructor() {
        this.state = new AppState();
        this.navigation = new NavigationController(this.state);
    }

    start() {
        this.navigation.navigateTo('start');
    }
}

// nach laden anzeigen
document.addEventListener('DOMContentLoaded', () => {
    const app = new PandaApp();
    app.start();
});

