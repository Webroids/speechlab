/* Sample data — sourced from Webroids/speechlab @ main */

window.SL_CATEGORIES = {
  business_pitch:        { label: 'Pitch',     color: 'var(--vl-coral)',    bg: 'var(--vl-coral-bg)',    accent: 'var(--vl-coral)' },
  persoenlich_reflexion: { label: 'Reflexion', color: 'var(--vl-rose)',     bg: 'var(--vl-rose-bg)',     accent: 'var(--vl-rose)' },
  smalltalk:             { label: 'Smalltalk', color: 'var(--vl-mint)',     bg: 'var(--vl-mint-bg)',     accent: 'oklch(0.45 0.13 165)' },
  erklaerung_teachback:  { label: 'Erklärung', color: 'var(--vl-ocean)',    bg: 'var(--vl-ocean-bg)',    accent: 'var(--vl-ocean)' },
  streit_position:       { label: 'Debatte',   color: 'var(--vl-lavender)', bg: 'var(--vl-lavender-bg)', accent: 'var(--vl-lavender)' },
  storytelling:          { label: 'Story',     color: 'var(--vl-amber)',    bg: 'var(--vl-amber-bg)',    accent: 'oklch(0.50 0.14 75)' },
};

window.SL_CATEGORY_TIPS = {
  business_pitch:        'Starte mit einer klaren These. Stütz sie mit einem konkreten Beispiel.',
  storytelling:          'Setze die Szene, benenne den Konflikt, lande die Pointe.',
  smalltalk:             'Stelle eine echte Frage — und höre wirklich zu.',
  erklaerung_teachback:  'Erkläre so einfach, dass ein 12-Jähriger es versteht.',
  streit_position:       'Beziehe klar Stellung und räume einen Einwand ein.',
  persoenlich_reflexion: 'Sei konkret: eine Situation, ein Gefühl, eine Erkenntnis.',
};

window.SL_TOPICS = [
  { id: 'bp-09', text: 'Pitch eine Zusammenarbeit an einen Kunden, der sagt: „Wir haben schon eine Agentur."', category: 'business_pitch', difficulty: 'hard' },
  { id: 'pr-01', text: 'Was hat dich diese Woche wirklich beschäftigt — beruflich oder privat?', category: 'persoenlich_reflexion', difficulty: 'easy' },
  { id: 'ss-01', text: 'Erzähle einen peinlichen Moment aus deiner Arbeit — so, dass jemand am Ende lacht.', category: 'storytelling', difficulty: 'medium' },
  { id: 'sp-01', text: 'Remote Work ist langfristig schlechter für die Karriere. Pro oder Contra — wähle eine Seite.', category: 'streit_position', difficulty: 'medium' },
  { id: 'et-03', text: 'Erkläre den Unterschied zwischen UX und UI so, dass ihn eine Bäckerin versteht.', category: 'erklaerung_teachback', difficulty: 'easy' },
  { id: 'st-06', text: 'Du triffst jemanden auf einer Party. Er fragt: „Was machst du so?" — Antworte so, dass er nachfragt.', category: 'smalltalk', difficulty: 'medium' },
];

