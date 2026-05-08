export interface FrameworkExample {
  context: string
  text: string
}

export interface Framework {
  id: string
  name: string
  tagline: string
  shortExplanation: string
  deepExplanation: string
  structure: string[]
  when: string
  whenNot: string
  examples: FrameworkExample[]
  proTips: string[]
  mistakes: string[]
}

export const FRAMEWORKS: Framework[] = [
  {
    id: '1-2-3',
    name: '1-2-3',
    tagline: 'Immer eine Antwort parat',
    shortExplanation:
      'Jede Antwort hat eine Kernaussage, zwei Perspektiven und drei konkrete Punkte. Simpel, aber sofort verständlich.',
    deepExplanation:
      'Das 1-2-3-Framework nutzt die psychologische Kraft des "Rule of Three": Unser Gehirn erkennt Dreiergruppen als vollständig und überzeugend — von "Veni, vidi, vici" bis zu Produktkategorien im Supermarkt. Die Kernaussage (1) verankert alles, die zwei Aspekte (2) schaffen Balance ohne Überwältigung, und die drei Punkte (3) liefern genug Detail für Glaubwürdigkeit ohne zu überfordern. Cognitive Load-Forschung zeigt: Menschen können 3–4 Chunks gleichzeitig im Arbeitsgedächtnis halten. Mehr als drei Argumente verursachen "Argument Dilution" — jeder zusätzliche Punkt schwächt die anderen. Das Framework funktioniert auch deshalb, weil es dem Sprecher Sicherheit gibt: Egal wie unerwartet eine Frage ist, die Struktur existiert immer.',
    structure: ['1 Kernaussage', '2 Aspekte oder Dimensionen', '3 konkrete Punkte oder Schritte'],
    when: 'Unerwartete Fragen, "Erzähl mir von dir", Erklärungen auf Knopfdruck, Networking-Gespräche',
    whenNot:
      'Bei sehr emotionalen Gesprächen (Kondolenz, Konfliktlösung) — dort wirkt Struktur kalt. Auch nicht ideal für kreative Pitches, die Überraschungsmomente brauchen.',
    examples: [
      {
        context: 'Networking-Event: "Was machst du beruflich?"',
        text: 'Ich helfe Unternehmen, online sichtbar zu werden. Es gibt dabei zwei Seiten: die technische — also die Website — und die strategische — also wie sie gefunden werden. Die drei Dinge, die ich dabei immer anpacke: Auftritt, Geschwindigkeit und Conversion.',
      },
      {
        context: 'Investor-Meeting: "Wie funktioniert euer Geschäftsmodell?"',
        text: 'Unser Modell hat einen Kern: wiederkehrende Einnahmen. Es gibt zwei Säulen: einmalige Projektarbeit und monatliche Retainer. Und drei Umsatzquellen: Webdesign, SEO-Pakete und digitale Strategie.',
      },
      {
        context: 'Elterngespräch: "Wie läuft die Schule?"',
        text: 'Insgesamt gut — das ist mein ehrlicher Eindruck. Es gibt zwei Bereiche: was gut läuft, und was wir verbessern können. Die drei konkreten Dinge für dieses Quartal: Mathematik intensivieren, Lesezeit erhöhen, und weniger Ablenkung am Abend.',
      },
      {
        context: 'Vorstellungsgespräch: "Warum wir?"',
        text: 'Aus einem Hauptgrund: Ihr seid die einzige Firma, bei der die technische Tiefe und die kreative Freiheit zusammenkommen. Zwei Aspekte haben mich überzeugt: das Produkt selbst und was ich über die Teamkultur gehört habe. Drei konkrete Dinge aus eurer Stellenausschreibung haben mich angesprochen: die Eigenverantwortung, die remote-first-Haltung und die Art, wie ihr über Fehlerkultur sprecht.',
      },
      {
        context: 'Meeting: Chef fragt spontan "Was hältst du von dem Vorschlag?"',
        text: 'Ich bin grundsätzlich dafür. Es gibt zwei Seiten: die Chance ist real, aber das Risiko ist es auch. Drei Punkte sollten wir vorher klären: Budget, Timeline und wer die Verantwortung trägt.',
      },
    ],
    proTips: [
      'Zähle die Punkte laut mit: "Erstens... Zweitens... Drittens..." — das gibt dem Zuhörer Orientierung.',
      'Die Kernaussage am Anfang muss allein stehen können. Wenn sie das nicht tut, ist sie zu komplex.',
      'Übe es als "Notfall-Antwort": Wenn du gar keine Struktur hast, sag innerlich "Was ist der eine Kern? Welche zwei Seiten gibt es? Was sind drei Punkte?" — 5 Sekunden Pause sind normal.',
    ],
    mistakes: [
      'Mehr als 3 Punkte aufzählen → verliert sofort die Struktur',
      'Punkte ohne Verbindung zur Kernaussage — sie sollen die 1 vertiefen, nicht ersetzen',
      'Die 2 Aspekte weglassen und direkt zu den 3 Punkten springen — dann fehlt die Tiefe',
    ],
  },

  {
    id: 'PREP',
    name: 'PREP',
    tagline: 'Meinungen klar vertreten',
    shortExplanation:
      'Point → Reason → Example → Point: Zuerst die Meinung nennen, dann begründen, belegen und wiederholen. Überzeugend ohne aggressiv zu wirken.',
    deepExplanation:
      'PREP ist das effektivste Framework für Meinungsäußerungen, weil es das psychologische Prinzip des "Primacy-Recency-Effekts" nutzt: Menschen erinnern sich am besten an das Erste und das Letzte, was sie hören. Deshalb kommt der Point zweimal — am Anfang und am Ende. Der häufigste Kommunikationsfehler in Diskussionen ist, eine Meinung als letzte Pointe zu nennen (nach langer Begründung) — dann ist das Gehirn des Zuhörers bereits in der Defensive oder abgelenkt. PREP zwingt dich, sofort klar zu sein. Das "Reason" ist das Herzstück: Es sollte nicht nur "weil es gut ist" sein, sondern einen echten Mechanismus oder Wert ansprechen. Das "Example" ist der Glaubwürdigkeitsanker — abstrakte Meinungen werden erst durch konkrete Beispiele real. Rhetorisch schützt PREP auch: Wenn du am Ende nochmal den Point wiederholst, klingt die Aussage nicht defensiv, sondern wie jemand, der wirklich von seiner Meinung überzeugt ist.',
    structure: [
      'Point — deine Hauptaussage klar benennen',
      'Reason — warum du das glaubst (Mechanismus, Wert)',
      'Example — konkretes Beispiel, Datum, Zahl oder Story',
      'Point — Hauptaussage nochmals wiederholen',
    ],
    when: 'Meinungen in Meetings, Diskussionen, Interviews ("Was ist deine Meinung zu...?"), Feedback geben',
    whenNot:
      'Wenn du aktiv zuhören oder explorieren willst. PREP schließt eine Position — gut für Statements, schlecht für offene Gespräche.',
    examples: [
      {
        context: 'Team-Meeting: "Sollen wir auf remote-first umstellen?"',
        text: 'Ich denke, wir sollten remote-first werden. Der Grund: Produktivität hängt bei uns nicht vom Ort ab, sondern von Fokus und klarer Kommunikation. Letztes Quartal haben wir in den zwei remote-Monaten 20% mehr geliefert als im Büro. Also: remote-first ist der logische nächste Schritt.',
      },
      {
        context: 'Familiendiskussion: "Sollte man Kinder früh mit Technologie aufwachsen lassen?"',
        text: 'Ich bin der Meinung: Ja — aber mit klaren Grenzen. Der Grund ist, dass digitale Kompetenz heute genauso wichtig ist wie Lesen und Schreiben. Mein Neffe nutzt seit dem 7. Lebensjahr ein Tablet für Lernspiele und hat heute in Mathe und Naturwissenschaften überdurchschnittliche Noten. Deshalb: früh anfangen, aber strukturiert.',
      },
      {
        context: 'Jobinterview: "Was denkst du, wie sieht die Zukunft dieser Branche aus?"',
        text: 'Ich glaube, dass KI die Branche nicht ersetzen, sondern beschleunigen wird. Der Hauptgrund: Das, was Kunden wirklich zahlen — Vertrauen, Urteilsvermögen, Kreativität im Kontext — kann KI nicht liefern. Ich sehe das bei meiner eigenen Arbeit: Ich nutze KI täglich, aber die strategischen Entscheidungen, die wirklich Geld bewegen, treffe immer noch ich. Also: Die Branche wächst, aber der Job verändert sich.',
      },
      {
        context: 'Social Media / Video-Intro: "Was ist deine Meinung zu Branding?"',
        text: 'Branding ist nicht Luxus, sondern Überleben. Wer kein klares Bild von sich hat, wird durch den billigsten Anbieter ersetzt. Ich habe das bei dutzenden Kunden gesehen: Die mit einem starken Brand können Preise halten, die anderen müssen ständig Rabatt geben. Kurz: Branding ist das einzige, was dich langfristig aus dem Preiskampf heraushält.',
      },
    ],
    proTips: [
      'Der Point am Anfang darf provokant sein — das erzeugt Spannung und hält die Aufmerksamkeit.',
      'Das Beispiel sollte spezifisch sein: echte Zahlen, echte Namen, echte Zeiten. "Ein Kunde von mir" ist schwächer als "Mein Kunde Müller GmbH im März 2024".',
      'Wenn du nervös bist, hilft PREP enorm — du weißt immer, wo du gerade bist in der Struktur.',
    ],
    mistakes: [
      'Example weglassen — macht die Aussage abstrakt und damit angreifbar',
      'Point am Ende vergessen — dann wirkt die Aussage unentschlossen',
      'Reason und Example verwechseln — der Reason ist der Mechanismus ("warum"), das Example ist der Beweis ("zeigt sich darin, dass")',
    ],
  },

  {
    id: 'STAR',
    name: 'STAR',
    tagline: 'Berufliche Geschichten überzeugend erzählen',
    shortExplanation:
      'Situation → Task → Action → Result: Das Standard-Framework für berufliche Beispiele in Interviews und Präsentationen.',
    deepExplanation:
      'STAR ist das meistgenutzte Behavioral Interview Framework aus gutem Grund: Es zwingt den Sprecher dazu, konkrete Evidenz statt allgemeiner Behauptungen zu liefern. "Ich bin gut unter Druck" ist wertlos. "Als unser Server 2 Stunden vor dem Launch zusammenbrach, habe ich X getan und Y erreicht" ist überzeugend. Die psychologische Stärke liegt in der narrativen Struktur: Unser Gehirn ist evolutionär auf Geschichten ausgerichtet — wir erinnern uns 22x besser an Informationen in Story-Form als an Fakten. Die Situation schafft Kontext (ohne Kontext ist Handlung bedeutungslos), die Task macht die persönliche Verantwortung klar, die Action ist der eigentliche Beweis der Kompetenz, und das Result verankert die Glaubwürdigkeit mit einem messbaren Outcome. Der häufigste Fehler: Menschen verbringen 70% der Zeit bei Situation und Task, und kommen kaum zu Action und Result. Das ist genau umgekehrt — Action und Result sind das, was überzeugt.',
    structure: [
      'Situation — Kontext und Hintergrund (kurz halten)',
      'Task — deine spezifische Aufgabe oder Verantwortung',
      'Action — was du konkret getan hast (Hauptteil)',
      'Result — das messbare Ergebnis',
    ],
    when: 'Vorstellungsgespräche, Leistungsgespräche, Case Studies, Projektpräsentationen, Kundengespräche',
    whenNot:
      'Nicht für Meinungsäußerungen oder Zukunftspläne — STAR braucht ein vergangenes Ereignis. Für hypothetische Fragen ("Was würdest du tun wenn...") besser PREP oder Problem-Cause-Solution nutzen.',
    examples: [
      {
        context: 'Vorstellungsgespräch: "Erzählen Sie von einer Situation, in der Sie unter Druck gearbeitet haben."',
        text: 'Unser größter Kunde drohte 3 Tage vor dem Launch abzuspringen, weil ein Kernfeature fehlte. Ich war als Projektleiter verantwortlich — sowohl für das Ergebnis als auch für die Kommunikation. Ich habe sofort ein Notfall-Standup einberufen, das Feature in 36 Stunden mit zwei Entwicklern umgesetzt und dem Kunden täglich einen Fortschrittsbericht geschickt. Das Ergebnis: Launch on time, Kunde hat den Vertrag um zwei Jahre verlängert und uns drei Empfehlungen gegeben.',
      },
      {
        context: 'Kundengespräch: "Habt ihr das schon mal gemacht?" (komplexes E-Commerce-Projekt)',
        text: 'Ja — bei einem Modehändler mit über 3.000 SKUs. Die Herausforderung war, dass das bestehende System keine Filterfunktionen hatte und die Abbruchrate beim Checkout bei 74% lag. Wir waren verantwortlich für die komplette technische Migration plus UX-Neugestaltung. Wir haben die Migration in Phasen aufgeteilt, parallel getestet und ein Zero-Downtime-Deployment geliefert. Das Ergebnis: Checkout-Abbruchrate sank auf 41%, Umsatz stieg im ersten Quartal um 28%.',
      },
      {
        context: 'Team-Retro: "Was hast du aus dem letzten Quartal gelernt?"',
        text: 'Wir hatten ein Projekt, das dreimal im Scope geändert wurde. Meine Aufgabe war, den Kunden trotzdem im Budget zu halten. Ich habe einen formalisierten Change-Request-Prozess eingeführt, den ich mit dem Kunden abgestimmt hatte — jede Scope-Änderung wurde dokumentiert und bepreist. Das Ergebnis: Kein einziges Gespräch über "war das inbegriffen" mehr — und das Projekt hat am Ende 15% mehr Marge als geplant.',
      },
      {
        context: 'Networking: "Was macht ihr eigentlich konkret, wenn ihr für eine Firma die Website neu baut?"',
        text: 'Beim letzten Relaunch einer Anwaltskanzlei hatten sie das Problem: Die alte Site kam in Google gar nicht vor. Wir haben eine vollständige technische und inhaltliche Analyse gemacht und herausgefunden, dass 80% des Problems auf duplicate content und fehlende Meta-Struktur zurückging. Wir haben die Site in 6 Wochen neu aufgesetzt, SEO-Architektur von Grund auf neu gebaut und ein Content-System eingeführt, das das Team selbst pflegen kann. Sechs Monate später: organischer Traffic plus 340%, Anfragen aus dem Web plus 2 pro Woche.',
      },
    ],
    proTips: [
      'Halte Situation und Task zusammen unter 20% der Redezeit — der Zuhörer will die Action hören.',
      'Das Result sollte eine Zahl enthalten, wenn irgend möglich. Wenn keine Zahl existiert, beschreibe ein qualitatives Outcome: "Der Kunde hat uns danach aktiv weiterempfohlen."',
      'Bereite 5–7 STAR-Stories vor, die du für verschiedene Kompetenzen (Leadership, Konflikt, Innovation, Druck, Fehler) nutzen kannst. Die meisten Fragen lassen sich damit beantworten.',
    ],
    mistakes: [
      'Result vage lassen ("Es lief gut", "Der Kunde war zufrieden") — das lässt den stärksten Teil verschwinden',
      'Action zu kurz — genau dort liegt die eigentliche Kompetenz, nicht in der Situation',
      '"Wir haben" statt "Ich habe" — im STAR-Kontext interessiert die eigene Rolle',
    ],
  },

  {
    id: 'PEEL',
    name: 'PEEL',
    tagline: 'Längere Argumente wasserdicht machen',
    shortExplanation:
      'Point → Evidence → Explanation → Link: Nicht nur behaupten, sondern beweisen und zur Frage zurückführen.',
    deepExplanation:
      'PEEL stammt aus der akademischen Schreiblehre, funktioniert aber genauso stark in gesprochener Kommunikation — besonders in Situationen, in denen Glaubwürdigkeit entscheidend ist. Der entscheidende Unterschied zu PREP: Während PREP auf persönlichen Überzeugungen basiert, verlangt PEEL externe Evidence. Das schützt gegen die häufigste Schwäche von Argumenten: "begging the question" — eine These durch sich selbst zu belegen. Der "Link" am Ende ist oft der vergessene, aber wichtigste Teil: Ohne ihn hängt das Argument in der Luft. "KI verändert Jobs" ist eine These. "Deshalb sollten wir X tun" ist ein Argument. Rhetorisch ist PEEL ideal für Situationen, in denen du angezweifelt werden könntest — der Evidence-First-Approach nimmt dem Gegner die Möglichkeit, deine Meinung als subjektiv abzutun.',
    structure: [
      'Point — die Hauptaussage oder These',
      'Evidence — externe Belege: Zahlen, Studien, Fakten, Quellen',
      'Explanation — was die Evidence bedeutet und warum sie die These stützt',
      'Link — Verbindung zur ursprünglichen Frage oder Empfehlung',
    ],
    when: 'Längere Präsentationen, Berichte, Diskussionen mit Skepsis, wenn du Entscheidungsträger überzeugen musst',
    whenNot:
      'Nicht für schnelle Smalltalk-Meinungen oder emotionale Gespräche. Bei kurzem Zeitfenster (< 60 Sekunden) lieber PREP.',
    examples: [
      {
        context: 'Präsentation vor Geschäftsführung: "Warum sollten wir in SEO investieren?"',
        text: 'SEO liefert den besten ROI unter allen digitalen Kanälen. Laut einer HubSpot-Studie von 2024 konvertiert organischer Traffic 6x besser als paid. Das bedeutet für uns: Jeder Franken, den wir in SEO investieren, arbeitet langfristig weiter, während Ads sofort stoppen wenn das Budget weg ist. Deshalb empfehle ich, 30% des Digitalmarketingbudgets von Ads auf SEO umzuverteilen.',
      },
      {
        context: 'Diskussion mit Kollegen: "Brauchen wir wirklich ein neues CRM?"',
        text: 'Ja, wir brauchen eines. Unser aktuelles System hat letztes Quartal 12 dokumentierte Follow-up-Fehler verursacht, davon drei mit Kundenverlust. Das zeigt: Die manuelle Nachverfolgung funktioniert bei unserem jetzigen Volumen schlicht nicht mehr. Deshalb sollten wir spätestens im Q3 umsteigen, bevor wir weiter wachsen.',
      },
      {
        context: 'Elterndiskussion: "Sollten Kinder Taschenrechner in der Schule nutzen dürfen?"',
        text: 'Ich bin dafür. Eine Längsschnittstudie über 10 Jahre hat gezeigt, dass Schüler, die früh mit Hilfsmitteln arbeiten dürfen, besseres konzeptionelles Verständnis entwickeln — weil sie sich auf das Warum statt das Rechnen konzentrieren können. Das heißt konkret: Das Verbot schützt nicht vor Dummheit, sondern blockiert tieferes Denken. Deshalb sollte man Taschenrechner erlauben, aber das konzeptionelle Verständnis separat prüfen.',
      },
      {
        context: 'Email an Chef: "Ich brauche einen Remote-Tag pro Woche"',
        text: 'Ich bin überzeugt, dass ein fester Remote-Tag meine Leistung steigert. Studien der Universität Stanford zeigen, dass fokussierte Arbeit von zu Hause die Output-Qualität um 13% erhöht. In meinem Fall bedeutet das konkret: tiefe Arbeit an Konzepten und Berichten, die Stille brauchen. Mein Vorschlag daher: Wir probieren Dienstag remote für 4 Wochen und messen das anhand unserer Projektfortschritte.',
      },
    ],
    proTips: [
      'Die Evidence muss nicht immer aus Studien kommen — auch interne Zahlen, Kundenfeedback oder klare Analogien funktionieren.',
      'Nenne die Quelle kurz: "Laut McKinsey..." oder "Interne Daten zeigen..." — das reicht für Glaubwürdigkeit.',
      'Der Link muss als Handlungsempfehlung enden: "Deshalb empfehle ich..." oder "Das bedeutet für uns..."',
    ],
    mistakes: [
      'Evidence ohne Quellenangabe — wirkt wie eine erfundene Zahl',
      'Link vergessen — das Argument bleibt in der Luft und hat keine Konsequenz',
      'Evidence und Explanation verwechseln — Evidence ist der Fakt, Explanation ist seine Bedeutung',
    ],
  },

  {
    id: 'past-present-future',
    name: 'Past–Present–Future',
    tagline: 'Updates und Briefings in Minuten',
    shortExplanation:
      'Wo waren wir → Wo stehen wir → Wo gehen wir hin. Das schnellste Framework für Status-Updates und Briefings.',
    deepExplanation:
      'Past–Present–Future nutzt die natürlichste kognitive Zeitlinie des Menschen. Unser Gehirn verarbeitet zeitliche Abläufe mühelos — weil das Denken in Kausalität (Vergangenheit erklärt Gegenwart, Gegenwart erklärt Zukunft) tief in unserer Neurobiologie verankert ist. Für Business-Kommunikation hat das einen entscheidenden Vorteil: Der Zuhörer muss keine mentale Energie darauf verwenden, den Kontext zu rekonstruieren — er wird durch die Zeit geführt. Die häufige Falle ist, zu lange bei der Vergangenheit zu bleiben. Die Vergangenheit ist Kontext, kein Hauptthema. Present ist der Orientierungspunkt, Future ist das Wichtigste: Was kommt als nächstes? Besonders in Investor-Updates und Management-Briefings wird der Zukunftsteil am stärksten bewertet. Ein starkes "Future" nennt konkreten Zeitraum, klare Kennzahl und nächsten Schritt — nicht "wir werden weitermachen".',
    structure: [
      'Past — wo waren wir, was ist passiert (kurz)',
      'Present — wo stehen wir jetzt, aktuelle Kennzahlen',
      'Future — wohin gehen wir, mit Zeitraum und Ziel',
    ],
    when: 'Wochen-/Monatsupdates, Projektreviews, Briefings für neue Teammitglieder, Investorupdates',
    whenNot:
      'Nicht für rein zukunftsorientierte Pitches (kein relevantes Past) oder für tiefe analytische Diskussionen.',
    examples: [
      {
        context: 'Weekly Stand-up: Projekt-Update',
        text: 'Letzte Woche haben wir das Design-Phase abgeschlossen und Kundenfeedback eingeholt. Aktuell sind wir in der Entwicklungsphase — Backend zu 60%, Frontend zu 30%. Bis Freitag planen wir den ersten internen Testlauf.',
      },
      {
        context: 'Investor-Update: Monatlicher Newsletter',
        text: 'Im Q1 haben wir 3 neue Enterprise-Kunden ongeboardet und unser Produkt um 4 Features erweitert. Aktuell liegen wir bei €42k MRR und einem NPS von 67. In Q2 fokussieren wir uns auf Expansion bestehender Accounts — Ziel: €60k MRR bis Ende Juni.',
      },
      {
        context: 'Familien-Gespräch: "Wie läuft das Studium?"',
        text: 'Letztes Semester war ehrlich gesagt schwierig — ich habe eine Prüfung nicht bestanden. Jetzt stehe ich wieder gut da, drei Prüfungen sind bestanden, eine steht noch aus. Im nächsten Semester fokussiere ich mich auf meine Bachelorarbeit und will das Thema bis Oktober festlegen.',
      },
      {
        context: 'Onboarding: Neues Teammitglied begrüßen',
        text: 'Wir haben das Unternehmen vor 4 Jahren gegründet, damals zu zweit aus einer Einzimmerwohnung. Heute sind wir ein 8-köpfiges Team mit 30 aktiven Kunden. In den nächsten 12 Monaten wollen wir in die DACH-Region expandieren und suchen genau dafür Menschen wie dich.',
      },
    ],
    proTips: [
      'Das Past so kurz wie möglich: 1–2 Sätze genügen meistens für Kontext.',
      'Das Future braucht immer einen Zeitraum: "bis Ende Monat", "in 6 Monaten", "bis Q3". Ohne Zeitangabe klingt es wie eine Wunschliste.',
      'Bei schlechten News: Erst die ehrliche Gegenwart zeigen, dann konkrete Zukunftsmassnahmen — das signalisiert Kontrolle und Handlungsfähigkeit.',
    ],
    mistakes: [
      'Past zu lange — die meisten Zuhörer kennen den Hintergrund schon',
      'Future ohne konkreten Zeitraum — klingt nach leeren Versprechen',
      'Present überspringen — dann fehlt dem Zuhörer der aktuelle Orientierungspunkt',
    ],
  },

  {
    id: 'problem-cause-solution',
    name: 'Problem–Cause–Solution',
    tagline: 'Probleme klar kommunizieren, Lösungen überzeugen',
    shortExplanation:
      'Zuerst das Problem benennen, dann die Ursache erklären, dann die Lösung präsentieren. Erst verstehen, dann handeln.',
    deepExplanation:
      'Problem–Cause–Solution ist das analytische Denk-Framework schlechthin. Seine Stärke liegt in der erzwungenen Kausallogik: Die meisten Kommunikationsfehler passieren, wenn Lösungen ohne Ursachenanalyse präsentiert werden — "Wir sollten mehr posten" ohne zu erklären, warum das Engagement gerade schlecht ist. Das Framework kommt aus der Medizin (Symptom → Diagnose → Behandlung) und der Unternehmensberatung (Issue → Root Cause → Recommendation). Psychologisch aktiviert es beim Zuhörer das "Problem Awareness"-Prinzip: Menschen sind viel empfänglicher für Lösungen, wenn sie zuerst das Problem als real und dringend anerkannt haben. Die Cause ist der häufig unterschätzte Teil — wer die Ursache klar nennt, beweist Tiefe des Verständnisses und schafft Vertrauen in die Lösung. Eine Lösung ohne Ursache wirkt zufällig; eine Lösung mit Ursache wirkt gezielt und kompetent.',
    structure: [
      'Problem — was ist falsch, mit konkreter Auswirkung',
      'Cause — warum ist es falsch (Root Cause, nicht Symptom)',
      'Solution — wie wir es lösen, mit Zeitrahmen wenn möglich',
    ],
    when: 'Kundenpitches, Troubleshooting-Gespräche, Empfehlungen an Vorgesetzte, Retrospektiven',
    whenNot:
      'Nicht bei rein positiven Präsentationen oder wenn die Lösung klar ist und die Ursache nicht diskutiert werden muss.',
    examples: [
      {
        context: 'Kundenpitch: Website-Audit-Gespräch',
        text: 'Ihre Website verliert gerade 68% aller Besucher, bevor sie die Produktseite sehen. Der Grund: Die Seite braucht auf Mobilgeräten über 6 Sekunden zum Laden — jede Sekunde über 3 Sekunden kostet 7% Conversions. Die Lösung: Wir optimieren die Bildkompression, implementieren Lazy Loading und migrieren auf ein schnelleres Hosting. Implementierungszeit: 2 Wochen. Erwartete Ladezeitverbesserung: unter 2 Sekunden.',
      },
      {
        context: 'Arzt erklärt einem Patienten die Diagnose',
        text: 'Sie haben Schmerzen im Rücken, besonders beim langen Sitzen — das ist das Problem. Die Ursache ist eine leichte Bandscheibenvorwölbung, kombiniert mit geschwächter Rumpfmuskulatur, die die Wirbelsäule nicht ausreichend stützt. Die Lösung: Ein gezieltes Physiotherapie-Programm über 8 Wochen, ergänzt durch eine Anpassung Ihres Bürostuhls.',
      },
      {
        context: 'Team-Meeting: Warum sind unsere Deadlines immer zu knapp?',
        text: 'Wir verpassen seit drei Quartalen kontinuierlich unsere Projekt-Deadlines um durchschnittlich 2 Wochen. Die Hauptursache: Wir planen ohne Buffer für unvorhergesehene Anforderungen — und jedes Projekt bringt sie mit. Die Lösung: Ab sofort planen wir 20% Puffer pro Phase ein und führen ein wöchentliches Risiko-Standup ein.',
      },
      {
        context: 'Elterngespräch mit Lehrerin: Schüler lernt schlecht',
        text: 'Ihr Kind zeigt in den letzten zwei Monaten deutlich schlechtere Ergebnisse — das macht uns Sorgen. Nach meiner Beobachtung liegt das hauptsächlich an Konzentrationsschwierigkeiten in der ersten Stunde, nicht an mangelndem Können. Mein Vorschlag: Wir setzen ihn in der ersten Stunde in die vordere Reihe und geben ihm etwas konkretere Einstiegsaufgaben, damit er schneller in den Flow kommt.',
      },
    ],
    proTips: [
      'Nenne beim Problem immer die Auswirkung: Nicht "die Website ist langsam", sondern "die Website ist langsam — das kostet euch täglich 40 potenzielle Anfragen".',
      'Die Cause ist dein Expertenwissen. Wenn du sie klar nennen kannst, wirst du sofort als kompetent wahrgenommen.',
      'Wenn du die Cause nicht kennst: Sag "Die genaue Ursache müssen wir noch analysieren — aber meine erste Hypothese ist..." Das ist besser als Raten.',
    ],
    mistakes: [
      'Cause weglassen — dann wirkt die Solution willkürlich und austauschbar',
      'Mehrere Probleme gleichzeitig nennen — ein Problem pro Statement, sonst verliert sich der Zuhörer',
      'Problem zu vage — "Es läuft nicht optimal" ist kein Problem, es ist eine Meinung. Nenne Zahlen oder konkrete Auswirkungen.',
    ],
  },

  {
    id: 'monroes-motivated-sequence',
    name: "Monroe's Motivated Sequence",
    tagline: 'Zum Handeln motivieren — die Kunst der Überzeugung',
    shortExplanation:
      'Aufmerksamkeit → Bedarf → Befriedigung → Visualisierung → Handlung: Das vollständigste Überzeugungsframework für Reden und Sales.',
    deepExplanation:
      'Alan Monroe entwickelte dieses Framework in den 1930ern für Redekunst-Studenten, und es funktioniert heute genauso — weil es auf unveränderlichen psychologischen Mechanismen basiert. Das Framework bildet den vollständigen Überzeugungsprozess ab: Zuerst muss die Aufmerksamkeit geweckt werden (ohne das hört niemand zu), dann muss ein Bedarf als real und dringend empfunden werden (Kognition), dann kommt die Lösung (Logik), dann die Visualisierung (Emotion — hier entscheiden die meisten Menschen wirklich), und erst dann der Call to Action. Der entscheidende Schritt, den die meisten Redner überspringen, ist die Visualization: Ohne sie bleibt die Entscheidung im Kopf stecken. Die Visualization lässt den Zuhörer spüren, wie sein Leben mit der Lösung aussieht — das ist der emotionale Kaufimpuls. Für den Handlungsschritt gilt: Er muss spezifisch, leicht und sofort ausführbar sein. "Denk darüber nach" ist kein Action Step. "Melde dich heute noch an" ist einer.',
    structure: [
      'Attention — Aufmerksamkeit mit Hook, Fakt oder Frage',
      'Need — Problem und Bedarf etablieren, Schmerz spürbar machen',
      'Satisfaction — deine Lösung klar präsentieren',
      'Visualization — wie das Leben mit der Lösung aussieht (emotional)',
      'Action — konkreter, einfacher Call to Action',
    ],
    when: 'Sales-Gespräche, Keynotes, Pitches, Charity-Aufrufe, Motivationsreden, Crowdfunding-Videos',
    whenNot:
      'Nicht für sachliche Briefings oder informative Präsentationen ohne Call to Action. Zu viel Emotion in falschen Kontexten wirkt manipulativ.',
    examples: [
      {
        context: 'Startup-Pitch vor Angel-Investoren',
        text: '72% aller Handwerker in der Schweiz verlieren über 10 Stunden pro Woche an Papierkram. Das kostet sie real über 30.000 CHF pro Jahr — Zeit, die sie mit bezahlter Arbeit verbringen könnten. Unsere App automatisiert Angebote, Rechnungen und Kundenkommunikation in unter 3 Minuten täglich. Stell dir vor: Ein Maler macht um 17 Uhr Feierabend, fährt nach Hause, und alle Rechnungen sind schon raus. Ohne Stress. Heute haben wir 200 aktive Nutzer und 15% monatliches Wachstum. Wir suchen 300k für den nächsten Schritt — wollen Sie dabei sein?',
      },
      {
        context: 'Sales-Gespräch: Website-Redesign pitchen',
        text: 'Wissen Sie, was Ihre Konkurrenten haben, was Sie nicht haben? Eine Website, die um Mitternacht noch Kunden gewinnt. Momentan verlieren Sie 68% aller Besucher innerhalb von 5 Sekunden — die meisten davon gehen direkt zu Ihrem Mitbewerber. Mit unserem Redesign sinkt die Absprungrate um die Hälfte, Kontaktanfragen verdoppeln sich im Schnitt. Stellen Sie sich vor: Sie wachen morgens auf und haben bereits 3 neue Anfragen in Ihrer Inbox — ohne einen Franken für Werbung ausgegeben zu haben. Ich habe Freitagabend noch einen Slot für eine kostenlose Analyse. Sollen wir ihn festlegen?',
      },
      {
        context: 'Vereinspräsentation: Freiwillige für Umweltprojekt gewinnen',
        text: 'In unserem Fluss wurden letzten Sommer 400 Kilo Plastik gefunden — von der Quelle bis zur Mündung. Das ist kein abstraktes Problem: Das Wasser, das eure Kinder im Sommer sehen, trägt das mit. Diesen Samstag veranstalten wir unsere größte Reinigungsaktion — 50 Freiwillige, 6 Stunden, messbare Wirkung. Stell dir vor, du fährst am nächsten Sommer mit deiner Familie am Ufer vorbei und weißt: Dieses Stück Welt ist sauber, weil du dort warst. Anmeldung ist hier auf dem Tisch — einfach Name und Nummer hinterlassen.',
      },
      {
        context: 'Mitarbeiter-Meeting: Neue Prozesse einführen',
        text: 'Wir verlieren jede Woche durchschnittlich 3 Stunden pro Person an Abstimmungsaufwand, der nicht sein müsste. Das addiert sich auf über 1.500 Stunden pro Jahr im ganzen Team — Zeit, die wir nicht für Kunden nutzen. Ab nächster Woche führen wir einen einfachen Prozess ein: tägliches 15-Minuten-Standup, Kanban-Board für alle, keine langen E-Mail-Threads mehr. Stell dir vor, du kommst morgens rein und weißt in 15 Minuten genau, woran alle arbeiten — kein Suchen, kein Nachhaken. Wer dabei ist, tragt sich bitte im Formular ein — wir starten Montag.',
      },
    ],
    proTips: [
      'Die Visualization ist der emotionale Kauf-Moment. Investiere hier die meiste Energie und nutze Bilder, die der Zuhörer sich wirklich vorstellen kann.',
      'Der Action Step muss so einfach sein, dass er im Raum ausgeführt werden kann: "Trag dich hier ein", "Ruf mich diese Woche an", "Schreib heute Abend kurz".',
      'Die Attention-Phase darf provokant, überraschend oder emotional sein — das ist der einzige Moment, wo du die volle Aufmerksamkeit hast.',
    ],
    mistakes: [
      'Visualization überspringen — das ist der emotionale Höhepunkt, ohne ihn bleibt alles im Kopf',
      'Action Step zu vage ("denkt drüber nach") — der Zuhörer braucht eine konkrete Handlung',
      'Need nicht spürbar genug machen — wenn der Schmerz nicht real wirkt, interessiert die Lösung nicht',
    ],
  },

  {
    id: 'minto-pyramid',
    name: 'Minto Pyramid',
    tagline: 'Sofort auf den Punkt — Executive-Stil',
    shortExplanation:
      'Antwort zuerst, dann Begründungen, dann Details. Wer keine Zeit hat, bekommt trotzdem das Wichtigste.',
    deepExplanation:
      'Barbara Minto entwickelte das Pyramid Principle für McKinsey-Berater, und es hat die Art, wie Consultants kommunizieren, revolutioniert. Das Grundprinzip nennt sich "BLUF" (Bottom Line Up Front) und widerspricht der natürlichen menschlichen Kommunikationstendenz, erst Kontext zu liefern und dann zur Schlussfolgerung zu kommen. Das Problem damit: Entscheidungsträger hören nach 30–60 Sekunden auf, aktiv zuzuhören, wenn sie noch keine Orientierung haben. Die Pyramide dreht die Logik um: Erst die Empfehlung, dann die Begründungen, dann die stützenden Daten. Für den Empfänger ist das sofort orientierend — er kann nach dem ersten Satz entscheiden, ob er tiefer einsteigen will. Für den Sprecher ist es disziplinierend: Wer nicht weiß, was seine Empfehlung ist, merkt es sofort, wenn er versucht, das Framework anzuwenden. Die Pyramide hat auch eine wichtige Regel für die Gruppenstruktur: Argumente auf derselben Ebene müssen MECE sein — Mutually Exclusive, Collectively Exhaustive. Also keine Überlappungen, keine Lücken.',
    structure: [
      'Antwort zuerst — Empfehlung oder Schlussfolgerung in einem Satz',
      '2–3 Hauptargumente — warum diese Empfehlung richtig ist',
      'Stützende Daten — Fakten, Zahlen, Beispiele pro Argument',
    ],
    when: 'Kommunikation mit Executives, Berater-Empfehlungen, Management-Mails, Business Cases',
    whenNot:
      'Nicht bei narrativen Pitches, emotionalen Botschaften oder wenn die Antwort kontrovers ist und erst aufgebaut werden muss (dann besser Problem-Cause-Solution oder Monroe).',
    examples: [
      {
        context: 'CEO-Briefing: Projekt-Empfehlung',
        text: 'Meine Empfehlung: Wir stoppen das Projekt und neu starten. Drei Gründe: Erstens sind 40% der Anforderungen so geändert worden, dass ein Neustart günstiger ist als Nachjustieren. Zweitens haben wir jetzt bessere Tools, die damals nicht verfügbar waren. Drittens zeigen Kundendaten, dass die ursprüngliche Annahme zum Nutzerverhalten falsch war. Die Daten: aktuelle Scope-Abweichung liegt bei 60%, Neuprojekt spart laut Schätzung 3 Monate und 80k.',
      },
      {
        context: 'E-Mail an Vorgesetzten: Homeoffice-Anfrage',
        text: 'Meine Bitte: Ich möchte donnerstags dauerhaft von zu Hause arbeiten. Die drei Gründe: Fokusarbeit — Donnerstagsaufgaben (Berichte, Konzepte) benötigen Stille, die ich im Büro nicht habe. Pendelzeit — ich spare 2.5 Stunden, die ich direkt in Projektarbeit investiere. Teamdynamik — alle anderen Tage bin ich im Büro, Koordination ist nicht betroffen. Wenn hilfreich, kann ich nach einem Monat einen Bericht über Outputs liefern.',
      },
      {
        context: 'Kunden-Präsentation: Technologie-Empfehlung',
        text: 'Wir empfehlen Next.js statt WordPress für Ihr Projekt. Hauptgründe: Performance — Next.js ist im Schnitt 3x schneller für Ihre Art von Site. Skalierbarkeit — beim geplanten Wachstum von 10x Usern braucht WordPress Plugins und Workarounds, Next.js skaliert nativ. Entwicklungsflexibilität — jede zukünftige Feature-Anforderung ist umsetzbar, ohne Systemgrenzen. Kostenperspektive: Höhere Anfangsinvestition von 20%, aber über 3 Jahre 40% günstiger in Wartung.',
      },
      {
        context: 'Meetingbeitrag: "Wie läuft das Projekt?"',
        text: 'Kurzversion: Wir liegen im Plan, haben aber ein Risiko. Positiv: alle vier Hauptmeilensteine bis heute on time. Das Risiko: ein externer Lieferant hat Verzögerungen gemeldet, was Phase 3 verschieben könnte. Mein Vorschlag: Ich suche bis Freitag einen alternativen Lieferanten und berichte dann.',
      },
    ],
    proTips: [
      'Übe die "So-What-Frage": Für jeden Datenpunkt, frage dich "So what?" — die Antwort auf diese Frage ist der Argument-Level, nicht der Daten-Level.',
      'Die Empfehlung im ersten Satz muss eine Handlung enthalten, nicht nur eine Beobachtung. "Das Projekt hat Risiken" ist keine Empfehlung. "Ich empfehle, das Projekt um 4 Wochen zu verschieben" ist eine.',
      'Bei E-Mails: Betreffzeile = Empfehlung. Erster Satz = Empfehlung wiederholt. Dann die drei Gründe. Wer nur den Betreff liest, weiß, was du willst.',
    ],
    mistakes: [
      'Kontext zuerst, Empfehlung am Ende — Executive hört nach 30 Sekunden auf, wenn er noch nichts Konkretes hat',
      'Mehr als 3 Hauptargumente — mehr als 3 sind schwer zu merken und wirken unstrukturiert',
      'Daten auf dem Argument-Level — Zahlen gehören unter die Argumente, nicht als Argumente selbst',
    ],
  },

  {
    id: 'hook-story-offer',
    name: 'Hook–Story–Offer',
    tagline: 'Pitches, die nicht wie Pitches klingen',
    shortExplanation:
      'Erst die Aufmerksamkeit haken, dann eine kurze Geschichte erzählen, dann das Angebot — in dieser Reihenfolge, immer.',
    deepExplanation:
      'Hook-Story-Offer ist das Framework des modernen Verkaufens und Content-Marketings — weil es das fundamentale Problem der Überzeugung löst: Menschen kaufen nicht, wenn sie das Produkt verstehen. Sie kaufen, wenn sie sich in der Geschichte wiedererkennen. Der Hook hat eine einzige Aufgabe: stoppen. In einer Welt voller Information ist der Aufmerksamkeitsstopp die seltenste Ressource. Ein guter Hook stellt eine unbequeme Frage, macht eine provokante Aussage oder präsentiert eine überraschende Zahl. Die Story ist nicht die Unternehmensgeschichte — sie ist die Geschichte des Problems, das der Zuhörer kennt. Wenn der Zuhörer sich im Problem wiedererkennt, ist er bereits halb gewonnen. Das Offer kommt zuletzt, und erst dann — weil ein Offer ohne vorherigen emotionalen Kontext wie Werbung klingt, mit Kontext klingt es wie Hilfe. Das Framework funktioniert für Elevator Pitches, Sales Calls, Social-Media-Posts, Landing Pages und E-Mails — überall dort, wo du um Aufmerksamkeit kämpfst.',
    structure: [
      'Hook — Aufmerksamkeit sofort gewinnen: Frage, Zahl, Provokation',
      'Story — kurze Geschichte des Problems oder deines Weges (max. 3 Sätze)',
      'Offer — deine Lösung und der konkrete nächste Schritt',
    ],
    when: 'Elevator Pitches, Sales-Gespräche, Social-Media-Videos, E-Mail-Kaltakquise, Konferenz-Vorstellungen',
    whenNot:
      'Nicht für sachliche Berichte oder interne Team-Kommunikation, wo Storytelling deplatziert wirkt.',
    examples: [
      {
        context: 'Elevator Pitch: Startup vorstellen',
        text: 'Was wäre, wenn dein bester Verkäufer nie schläft, nie krank wird und nie einen Follow-up vergisst? Ich habe 5 Jahre als Sales Manager gearbeitet und gesehen, wie 80% des Umsatzes durch schlechtes Follow-up-Management verloren geht. Deswegen haben wir SalesBot gebaut — ein KI-System, das Follow-ups automatisch sendet, personalisiert auf jeden Kunden. Teste es 14 Tage kostenlos, heute noch.',
      },
      {
        context: 'Kaltakquise-Email: Webdesign-Agentur',
        text: 'Ihre Website lädt auf Mobilgeräten in 8 Sekunden. Das kostet Sie jeden Monat schätzungsweise 40 Anfragen. Ich bin Samuel von Webroids — wir haben letzte Woche eine ähnliche Seite auf 1.8 Sekunden gebracht, die Anfragen stiegen in 30 Tagen um 60%. Haben Sie 15 Minuten für eine schnelle Analyse?',
      },
      {
        context: 'Instagram Reel: Kommunikations-Tipp',
        text: 'Du hast den Job nicht bekommen — nicht wegen deiner Qualifikation, sondern wegen einem Satz. Ich habe über 200 Vorstellungsgespräche geführt und immer wieder den gleichen Fehler gesehen: Kandidaten sagen, was sie gemacht haben, nicht was sie bewirkt haben. Hier ist die eine Formel, die das ändert — STAR.',
      },
      {
        context: 'Konferenz-Networking: Sich vorstellen',
        text: 'Ich starte gerne mit einer Frage: Wann hast du das letzte Mal eine Website gebaut und wirklich gewusst, ob sie funktioniert? Ich habe 3 Jahre Projekte gebaut und mich immer auf Bauchgefühl verlassen. Das hat mich 30k in verschwendetem Traffic gekostet. Heute bauen wir nur noch datenbasiert — und ich helfe anderen Agenturen, das auch zu tun.',
      },
    ],
    proTips: [
      'Der Hook muss in 5 Sekunden funktionieren — wenn jemand nach 5 Sekunden wegscrollt oder wegschaut, war der Hook nicht stark genug.',
      'Die Story darf die eigene Schwäche oder einen Fehler einschliessen — das macht sie nahbar und authentisch.',
      'Der Offer-Schritt muss eine einzige, klare Handlung beinhalten. Nicht "ruf an oder schreib oder besuche die Website" — eine Option.',
    ],
    mistakes: [
      'Hook zu generisch ("Hast du je das Gefühl gehabt...") — muss sofort spezifisch und relevant sein',
      'Story zu lang — mehr als 3 Sätze und der Zuhörer verliert das Interesse',
      'Offer ohne CTA — "Das ist mein Produkt" ist kein Offer, "Teste es heute" ist einer',
    ],
  },

  {
    id: 'WAIT',
    name: 'WAIT',
    tagline: 'Die unterschätzte Superkraft: Zuhören',
    shortExplanation:
      '"Why Am I Talking?" — Bevor du sprichst, frage dich, ob du wirklich Wert beiträgst. Die meisten Menschen reden zu viel.',
    deepExplanation:
      'WAIT ist kein Struktur-Framework wie die anderen — es ist ein Selbst-Check-Mechanismus für eine der wichtigsten Kommunikationskompetenzen: aktives Schweigen. Studien zeigen, dass in den meisten Gesprächen 20% der Teilnehmer 80% der Redezeit beanspruchen. Das Problem: Vielreden wird oft mit Kompetenz verwechselt, aber die wirksamsten Kommunikatoren — von besten Verhandlern bis zu den beliebtesten Kollegen — sind häufig diejenigen, die gezielt fragen, aktiv zuhören und selektiv sprechen. Das WAIT-Prinzip hat drei Dimensionen: Erstens das kognitive Innehalten ("Füge ich gerade wirklich Wert hinzu?"), zweitens die Qualitätsverbesserung des eigenen Beitrags (wer weniger redet, redet konzentrierter und überzeugender), und drittens die Beziehungsebene (Menschen fühlen sich von guten Zuhörern verstanden und öffnen sich). In Verhandlungen ist Stille direkt mächtig: Wer nach einem Angebot schweigt, zwingt die andere Seite zu reden — und diese neigt dazu, das Angebot zu verbessern oder Zugeständnisse zu machen.',
    structure: [
      'Why Am I Talking? — interner Selbst-Check vor dem Reden',
      'Pausa einlegen — bewusst 2–3 Sekunden warten',
      'Erst zuhören — aktiv, dann gezielt antworten',
    ],
    when: 'Meetings, Verhandlungen, Konfliktsituationen, Coaching-Gespräche, Kundenberatung',
    whenNot:
      'Nicht als Ausrede nutzen, um sich immer rauszuhalten. WAIT ist ein Check, kein Versteck. Wenn du etwas Wichtiges beitragen kannst, tu es.',
    examples: [
      {
        context: 'Team-Meeting: Kollege erklärt sein Problem',
        text: 'Statt sofort eine Lösung vorzuschlagen: WAIT. "Verstehe ich richtig, dass das Hauptproblem X ist?" — dann weiterzuhören. Oft liegt das eigentliche Problem woanders, und die schnelle Lösung wäre für das falsche Problem.',
      },
      {
        context: 'Preisverhandlung mit Kunden',
        text: 'Du hast den Preis genannt: 8.000 CHF. Der Kunde zieht die Augenbrauen hoch und sagt nichts. WAIT — Stille aushalten. Nicht sofort reduzieren, nicht erklären, nicht rechtfertigen. Die Stille arbeitet für dich. Der Kunde spricht zuerst.',
      },
      {
        context: 'Gespräch mit Freund in schwieriger Phase',
        text: 'Kein Ratschlag, keine Relativierung. WAIT. "Was beschäftigt dich dabei am meisten?" — und dann wirklich zuhören. In emotionalen Gesprächen ist das Wichtigste, dass sich die Person verstanden fühlt, nicht dass sie eine Lösung bekommt.',
      },
      {
        context: 'Großes Meeting mit vielen Meinungen',
        text: 'Bevor du auf einen Kommentar reagierst, WAIT. Frage dich: "Ist das, was ich sagen will, neu? Verändert es die Diskussion? Oder sage ich es nur, weil es sich gut anfühlen würde, etwas gesagt zu haben?" Wenn die Antwort letzteres ist — schweigen und zuhören.',
      },
    ],
    proTips: [
      'Trainiere das bewusste Pausieren: Zähle nach einer Aussage innerlich bis 3, bevor du antwortest. Du wirst bemerken, wie oft du dann eine bessere Antwort findest.',
      'In Verhandlungen: Wer zuerst nach einer Stille spricht, verliert leicht den Vorteil. Stille aushalten ist eine lernbare Fähigkeit.',
      'Stelle mehr Fragen als du Aussagen machst. Die mächtigste Kommunikation ist oft: "Erzähl mir mehr darüber."',
    ],
    mistakes: [
      'WAIT als Ausrede nutzen, um nie etwas beizutragen — das ist Passivität, nicht Kommunikation',
      'Zuhören als passives Warten auf die eigene Reihe — echtes Zuhören ist aktiv: nachfragen, zusammenfassen, reagieren',
      'Stille im falschen Moment — wenn jemand Bestätigung oder Reaktion braucht, ist Schweigen kalt',
    ],
  },

  {
    id: 'socratic',
    name: 'Sokratische Methode',
    tagline: 'Überzeugen durch Fragen statt Behaupten',
    shortExplanation:
      'Statt Argumente zu liefern, führst du dein Gegenüber durch gezielte Fragen zur Erkenntnis. Menschen überzeugen sich selbst am stärksten.',
    deepExplanation:
      'Die sokratische Methode ist 2.500 Jahre alt und heute in Verhandlungen, Verkauf und Konfliktlösung aktueller denn je. Das Prinzip: Menschen sind widerstandsfähiger gegen externe Argumente als gegen ihre eigene Logik. Wenn du jemanden mit Fakten konfrontierst, aktiviert das oft Widerstand (reactance). Wenn du ihn durch Fragen dazu bringst, selbst die gleiche Schlussfolgerung zu ziehen, fühlt er sie als die eigene. Im Verkauf nennt man das "consultative selling". In der Philosophie ist es Dialektik. In der Praxis sieht es so aus: Statt "Ihr System ist veraltet und kostet euch Geld", fragst du "Wie viel Zeit verbringt euer Team mit Aufgaben, die eigentlich automatisierbar wären?" — und der Kunde rechnet selbst aus, was das kostet. Psychologisch ist der Unterschied riesig: Im ersten Fall behauptest du etwas über ihn. Im zweiten Fall entdeckt er es selbst.',
    structure: [
      'Fragen stellen, die zur eigenen Erkenntnis führen',
      'Antworten zusammenfassen und reflektieren',
      'Folge-Fragen zur Vertiefung',
      'Schlussfolgerung vom Gegenüber ziehen lassen',
    ],
    when: 'Beratungsgespräche, Verkauf, Konfliktlösung, Coaching, wenn jemand eine andere Meinung hat und du sie nicht direkt angreifen willst',
    whenNot:
      'Nicht wenn Zeit fehlt oder wenn jemand direkte Antworten erwartet. Auch nicht als manipulative Technik zum Schein — Menschen merken es.',
    examples: [
      {
        context: 'Verkaufsgespräch: Kunde zweifelt am Wert der Investition',
        text: '"Was würden Sie sagen, kostet Sie ein verlorener Interessent im Schnitt?" → Kunde nennt Zahl. "Und wie viele verlieren Sie pro Monat schätzungsweise, weil die Website keinen Anruf auslöst?" → Kunde denkt nach. "Das macht dann X Franken pro Monat?" → Kunde nickt. "Wäre eine Investition sinnvoll, wenn sie davon die Hälfte zurückbringen würde?"',
      },
      {
        context: 'Konfliktgespräch: Kollege fühlt sich unfair behandelt',
        text: '"Was genau hat dich daran gestört?" → Zuhören. "Wenn du in meiner Situation gewesen wärst — wie hättest du es gemacht?" → Raum zum Nachdenken. "Was würde für dich eine faire Lösung aussehen?" → Lösung kommt vom Gegenüber, nicht von dir.',
      },
      {
        context: 'Coaching: Klient weiss nicht, was er will',
        text: '"Was würde sich anders anfühlen, wenn das Problem weg wäre?" → Klient beschreibt Zustand. "Was hält dich gerade davon ab, diesen Zustand zu erreichen?" → Eigene Barrieren benennen. "Was wäre der kleinste mögliche erste Schritt?"',
      },
    ],
    proTips: [
      'Offene Fragen sind besser als geschlossene: "Wie würdest du..." statt "Würdest du..."',
      'Nach jeder Antwort: Zusammenfassen. "Verstehe ich richtig, dass..." — das zeigt echtes Zuhören und schafft Vertrauen.',
      'Die Methode braucht Geduld — lass Pausen zu und dränge nicht zur Antwort.',
    ],
    mistakes: [
      'Fragen stellen, aber die Antworten nicht wirklich hören',
      'Die Schlussfolgerung am Ende doch selbst sagen — dann hast du den ganzen Effekt zunichte gemacht',
      'Die Methode als Verhörtechnik einsetzen — sie funktioniert nur in einem Klima des gegenseitigen Respekts',
    ],
  },

  {
    id: 'feel-felt-found',
    name: 'Feel–Felt–Found',
    tagline: 'Einwände mit Empathie lösen',
    shortExplanation:
      'Ich verstehe, wie du dich fühlst (Feel) → Andere fühlten das auch (Felt) → Was wir herausgefunden haben (Found). Klassisch in Sales, kraftvoll überall.',
    deepExplanation:
      'Feel-Felt-Found ist das bekannteste Einwand-Framework im Verkauf — und eines der psychologisch durchdachtesten. Es löst das Problem, dass Einwände oft emotionale Widerstände sind, keine logischen. Wenn ein Kunde sagt "Das ist zu teuer", meint er meistens nicht eine rationale Kosten-Nutzen-Analyse — er fühlt Unsicherheit, Zweifel oder Angst vor einer falschen Entscheidung. Die drei Schritte adressieren genau das: "Feel" zeigt, dass du die Emotion siehst und akzeptierst (nicht versuchst, sie wegzureden). "Felt" normalisiert das Gefühl und schafft Gemeinschaft — du bist nicht allein damit. "Found" präsentiert die Erfahrung anderer als Brücke zur Lösung — ohne direkte Behauptung, sondern als gelernte Erkenntnis. Das Geniale: Du verkaufst über Erfahrungen dritter, nicht über dein eigenes Interesse. Das reduziert den wahrgenommenen Verkaufsdruck erheblich.',
    structure: [
      'Feel — "Ich verstehe, dass du dich so fühlst..."',
      'Felt — "Andere haben das auch so gefühlt..."',
      'Found — "Was wir/sie herausgefunden haben ist..."',
    ],
    when: 'Einwände in Sales-Gesprächen, Konflikte entschärfen, wenn jemand skeptisch oder ablehnend ist',
    whenNot:
      'Nicht als mechanische Formel einsetzen — wirkt sofort unecht. Die Empathie muss echt sein. Auch nicht bei sachlichen, nicht emotionalen Einwänden.',
    examples: [
      {
        context: 'Sales: "Das ist zu teuer für uns."',
        text: 'Ich verstehe das vollkommen — ein größeres Investment will gut überlegt sein. Viele unserer besten Kunden haben am Anfang ähnlich reagiert. Was sie aber herausgefunden haben: Der Break-even liegt meist bei 3 Monaten, wenn die Conversion-Rate steigt. Darf ich Ihnen zeigen, wie wir das bei Müller GmbH berechnet haben?',
      },
      {
        context: 'Teamgespräch: Kollege gegen Prozessänderung',
        text: 'Ich verstehe, dass du skeptisch bist — wir haben schon zu viele Prozesse eingeführt, die nichts gebracht haben. Andere im Team haben das auch so gefühlt am Anfang. Was wir bei der letzten Einführung gelernt haben: Wenn wir die betroffenen Personen früh einbeziehen, klappt die Umsetzung dreimal schneller. Deswegen will ich heute vor allem von dir hören, was aus deiner Sicht wirklich geändert werden müsste.',
      },
      {
        context: 'Familie: Kind will nicht zur Schule',
        text: 'Ich verstehe, dass du heute keine Lust hast — das kennst du bestimmt schon. Ich hatte das früher auch manchmal. Was ich mit der Zeit gelernt habe: Die Tage, an denen man am wenigsten Lust hatte, wurden manchmal die besten. Was wäre das Schlimmste, was heute passieren könnte?',
      },
    ],
    proTips: [
      'Das "Felt" kann auch anonym sein: "Viele in eurer Situation..." oder "Die meisten, die zum ersten Mal..." — du brauchst keine Namen.',
      'Das "Found" sollte konkret sein — nicht "es hat gut funktioniert", sondern "sie haben X% mehr erzielt in Y Wochen".',
      'Pause nach dem "Feel" — lass die Anerkennung wirken, bevor du weitergehst.',
    ],
    mistakes: [
      'Zu schnell durch alle drei Schritte rennen — dann wirkt es wie ein Skript, nicht wie echte Empathie',
      'Found als Argumentation nutzen, nicht als Erfahrungsbericht — der Tonunterschied ist entscheidend',
      '"Ich verstehe" sagen, ohne es wirklich zu meinen — Menschen spüren das sofort',
    ],
  },
]

export const FRAMEWORK_OPTIONS = [
  { label: 'Kein Framework', value: '' },
  ...FRAMEWORKS.map((f) => ({ label: f.name, value: f.id })),
]

export function getFramework(id: string): Framework | undefined {
  return FRAMEWORKS.find((f) => f.id === id)
}
