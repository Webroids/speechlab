export type TopicCategory =
  | 'business_pitch'
  | 'persoenlich_reflexion'
  | 'smalltalk'
  | 'erklaerung_teachback'
  | 'streit_position'
  | 'storytelling'

export type TopicDifficulty = 'easy' | 'medium' | 'hard'

export interface Topic {
  id: string
  text: string
  category: TopicCategory
  difficulty: TopicDifficulty
}

export const CATEGORY_LABELS: Record<TopicCategory, string> = {
  business_pitch: 'Business / Pitch',
  persoenlich_reflexion: 'Persönlich / Reflexion',
  smalltalk: 'Smalltalk',
  erklaerung_teachback: 'Erklärung / Teach-back',
  streit_position: 'Streit / Position',
  storytelling: 'Storytelling',
}

const topics: Topic[] = [
  // ─── Business / Pitch ───────────────────────────────────────────────────────
  {
    id: 'bp-01',
    text: 'Erkläre Webroids in 60 Sekunden einem potenziellen Kunden, der noch nie davon gehört hat.',
    category: 'business_pitch',
    difficulty: 'medium',
  },
  {
    id: 'bp-02',
    text: 'Verteidige eine Designentscheidung, mit der dein Kunde nicht einverstanden war.',
    category: 'business_pitch',
    difficulty: 'hard',
  },
  {
    id: 'bp-03',
    text: 'Erkläre einem Kunden in 60 Sekunden, warum ein Rebrand teurer ist als gedacht.',
    category: 'business_pitch',
    difficulty: 'hard',
  },
  {
    id: 'bp-04',
    text: 'Pitch: Warum sollte ein lokales KMU jetzt in eine neue Website investieren?',
    category: 'business_pitch',
    difficulty: 'medium',
  },
  {
    id: 'bp-05',
    text: 'Erkläre den Unterschied zwischen einem Freelancer und einer Agentur — ohne die andere Option schlecht zu machen.',
    category: 'business_pitch',
    difficulty: 'easy',
  },
  {
    id: 'bp-06',
    text: 'Du hast ein Projekt überliefert und musst dem Kunden erklären, warum er trotzdem mehr bezahlen soll.',
    category: 'business_pitch',
    difficulty: 'hard',
  },
  {
    id: 'bp-07',
    text: 'Was ist dein Alleinstellungsmerkmal als Agentur — in 45 Sekunden?',
    category: 'business_pitch',
    difficulty: 'medium',
  },
  {
    id: 'bp-08',
    text: 'Erkläre einem nicht-technischen Geschäftsführer, warum Page Speed für sein Business relevant ist.',
    category: 'business_pitch',
    difficulty: 'easy',
  },
  {
    id: 'bp-09',
    text: 'Pitch eine Zusammenarbeit an einen Kunden, der sagt: "Wir haben schon eine Agentur."',
    category: 'business_pitch',
    difficulty: 'hard',
  },
  {
    id: 'bp-10',
    text: 'Erkläre, warum Branding mehr ist als ein Logo — an einem konkreten Beispiel.',
    category: 'business_pitch',
    difficulty: 'easy',
  },
  {
    id: 'bp-11',
    text: 'Ein Startup fragt dich: "Was bringt uns eine professionelle Website jetzt schon?" — Antworte überzeugend.',
    category: 'business_pitch',
    difficulty: 'medium',
  },
  {
    id: 'bp-12',
    text: 'Du willst eine Preiserhöhung von 30% einführen. Wie kommunizierst du das deinen Bestandskunden?',
    category: 'business_pitch',
    difficulty: 'hard',
  },
  {
    id: 'bp-13',
    text: 'Pitch einen Website-Relaunch an einen Kunden, der meint: "Die alte läuft doch noch."',
    category: 'business_pitch',
    difficulty: 'medium',
  },
  {
    id: 'bp-14',
    text: 'Erkläre, warum Content-Strategie wichtiger ist als Social-Media-Häufigkeit.',
    category: 'business_pitch',
    difficulty: 'medium',
  },
  {
    id: 'bp-15',
    text: 'Du hast einen Fehler im Projekt gemacht. Wie kommunizierst du ihn dem Kunden professionell?',
    category: 'business_pitch',
    difficulty: 'hard',
  },
  {
    id: 'bp-16',
    text: 'Erkläre, warum eine schlechte Website Kunden aktiv abschreckt — mit einem konkreten Beispiel.',
    category: 'business_pitch',
    difficulty: 'easy',
  },
  {
    id: 'bp-17',
    text: 'Pitch deinen Service an jemanden, der sagt: "Ich mach das mit KI selbst."',
    category: 'business_pitch',
    difficulty: 'hard',
  },
  {
    id: 'bp-18',
    text: 'Was unterscheidet eine gute von einer schlechten Zusammenarbeit mit Kunden?',
    category: 'business_pitch',
    difficulty: 'easy',
  },
  {
    id: 'bp-19',
    text: 'Erkläre einem Kunden, warum das billigste Angebot oft das teuerste ist.',
    category: 'business_pitch',
    difficulty: 'medium',
  },
  {
    id: 'bp-20',
    text: 'Du wirst nach deiner größten Schwäche als Agentur gefragt. Antworte ehrlich und überzeugend.',
    category: 'business_pitch',
    difficulty: 'hard',
  },

  // ─── Persönlich / Reflexion ──────────────────────────────────────────────────
  {
    id: 'pr-01',
    text: 'Was hat dich diese Woche wirklich beschäftigt — beruflich oder privat?',
    category: 'persoenlich_reflexion',
    difficulty: 'easy',
  },
  {
    id: 'pr-02',
    text: 'Welche Entscheidung aus den letzten 12 Monaten bereust du am meisten? Warum?',
    category: 'persoenlich_reflexion',
    difficulty: 'medium',
  },
  {
    id: 'pr-03',
    text: 'Beschreibe deine größte berufliche Veränderung in den letzten drei Jahren.',
    category: 'persoenlich_reflexion',
    difficulty: 'easy',
  },
  {
    id: 'pr-04',
    text: 'Was ist eine Überzeugung, die du früher hattest und heute nicht mehr teilst?',
    category: 'persoenlich_reflexion',
    difficulty: 'medium',
  },
  {
    id: 'pr-05',
    text: 'Wann hast du zuletzt wirklich Nein gesagt — und was hat es gekostet?',
    category: 'persoenlich_reflexion',
    difficulty: 'hard',
  },
  {
    id: 'pr-06',
    text: 'Was bedeutet Erfolg für dich, heute, konkret?',
    category: 'persoenlich_reflexion',
    difficulty: 'medium',
  },
  {
    id: 'pr-07',
    text: 'Beschreibe deinen idealen Arbeitstag — ohne "es kommt drauf an".',
    category: 'persoenlich_reflexion',
    difficulty: 'easy',
  },
  {
    id: 'pr-08',
    text: 'Welche Fähigkeit willst du bis Ende Jahr deutlich verbessern, und warum diese?',
    category: 'persoenlich_reflexion',
    difficulty: 'medium',
  },
  {
    id: 'pr-09',
    text: 'Was ist die größte Lüge, die du dir selbst erzählst?',
    category: 'persoenlich_reflexion',
    difficulty: 'hard',
  },
  {
    id: 'pr-10',
    text: 'Wenn du dich in 5 Jahren beschreiben müsstest — was soll dort stehen?',
    category: 'persoenlich_reflexion',
    difficulty: 'medium',
  },
  {
    id: 'pr-11',
    text: 'Was hat dir dieses Jahr die meiste Energie gegeben? Was hat sie genommen?',
    category: 'persoenlich_reflexion',
    difficulty: 'easy',
  },
  {
    id: 'pr-12',
    text: 'Was tust du, wenn du merkst, dass du in einem Hamsterrad feststeckst?',
    category: 'persoenlich_reflexion',
    difficulty: 'medium',
  },
  {
    id: 'pr-13',
    text: 'Welche Person hat dich beruflich am stärksten geprägt — und was hast du von ihr gelernt?',
    category: 'persoenlich_reflexion',
    difficulty: 'easy',
  },
  {
    id: 'pr-14',
    text: 'Was ist der Unterschied zwischen dem, was du tust, und dem, was du wirklich tun willst?',
    category: 'persoenlich_reflexion',
    difficulty: 'hard',
  },
  {
    id: 'pr-15',
    text: 'Beschreibe einen Moment, in dem du dir selbst wirklich treu geblieben bist.',
    category: 'persoenlich_reflexion',
    difficulty: 'medium',
  },
  {
    id: 'pr-16',
    text: 'Was ist deine Definition von "gut genug" — und wann sabotiert sie dich?',
    category: 'persoenlich_reflexion',
    difficulty: 'hard',
  },
  {
    id: 'pr-17',
    text: 'Worüber würdest du gerne öfter nachdenken, aber nimmst dir keine Zeit dafür?',
    category: 'persoenlich_reflexion',
    difficulty: 'medium',
  },
  {
    id: 'pr-18',
    text: 'Was würdest du deinem 20-jährigen Ich raten?',
    category: 'persoenlich_reflexion',
    difficulty: 'easy',
  },

  // ─── Smalltalk ──────────────────────────────────────────────────────────────
  {
    id: 'st-01',
    text: 'Was ist dein Lieblingsfilm, und was sagt das über dich aus?',
    category: 'smalltalk',
    difficulty: 'easy',
  },
  {
    id: 'st-02',
    text: 'Wenn du eine Stadt auf der Welt wärst, welche und warum?',
    category: 'smalltalk',
    difficulty: 'easy',
  },
  {
    id: 'st-03',
    text: 'Erkläre jemandem, der nie davon gehört hat, warum dein Lieblingsrestaurant gut ist.',
    category: 'smalltalk',
    difficulty: 'easy',
  },
  {
    id: 'st-04',
    text: 'Was machst du, wenn du absolut nicht weißt, worüber du reden sollst?',
    category: 'smalltalk',
    difficulty: 'medium',
  },
  {
    id: 'st-05',
    text: 'Drei Dinge, die dich gerade begeistern — egal wie trivial.',
    category: 'smalltalk',
    difficulty: 'easy',
  },
  {
    id: 'st-06',
    text: 'Du triffst jemanden auf einer Party. Er fragt: "Was machst du so?" — Antworte so, dass er nachfragt.',
    category: 'smalltalk',
    difficulty: 'medium',
  },
  {
    id: 'st-07',
    text: 'Was war das Letzte, das dich wirklich überrascht hat?',
    category: 'smalltalk',
    difficulty: 'easy',
  },
  {
    id: 'st-08',
    text: 'Du sitzt neben einem Fremden im Zug. Wie beginnst du ein gutes Gespräch?',
    category: 'smalltalk',
    difficulty: 'medium',
  },
  {
    id: 'st-09',
    text: 'Was ist dein schlechtestes Smalltalk-Thema — und warum bringst du es trotzdem manchmal?',
    category: 'smalltalk',
    difficulty: 'easy',
  },
  {
    id: 'st-10',
    text: 'Empfehle jemandem ein Buch, Podcast oder Serie so, dass er oder sie es sofort ausprobieren will.',
    category: 'smalltalk',
    difficulty: 'easy',
  },
  {
    id: 'st-11',
    text: 'Erzähle etwas Überraschendes, das kaum jemand über dich weiß.',
    category: 'smalltalk',
    difficulty: 'medium',
  },
  {
    id: 'st-12',
    text: 'Du triffst einen alten Bekannten nach 3 Jahren. Wie fasst du dein Leben seitdem in 2 Minuten zusammen?',
    category: 'smalltalk',
    difficulty: 'medium',
  },
  {
    id: 'st-13',
    text: 'Was ist deine Meinung zu Urlaubszielen — und wohin würdest du nächstes Mal fahren?',
    category: 'smalltalk',
    difficulty: 'easy',
  },
  {
    id: 'st-14',
    text: 'Erkläre deinem Gesprächspartner, was du am Wochenende gemacht hast — mach es interessant.',
    category: 'smalltalk',
    difficulty: 'easy',
  },
  {
    id: 'st-15',
    text: 'Networking-Event: Du kennst niemanden. Wie gehst du in die ersten drei Gespräche?',
    category: 'smalltalk',
    difficulty: 'hard',
  },

  // ─── Erklärung / Teach-back ─────────────────────────────────────────────────
  {
    id: 'et-01',
    text: 'Erkläre einem Laien, wie ein Browser eine Website lädt — in 90 Sekunden.',
    category: 'erklaerung_teachback',
    difficulty: 'medium',
  },
  {
    id: 'et-02',
    text: 'Was ist KI, und was kann sie nicht — für jemanden, der noch nie davon gehört hat?',
    category: 'erklaerung_teachback',
    difficulty: 'easy',
  },
  {
    id: 'et-03',
    text: 'Erkläre den Unterschied zwischen UX und UI so, dass ihn eine Bäckerin versteht.',
    category: 'erklaerung_teachback',
    difficulty: 'easy',
  },
  {
    id: 'et-04',
    text: 'Was ist SEO, und warum sollte ein kleines Unternehmen es ernst nehmen?',
    category: 'erklaerung_teachback',
    difficulty: 'easy',
  },
  {
    id: 'et-05',
    text: 'Erkläre, warum Websites manchmal langsam sind — ohne technischen Jargon.',
    category: 'erklaerung_teachback',
    difficulty: 'medium',
  },
  {
    id: 'et-06',
    text: 'Was ist ein API? Erkläre es mit einer konkreten Alltagsanalogie.',
    category: 'erklaerung_teachback',
    difficulty: 'medium',
  },
  {
    id: 'et-07',
    text: 'Erkläre das Konzept "Mobile First" jemandem, der nur Desktop kennt.',
    category: 'erklaerung_teachback',
    difficulty: 'easy',
  },
  {
    id: 'et-08',
    text: 'Was ist der Unterschied zwischen einem Template und einer maßgeschneiderten Website?',
    category: 'erklaerung_teachback',
    difficulty: 'easy',
  },
  {
    id: 'et-09',
    text: 'Erkläre A/B-Testing so, dass ein Marketingleiter sofort versteht, warum er es braucht.',
    category: 'erklaerung_teachback',
    difficulty: 'medium',
  },
  {
    id: 'et-10',
    text: 'Was ist Conversion-Rate-Optimierung — erkläre es mit einem Ladengeschäft als Analogie.',
    category: 'erklaerung_teachback',
    difficulty: 'easy',
  },
  {
    id: 'et-11',
    text: 'Erkläre einem 10-Jährigen, was das Internet ist und wie es funktioniert.',
    category: 'erklaerung_teachback',
    difficulty: 'medium',
  },
  {
    id: 'et-12',
    text: 'Was ist der Unterschied zwischen Daten und Informationen? Erkläre es konkret.',
    category: 'erklaerung_teachback',
    difficulty: 'medium',
  },
  {
    id: 'et-13',
    text: 'Erkläre, was Hosting ist und warum es einen Unterschied macht — für jemanden mit keinem IT-Wissen.',
    category: 'erklaerung_teachback',
    difficulty: 'easy',
  },
  {
    id: 'et-14',
    text: 'Was ist Branding, und warum ist es mehr als nur ein Logo? Erkläre es mit einer Analogie.',
    category: 'erklaerung_teachback',
    difficulty: 'easy',
  },
  {
    id: 'et-15',
    text: 'Erkläre jemandem ohne Businesshintergrund, was ein Geschäftsmodell ist.',
    category: 'erklaerung_teachback',
    difficulty: 'easy',
  },
  {
    id: 'et-16',
    text: 'Was ist der Unterschied zwischen Umsatz und Gewinn? Erkläre es an einem konkreten Beispiel.',
    category: 'erklaerung_teachback',
    difficulty: 'easy',
  },
  {
    id: 'et-17',
    text: 'Erkläre Social-Media-Algorithmen jemandem, der nur weiß, was ein Like ist.',
    category: 'erklaerung_teachback',
    difficulty: 'medium',
  },
  {
    id: 'et-18',
    text: 'Was ist der Unterschied zwischen einem guten und einem schlechten Passwort? Erkläre es so, dass es wirklich hängen bleibt.',
    category: 'erklaerung_teachback',
    difficulty: 'easy',
  },
  {
    id: 'et-19',
    text: 'Erkläre, was "in der Cloud speichern" wirklich bedeutet — ohne Technikjargon.',
    category: 'erklaerung_teachback',
    difficulty: 'easy',
  },
  {
    id: 'et-20',
    text: 'Was ist Inflation und wie beeinflusst sie den Alltag? Erkläre es einem Teenager.',
    category: 'erklaerung_teachback',
    difficulty: 'medium',
  },
  {
    id: 'et-21',
    text: 'Erkläre Compound Interest (Zinseszins) so, dass jemand sofort versteht, warum er früh sparen sollte.',
    category: 'erklaerung_teachback',
    difficulty: 'medium',
  },
  {
    id: 'et-22',
    text: 'Was ist der Unterschied zwischen Introversion und Schüchternheit? Erkläre es mit einem Alltagsbeispiel.',
    category: 'erklaerung_teachback',
    difficulty: 'easy',
  },
  {
    id: 'et-23',
    text: 'Erkläre, wie Empathie in der Kommunikation konkret wirkt — nicht theoretisch.',
    category: 'erklaerung_teachback',
    difficulty: 'medium',
  },

  // ─── Streit / Position ──────────────────────────────────────────────────────
  {
    id: 'sp-01',
    text: 'Remote Work ist langfristig schlechter für die Karriere. Pro oder Contra — wähle eine Seite.',
    category: 'streit_position',
    difficulty: 'medium',
  },
  {
    id: 'sp-02',
    text: 'KI wird kreative Berufe in 10 Jahren nicht ersetzen. Verteidige diese These.',
    category: 'streit_position',
    difficulty: 'hard',
  },
  {
    id: 'sp-03',
    text: 'Verteidige die Meinung: "Zu günstige Preise schaden dem Kunden mehr als dem Anbieter."',
    category: 'streit_position',
    difficulty: 'hard',
  },
  {
    id: 'sp-04',
    text: 'Dein Gesprächspartner sagt: "Social Media ist reine Zeitverschwendung." Widersprich.',
    category: 'streit_position',
    difficulty: 'medium',
  },
  {
    id: 'sp-05',
    text: 'Verteidige eine kontroverse Meinung, die du wirklich hast — ohne dich zu verbiegen.',
    category: 'streit_position',
    difficulty: 'hard',
  },
  {
    id: 'sp-06',
    text: 'Jemand behauptet: "Branding ist Luxus für kleine Unternehmen." Widerleg das in 60 Sekunden.',
    category: 'streit_position',
    difficulty: 'medium',
  },
  {
    id: 'sp-07',
    text: 'Verteidige: "Weniger Features in einem Produkt sind meist besser als mehr."',
    category: 'streit_position',
    difficulty: 'medium',
  },
  {
    id: 'sp-08',
    text: 'Dein Kunde will unbedingt einen Slider auf der Website. Überzeuge ihn vom Gegenteil.',
    category: 'streit_position',
    difficulty: 'easy',
  },
  {
    id: 'sp-09',
    text: '"Universitätsabschlüsse werden in 10 Jahren irrelevant sein." Pro oder Contra.',
    category: 'streit_position',
    difficulty: 'hard',
  },
  {
    id: 'sp-10',
    text: 'Verteidige: "Wer keine Fehler macht, macht zu wenig."',
    category: 'streit_position',
    difficulty: 'easy',
  },
  {
    id: 'sp-11',
    text: '"Homeoffice tötet die Unternehmenskultur." Stimme zu oder widersprich — mit Argumenten.',
    category: 'streit_position',
    difficulty: 'medium',
  },
  {
    id: 'sp-12',
    text: 'Ein Kollege sagt: "Wir brauchen keine Prozesse, Vertrauen reicht." Wie antwortest du?',
    category: 'streit_position',
    difficulty: 'medium',
  },
  {
    id: 'sp-13',
    text: '"Selbständigkeit ist nichts für jeden — Sicherheit ist unterschätzt." Verteidige oder widersprich.',
    category: 'streit_position',
    difficulty: 'hard',
  },
  {
    id: 'sp-14',
    text: 'Verteidige: "Preistransparenz auf der Website schadet dem Verkauf."',
    category: 'streit_position',
    difficulty: 'medium',
  },
  {
    id: 'sp-15',
    text: '"Werbung ist manipulativ und sollte stärker reguliert werden." Pro oder Contra.',
    category: 'streit_position',
    difficulty: 'hard',
  },
  {
    id: 'sp-16',
    text: 'Jemand sagt: "Empfehlungen sind die einzige Marketing-Strategie, die wirklich zählt." Stimme zu oder widersprich.',
    category: 'streit_position',
    difficulty: 'medium',
  },
  {
    id: 'sp-17',
    text: 'Verteidige: "Gute Kommunikation ist die wichtigste Business-Fähigkeit — wichtiger als Fachkompetenz."',
    category: 'streit_position',
    difficulty: 'medium',
  },
  {
    id: 'sp-18',
    text: '"Meetings sind die größte Produktivitätsfalle in Unternehmen." Pro oder Contra.',
    category: 'streit_position',
    difficulty: 'easy',
  },

  // ─── Storytelling ───────────────────────────────────────────────────────────
  {
    id: 'ss-01',
    text: 'Erzähle einen peinlichen Moment aus deiner Arbeit — so, dass jemand am Ende lacht.',
    category: 'storytelling',
    difficulty: 'medium',
  },
  {
    id: 'ss-02',
    text: 'Was war dein bisher schwierigster Kunde, und was hast du daraus gelernt?',
    category: 'storytelling',
    difficulty: 'medium',
  },
  {
    id: 'ss-03',
    text: 'Erzähle, wie du dein Unternehmen gegründet hast — in der Version für ein Erstgespräch.',
    category: 'storytelling',
    difficulty: 'medium',
  },
  {
    id: 'ss-04',
    text: 'Beschreibe einen Moment, in dem du kurz vor dem Aufgeben warst — und was dich gehalten hat.',
    category: 'storytelling',
    difficulty: 'hard',
  },
  {
    id: 'ss-05',
    text: 'Erzähle eine beste Kindheitserinnerung — in 60 Sekunden, mit einem klaren Ende.',
    category: 'storytelling',
    difficulty: 'easy',
  },
  {
    id: 'ss-06',
    text: 'Beschreibe dein bisher erfolgreichstes Projekt — als wäre es eine Heldengeschichte.',
    category: 'storytelling',
    difficulty: 'medium',
  },
  {
    id: 'ss-07',
    text: 'Erzähle von einem Fehler, den du gemacht hast, der letztlich zu etwas Gutem geführt hat.',
    category: 'storytelling',
    difficulty: 'hard',
  },
  {
    id: 'ss-08',
    text: 'Was war ein Moment, in dem du dich richtig mutig gefühlt hast? Erzähle ihn konkret.',
    category: 'storytelling',
    difficulty: 'easy',
  },
  {
    id: 'ss-09',
    text: 'Beschreibe den Tag, an dem du wusstest: Das ist das Richtige für mich.',
    category: 'storytelling',
    difficulty: 'medium',
  },
  {
    id: 'ss-10',
    text: 'Erzähle eine Geschichte über jemanden, der dich völlig überrascht hat — positiv oder negativ.',
    category: 'storytelling',
    difficulty: 'easy',
  },
  {
    id: 'ss-11',
    text: 'Was war der beste Rat, den du je bekommen hast — und von wem? Erzähle den Kontext.',
    category: 'storytelling',
    difficulty: 'easy',
  },
  {
    id: 'ss-12',
    text: 'Erzähle eine Geschichte über eine Situation, in der Kommunikation alles gerettet — oder zerstört hat.',
    category: 'storytelling',
    difficulty: 'medium',
  },
  {
    id: 'ss-13',
    text: 'Beschreibe ein Projekt, das komplett aus dem Ruder gelaufen ist — und wie es trotzdem endete.',
    category: 'storytelling',
    difficulty: 'medium',
  },
  {
    id: 'ss-14',
    text: 'Erzähle von einer Begegnung mit einem Fremden, die dich unerwartet beeinflusst hat.',
    category: 'storytelling',
    difficulty: 'easy',
  },
  {
    id: 'ss-15',
    text: 'Was war das Verrückteste, das du je für einen Kunden oder eine Idee getan hast?',
    category: 'storytelling',
    difficulty: 'easy',
  },
  {
    id: 'ss-16',
    text: 'Erzähle die Geschichte deines bisher schlimmsten Arbeitstages — mit einem Lernmoment am Ende.',
    category: 'storytelling',
    difficulty: 'hard',
  },
  {
    id: 'ss-17',
    text: 'Beschreibe jemanden, den du bewunderst — nicht was er getan hat, sondern wer er ist.',
    category: 'storytelling',
    difficulty: 'medium',
  },
  {
    id: 'ss-18',
    text: 'Erzähle von einem Moment, in dem du realisiert hast, dass du falsch lagst — und was du geändert hast.',
    category: 'storytelling',
    difficulty: 'hard',
  },
  {
    id: 'ss-19',
    text: 'Was war die mutigste geschäftliche Entscheidung, die du je getroffen hast?',
    category: 'storytelling',
    difficulty: 'medium',
  },
  {
    id: 'ss-20',
    text: 'Erzähle eine Geschichte, in der Vertrauen — beruflich oder privat — eine zentrale Rolle gespielt hat.',
    category: 'storytelling',
    difficulty: 'medium',
  },
]

export function getRandomTopic(filters?: {
  category?: TopicCategory
  difficulty?: TopicDifficulty
}): Topic {
  let pool = topics

  if (filters?.category) {
    pool = pool.filter((t) => t.category === filters.category)
  }
  if (filters?.difficulty) {
    pool = pool.filter((t) => t.difficulty === filters.difficulty)
  }

  if (pool.length === 0) pool = topics

  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]!
}

export function getAllTopics(): Topic[] {
  return topics
}

export { topics }