window.SL_FRAMEWORKS = [
  {
    id: '1-2-3', name: '1-2-3', tagline: 'Immer eine Antwort parat',
    bg: 'var(--vl-coral-bg)', color: 'var(--vl-coral)', glyph: '◆', parts: 3,
    desc: 'Eine Kernaussage, zwei Perspektiven, drei konkrete Punkte. Simpel, aber sofort verständlich.',
    shortExplanation:
      'Jede Antwort hat eine Kernaussage, zwei Perspektiven und drei konkrete Punkte. Simpel, aber sofort verständlich.',
    deepExplanation:
      'Das 1-2-3-Framework nutzt die psychologische Kraft des „Rule of Three“: unser Gehirn erkennt Dreiergruppen als vollständig und überzeugend. Die Kernaussage verankert alles, die zwei Aspekte schaffen Balance ohne Überwältigung, und die drei Punkte liefern genug Detail für Glaubwürdigkeit, ohne zu überfordern.',
    structure: ['1 Kernaussage', '2 Aspekte oder Dimensionen', '3 konkrete Punkte oder Schritte'],
    when:    'Unerwartete Fragen, „Erzähl mir von dir“, Erklärungen auf Knopfdruck, Networking-Gespräche.',
    whenNot: 'Bei sehr emotionalen Gesprächen — dort wirkt Struktur kalt. Auch nicht ideal für kreative Pitches, die Überraschung brauchen.',
    examples: [
      { context: 'Networking: „Was machst du beruflich?“',
        text: 'Ich helfe Unternehmen, online sichtbar zu werden. Es gibt dabei zwei Seiten: die technische — also die Website — und die strategische, also wie sie gefunden werden. Die drei Dinge, die ich anpacke: Auftritt, Geschwindigkeit, Conversion.' },
      { context: 'Vorstellungsgespräch: „Warum wir?“',
        text: 'Aus einem Hauptgrund: ihr seid die einzige Firma, bei der technische Tiefe und kreative Freiheit zusammenkommen. Zwei Aspekte haben mich überzeugt: das Produkt und die Teamkultur. Drei konkrete Dinge: Eigenverantwortung, Remote-first, Fehlerkultur.' },
    ],
    proTips: [
      'Zähle die Punkte laut mit: „Erstens… zweitens… drittens“ — das gibt Orientierung.',
      'Die Kernaussage am Anfang muss allein stehen können. Wenn nicht, ist sie zu komplex.',
    ],
    mistakes: [
      'Mehr als 3 Punkte aufzählen — die Struktur verschwindet sofort.',
      'Punkte ohne Verbindung zur Kernaussage — sie sollen die 1 vertiefen, nicht ersetzen.',
    ],
  },
  {
    id: 'prep', name: 'PREP', tagline: 'Meinungen klar vertreten',
    bg: 'var(--vl-amber-bg)', color: 'oklch(0.55 0.16 70)', glyph: '✶', parts: 4,
    desc: 'Point → Reason → Example → Point. Überzeugend ohne aggressiv.',
    shortExplanation:
      'Point → Reason → Example → Point. Zuerst die Meinung nennen, dann begründen, belegen und wiederholen.',
    deepExplanation:
      'PREP nutzt den Primacy-Recency-Effekt: Menschen erinnern sich am besten an das Erste und das Letzte. Deshalb kommt der Point zweimal. Das Reason ist der Mechanismus, das Example der konkrete Beweis. Wer am Ende den Point wiederholt, klingt nicht defensiv — sondern überzeugt.',
    structure: [
      'Point — deine Hauptaussage klar benennen',
      'Reason — warum du das glaubst (Mechanismus, Wert)',
      'Example — konkretes Beispiel, Zahl oder Story',
      'Point — Hauptaussage nochmals wiederholen',
    ],
    when:    'Meinungen in Meetings, Diskussionen, Interviews, Feedback geben.',
    whenNot: 'Wenn du aktiv zuhören oder explorieren willst. PREP schließt eine Position — gut für Statements, schlecht für offene Gespräche.',
    examples: [
      { context: 'Team-Meeting: „Sollen wir auf remote-first umstellen?“',
        text: 'Ich denke, wir sollten remote-first werden. Der Grund: Produktivität hängt bei uns nicht vom Ort ab, sondern von Fokus und klarer Kommunikation. Letztes Quartal haben wir remote 20% mehr geliefert als im Büro. Also: remote-first ist der logische nächste Schritt.' },
      { context: 'Jobinterview: „Wie sieht die Zukunft der Branche aus?“',
        text: 'Ich glaube, KI wird die Branche nicht ersetzen, sondern beschleunigen. Der Hauptgrund: Vertrauen, Urteilsvermögen und Kreativität im Kontext kann KI nicht liefern. Ich nutze KI täglich, aber die strategischen Entscheidungen treffe weiterhin ich. Die Branche wächst — nur der Job verändert sich.' },
    ],
    proTips: [
      'Der Point am Anfang darf provokant sein — das hält Aufmerksamkeit.',
      'Das Beispiel sollte spezifisch sein: echte Zahlen, echte Namen, echte Zeiten.',
    ],
    mistakes: [
      'Example weglassen — macht die Aussage abstrakt und damit angreifbar.',
      'Point am Ende vergessen — die Aussage wirkt unentschlossen.',
    ],
  },
  {
    id: 'star', name: 'STAR', tagline: 'Berufliche Geschichten überzeugend erzählen',
    bg: 'var(--vl-amber-bg)', color: 'oklch(0.55 0.16 70)', glyph: '★', parts: 4,
    desc: 'Situation → Task → Action → Result. Standard für Interviews.',
    shortExplanation:
      'Situation → Task → Action → Result. Das Standard-Framework für berufliche Beispiele in Interviews und Präsentationen.',
    deepExplanation:
      'STAR zwingt dich zu konkreter Evidenz statt allgemeiner Behauptungen. „Ich bin gut unter Druck“ ist wertlos. „Als unser Server 2 Stunden vor dem Launch zusammenbrach, habe ich X getan und Y erreicht“ ist überzeugend. Der häufigste Fehler: zu viel Situation, zu wenig Action und Result — dabei sind genau die das, was überzeugt.',
    structure: [
      'Situation — Kontext und Hintergrund (kurz halten)',
      'Task — deine spezifische Aufgabe oder Verantwortung',
      'Action — was du konkret getan hast (Hauptteil)',
      'Result — das messbare Ergebnis',
    ],
    when:    'Vorstellungsgespräche, Leistungsgespräche, Case Studies, Projektpräsentationen, Kundengespräche.',
    whenNot: 'Nicht für Meinungsäußerungen oder Zukunftspläne — STAR braucht ein vergangenes Ereignis.',
    examples: [
      { context: 'Vorstellungsgespräch: Druck-Situation',
        text: 'Unser größter Kunde drohte 3 Tage vor dem Launch abzuspringen, weil ein Kernfeature fehlte. Ich war als Projektleiter verantwortlich. Ich habe sofort ein Notfall-Standup einberufen, das Feature in 36 Stunden mit zwei Entwicklern umgesetzt und dem Kunden täglich Fortschritt geschickt. Launch on time, Vertrag um zwei Jahre verlängert.' },
      { context: 'Kundengespräch: komplexes E-Commerce-Projekt',
        text: 'Bei einem Modehändler mit über 3.000 SKUs lag die Checkout-Abbruchrate bei 74%. Wir waren für die komplette technische Migration plus UX verantwortlich. Wir teilten in Phasen auf, testeten parallel und lieferten Zero-Downtime. Abbruchrate sank auf 41%, Umsatz stieg im ersten Quartal um 28%.' },
    ],
    proTips: [
      'Halte Situation und Task zusammen unter 20% der Redezeit — der Zuhörer will die Action hören.',
      'Bereite 5–7 STAR-Stories vor für Leadership, Konflikt, Innovation, Druck und Fehler.',
    ],
    mistakes: [
      'Result vage lassen („Es lief gut“) — der stärkste Teil verschwindet.',
      '„Wir haben“ statt „Ich habe“ — im STAR-Kontext interessiert die eigene Rolle.',
    ],
  },
  {
    id: 'scq', name: 'SCQ', tagline: 'Komplexes klar präsentieren',
    bg: 'var(--vl-lavender-bg)', color: 'var(--vl-lavender)', glyph: '⊕', parts: 3,
    desc: 'Situation → Complication → Question. Der McKinsey-Klassiker für Briefings.',
    shortExplanation:
      'Situation → Complication → Question. Zuerst gemeinsame Ausgangslage etablieren, dann den Konflikt nennen, dann die zentrale Frage stellen, die deine Antwort vorbereitet.',
    deepExplanation:
      'Das SCQ-Framework (aus Barbara Mintos Pyramid Principle) zwingt Sprecher dazu, vor dem Inhalt einen gemeinsamen Kontext zu schaffen. Die Situation ist das, was beide Seiten anerkennen. Die Complication ist die Störung, die Handlung erfordert. Die Question ist das, was der Zuhörer sich nun selbst stellt — und genau die beantwortest du.',
    structure: [
      'Situation — unbestrittener Status quo',
      'Complication — was sich ändert oder stört',
      'Question — die Frage, die der Zuhörer jetzt hat',
    ],
    when:    'Briefings, Strategie-Präsentationen, Vorworte zu komplexen Empfehlungen, Berater-Decks.',
    whenNot: 'Nicht für Smalltalk oder einfache Updates — wirkt sonst aufgeblasen.',
    examples: [
      { context: 'Management-Brief: neue Marktbedingungen',
        text: 'Wir wachsen seit drei Jahren stabil mit 15% pro Jahr (Situation). Im letzten Quartal sind zwei neue Wettbewerber mit aggressiven Preisen eingestiegen (Complication). Wie verteidigen wir unsere Marge ohne in den Preiskampf einzusteigen? (Question)' },
      { context: 'Investor-Update',
        text: 'Wir bedienen heute 200 KMU mit unserem Standardprodukt. Enterprise-Kunden fragen seit März nach Custom-Features, die wir nicht liefern. Sollen wir das Produkt aufteilen, oder ein zweites SKU aufbauen?' },
    ],
    proTips: [
      'Die Situation muss unbestritten sein — wenn der Zuhörer schon hier widerspricht, ist alles weitere verloren.',
      'Formuliere die Question so, wie der Zuhörer sie tatsächlich stellen würde.',
    ],
    mistakes: [
      'Situation und Complication vermischen — dann fehlt die Spannung.',
      'Die Question überspringen — dann wirkt die Lösung willkürlich.',
    ],
  },
  {
    id: 'fab', name: 'FAB', tagline: 'Features als Vorteile verkaufen',
    bg: 'var(--vl-mint-bg)', color: 'oklch(0.50 0.13 165)', glyph: '◇', parts: 3,
    desc: 'Feature → Advantage → Benefit. Aus Spezifikationen wird Nutzen.',
    shortExplanation:
      'Feature → Advantage → Benefit. Übersetzt eine Eigenschaft in einen konkreten Mehrwert für den Zuhörer.',
    deepExplanation:
      'FAB ist das Verkaufsframework, das verhindert, dass du nur „Spec-Sheets“ vorträgst. Das Feature ist objektiv (Was hat es?), der Advantage erklärt warum das besser ist als Alternativen, und der Benefit ist die emotionale oder finanzielle Auswirkung für den Zuhörer. Menschen kaufen Benefits, nicht Features.',
    structure: [
      'Feature — die Eigenschaft (objektiv, technisch)',
      'Advantage — warum diese Eigenschaft besser ist',
      'Benefit — was es für den Zuhörer konkret bedeutet',
    ],
    when:    'Sales-Gespräche, Produktvorstellungen, Pitches, Demos.',
    whenNot: 'Nicht bei rein emotionalen Themen oder wenn der Zuhörer bereits überzeugt ist.',
    examples: [
      { context: 'Auto-Sales',
        text: 'Dieses Modell hat einen 2.0l Hybridmotor (Feature). Das bedeutet 30% weniger Verbrauch als vergleichbare Benziner (Advantage). Für deinen Arbeitsweg sparst du damit rund 1.200 Franken pro Jahr (Benefit).' },
      { context: 'SaaS-Demo',
        text: 'Unser Tool synchronisiert Daten alle 30 Sekunden (Feature). Das heißt, dein Team arbeitet nie mit veralteten Zahlen (Advantage). Das spart euch die typischen „Moment, ich aktualisiere“-Schleifen in jedem Meeting (Benefit).' },
    ],
    proTips: [
      'Der Benefit muss in der Sprache des Zuhörers sein — Zahlen, Zeit, Gefühle, nicht deine Spec.',
      'Pro Feature genau ein Benefit — mehr verwässert.',
    ],
    mistakes: [
      'Bei Feature stehen bleiben — „Wir haben X“ interessiert niemanden.',
      'Generische Benefits wie „Sie sparen Zeit“ — wieviel Zeit? Wann genau?',
    ],
  },
  {
    id: 'hook', name: 'Hook–Story–Offer', tagline: 'Pitches, die nicht wie Pitches klingen',
    bg: 'var(--vl-ocean-bg)', color: 'var(--vl-ocean)', glyph: '◐', parts: 3,
    desc: 'Aufmerksamkeit haken, kurze Story, dann Angebot — immer in dieser Reihenfolge.',
    shortExplanation:
      'Hook → Story → Offer. Erst die Aufmerksamkeit haken, dann eine kurze Geschichte erzählen, dann das Angebot.',
    deepExplanation:
      'Menschen kaufen nicht, wenn sie das Produkt verstehen. Sie kaufen, wenn sie sich in der Geschichte wiedererkennen. Der Hook hat eine Aufgabe: stoppen. Die Story ist die Geschichte des Problems, das der Zuhörer kennt. Der Offer kommt zuletzt — mit Kontext klingt er wie Hilfe, ohne Kontext wie Werbung.',
    structure: [
      'Hook — Aufmerksamkeit sofort gewinnen: Frage, Zahl, Provokation',
      'Story — kurze Geschichte des Problems (max. 3 Sätze)',
      'Offer — deine Lösung und der konkrete nächste Schritt',
    ],
    when:    'Elevator Pitches, Sales-Gespräche, Social-Media-Videos, Kaltakquise, Konferenz-Vorstellungen.',
    whenNot: 'Nicht für sachliche Berichte oder interne Team-Kommunikation — Storytelling wirkt dort deplatziert.',
    examples: [
      { context: 'Elevator Pitch',
        text: 'Was wäre, wenn dein bester Verkäufer nie schläft, nie krank wird und nie einen Follow-up vergisst? Ich habe 5 Jahre als Sales Manager gearbeitet und gesehen, wie 80% des Umsatzes durch schlechtes Follow-up-Management verloren geht. Wir haben SalesBot gebaut — KI-Follow-ups, personalisiert auf jeden Kunden. Teste es 14 Tage kostenlos.' },
      { context: 'Kaltakquise-Email',
        text: 'Ihre Website lädt auf Mobilgeräten in 8 Sekunden. Das kostet Sie jeden Monat über 40 Anfragen. Wir haben letzte Woche eine ähnliche Seite auf 1.8 Sekunden gebracht, Anfragen stiegen in 30 Tagen um 60%. Haben Sie 15 Minuten für eine schnelle Analyse?' },
    ],
    proTips: [
      'Der Hook muss in 5 Sekunden funktionieren — sonst war er nicht stark genug.',
      'Die Story darf eigene Schwäche enthalten — das macht sie nahbar.',
    ],
    mistakes: [
      'Hook zu generisch („Hast du je das Gefühl…“) — muss sofort spezifisch sein.',
      'Offer ohne CTA — „Das ist mein Produkt“ ist kein Offer, „Teste es heute“ schon.',
    ],
  },
];

window.SL_RECORDINGS = [
  { id: 'r1', topic: 'Erkläre Webroids in 60 Sekunden einem potenziellen Kunden.', category: 'business_pitch', duration: 62, score: 82, ago: 'vor 2 Stunden', framework: 'prep' },
  { id: 'r2', topic: 'Erzähle einen peinlichen Moment aus deiner Arbeit.',         category: 'storytelling',   duration: 124, score: 68, ago: 'gestern' },
  { id: 'r3', topic: 'Remote Work ist langfristig schlechter für die Karriere.',   category: 'streit_position', duration: 180, score: 74, ago: 'vor 3 Tagen', framework: 'prep' },
  { id: 'r4', topic: 'Was hat dich diese Woche beschäftigt?',                       category: 'persoenlich_reflexion', duration: 88, score: 79, ago: 'vor 4 Tagen' },
  { id: 'r5', topic: 'Erkläre A/B-Testing so, dass ein Marketingleiter sofort versteht, warum er es braucht.', category: 'erklaerung_teachback', duration: 95, score: 71, ago: 'vor 5 Tagen' },
  { id: 'r6', topic: 'Pitch eine Zusammenarbeit an einen Kunden, der sagt: „Wir haben schon eine Agentur."', category: 'business_pitch', duration: 60, score: 48, ago: 'vor einer Woche' },
];

window.SL_FEEDBACK = {
  r1: {
    overall: 82,
    summary: 'Stark gestartet, klare Struktur — die Pointe sitzt. Mehr Druck auf das Zahlenargument am Ende.',
    sub: [
      { label: 'Struktur',   score: 8.6, comment: 'PREP klar erkennbar. Reason kurz, Example konkret.' },
      { label: 'Klarheit',   score: 8.0, comment: 'Sätze etwas lang. Mehr Punkte, weniger Kommas.' },
      { label: 'Delivery',   score: 7.8, comment: '142 WPM — gutes Tempo. 2 Lautfüller.' },
      { label: 'Engagement', score: 8.4, comment: 'Hook im ersten Satz. Pointe sitzt.' },
    ],
    strengths: [
      'Du nennst eine Zahl im ersten Satz — das hakt sofort.',
      'Die Beispielfirma ist namentlich genannt, nicht generisch.',
      'Du wiederholst den Point am Ende — PREP wird zu Ende gebracht.',
    ],
    improvements: [
      { issue: 'Zu viel Hedging im Reason-Teil',
        example: 'Ich denke vielleicht, dass es eigentlich relativ klar ist…',
        better: '„Der Grund ist: Wir liefern in 6 Wochen, nicht 6 Monaten."' },
      { issue: 'Pointe am Schluss verblasst',
        example: 'Ja, also, deshalb sollten Sie uns wählen, glaube ich.',
        better: '„Deshalb sollten Sie uns wählen — keine andere Agentur in DACH liefert das."' },
    ],
    metrics: { wpm: 142, filler: 5, hedging: 3, longPause: 1, latency: 1.4, words: 187 },
    nextDrill: 'Erkläre den Unterschied zwischen UX und UI so, dass ihn eine Bäckerin versteht.',
  },
};

window.SL_RECENT_SCORES = [62, 65, 68, 70, 67, 71, 74, 76, 79, 82];
window.SL_WPM_SERIES   = [118, 124, 132, 128, 145, 150, 148, 142];
window.SL_FILLER_SERIES = [4.8, 4.2, 3.9, 3.6, 3.1, 2.6, 2.4, 2.1];
window.SL_DAYS = ['Mo','Di','Mi','Do','Fr','Sa','So','Mo'];

window.SL_TOP_FILLERS = [
  { word: 'also',    count: 23 },
  { word: 'halt',    count: 18 },
  { word: 'ähm',     count: 14 },
  { word: 'eigentlich', count: 9 },
  { word: 'irgendwie', count: 6 },
];

window.SL_SAMPLE_TRANSCRIPT = [
  { w: 'Also', cat: null },          { w: 'ich', cat: null },              { w: 'ähm', cat: 'nonword' },
  { w: 'helfe', cat: null },          { w: 'kleinen', cat: null },         { w: 'Firmen', cat: null },
  { w: 'dabei,', cat: null },         { w: 'online', cat: null },          { w: 'halt', cat: 'filler' },
  { w: 'richtig', cat: null },        { w: 'sichtbar', cat: null },        { w: 'zu', cat: null },
  { w: 'werden', cat: null },         { w: '—', cat: null },                { w: 'ich', cat: 'soft' },
  { w: 'denke', cat: 'soft' },        { w: 'die', cat: null },             { w: 'meisten', cat: null },
  { w: 'unterschätzen,', cat: null }, { w: 'äh', cat: 'nonword' },         { w: 'wie', cat: null },
  { w: 'viel', cat: null },           { w: 'Umsatz', cat: null },          { w: 'also', cat: 'filler' },
  { w: 'an', cat: null },             { w: 'einer', cat: null },           { w: 'schlechten', cat: null },
  { w: 'Website', cat: null },        { w: 'hängt.', cat: null },
];
