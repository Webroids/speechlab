'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import './landing.css'

export function LandingContent() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const onScroll = () => nav.classList.toggle('lp-nav-scrolled', window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="lp-page">

      {/* ── NAV ─────────────────────────────────────────────── */}
      <header className="lp-nav" ref={navRef}>
        <div className="lp-wrap lp-nav-inner">
          <Link href="/" className="lp-brand">
            <Image src="/icon.png" alt="SpeechLab" width={32} height={32} className="rounded-lg" />
            <span>SpeechLab</span>
          </Link>
          <nav className="lp-nav-links">
            <a href="#funktion">So funktioniert&apos;s</a>
            <a href="#frameworks">Frameworks</a>
            <a href="#fortschritt">Fortschritt</a>
            <Link href="/login" className="lp-btn-link">Anmelden</Link>
            <Link href="/register" className="lp-btn lp-btn-primary">Kostenlos starten</Link>
          </nav>
        </div>
      </header>

      <main>

        {/* ── HERO ────────────────────────────────────────────── */}
        <section className="lp-wrap lp-hero">
          <div>
            <div className="lp-hero-eyebrow">
              <span className="lp-dot" />
              <span>Beta · Deutschsprachig · PWA</span>
            </div>
            <h1>
              Sprich klarer.
              <em>Wirke schärfer.</em>
            </h1>
            <p className="lp-hero-lede">
              SpeechLab nimmt dich beim Reden auf, transkribiert jedes Wort und zeigt dir präzise, was angekommen ist — und was zwischen den Ähms verloren ging. Persönliches Kommunikationstraining, das du heute auf der U-Bahn-Fahrt machen kannst.
            </p>
            <div className="lp-hero-ctas">
              <Link href="/register" className="lp-btn lp-btn-primary">Aufnahme starten →</Link>
              <a href="#funktion" className="lp-btn lp-btn-ghost">Wie es funktioniert</a>
            </div>
            <div className="lp-hero-meta">
              <span className="lp-hero-meta-item">
                <span className="lp-dot" style={{ background: 'var(--vl-coral)' }} />
                50+ deutsche Themen
              </span>
              <span className="lp-hero-meta-item">
                <span className="lp-dot" style={{ background: 'var(--vl-sage)' }} />
                10+ Frameworks
              </span>
              <span className="lp-hero-meta-item">
                <span className="lp-dot" style={{ background: 'var(--vl-lavender)' }} />
                Körpersprache-Analyse
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="lp-hero-visual" aria-hidden="true">
            {/* Score card */}
            <div className="lp-mock-card lp-mock-score">
              <div className="lp-mock-score-top">
                <span className="vl-label-caps">Feedback · Vor 2 Min</span>
                <span className="vl-label-caps" style={{ color: 'oklch(0.45 0.14 145)' }}>analysiert</span>
              </div>
              <div className="lp-mock-score-arc">
                <svg viewBox="0 0 220 130" width="220" height="130">
                  <defs>
                    <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="oklch(0.85 0.18 95)" />
                      <stop offset="30%" stopColor="oklch(0.80 0.18 80)" />
                      <stop offset="60%" stopColor="oklch(0.70 0.20 35)" />
                      <stop offset="85%" stopColor="oklch(0.70 0.20 10)" />
                      <stop offset="100%" stopColor="oklch(0.65 0.22 295)" />
                    </linearGradient>
                  </defs>
                  <path d="M 16 116 A 94 94 0 0 1 204 116" fill="none"
                    stroke="oklch(0.140 0.015 55 / 8%)" strokeWidth="14" strokeLinecap="round" />
                  <path d="M 16 116 A 94 94 0 0 1 204 116" fill="none"
                    stroke="url(#arcGrad)" strokeWidth="14" strokeLinecap="round"
                    strokeDasharray="295.3" strokeDashoffset="76.8" />
                  <circle cx="195" cy="80" r="6" fill="var(--vl-coral)" stroke="var(--card)" strokeWidth="3" />
                </svg>
                <div className="lp-num">74<small>/100</small></div>
              </div>
              <div className="lp-mock-score-label">stark gestartet — <em>Pointe verblasst.</em></div>
              <div className="lp-mock-sub-row">
                {[
                  { color: 'var(--vl-lavender)', offset: '28.3', val: '7', lbl: 'Struktur' },
                  { color: 'var(--vl-ocean)',    offset: '18.8', val: '8', lbl: 'Klarheit' },
                  { color: 'oklch(0.70 0.16 145)', offset: '37.7', val: '6', lbl: 'Engagement' },
                ].map(({ color, offset, val, lbl }) => (
                  <div key={lbl} className="lp-mock-sub">
                    <svg width="36" height="36" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none"
                        stroke="oklch(0.140 0.015 55 / 8%)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none"
                        stroke={color} strokeWidth="3"
                        strokeDasharray="94.2" strokeDashoffset={offset}
                        transform="rotate(-90 18 18)" strokeLinecap="round" />
                    </svg>
                    <div className="lp-stat">
                      {val}<small style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>/10</small>
                    </div>
                    <div className="lp-lbl">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mic FAB */}
            <div className="lp-mock-mic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </div>

            {/* Transcript card */}
            <div className="lp-mock-card lp-mock-transcript">
              <div className="lp-label-row">
                <span className="vl-label-caps">Transkript · Auszug</span>
                <span className="vl-label-caps">142 WPM</span>
              </div>
              <p className="lp-quote">
                „Also <span className="lp-filler">ähm</span>, wir haben da diese Idee — und{' '}
                <span className="lp-hedge">ich denke</span>, das könnte für euch{' '}
                <span className="lp-hedge">vielleicht</span> spannend sein."
              </p>
            </div>
          </div>
        </section>

        {/* ── STRIP ───────────────────────────────────────────── */}
        <section className="lp-strip" aria-label="Kerneigenschaften">
          <div className="lp-wrap lp-strip-inner">
            {[
              { color: 'var(--vl-coral)',    label: 'Whisper Transkription' },
              { color: 'var(--vl-lavender)', label: 'Claude Sonnet 4.6 Feedback' },
              { color: 'var(--vl-ocean)',    label: 'MediaPipe im Browser' },
              { color: 'var(--vl-sage)',     label: 'Supabase · Magic Link' },
              { color: 'var(--vl-amber)',    label: 'RLS pro Nutzer' },
            ].map(({ color, label }) => (
              <div key={label} className="lp-strip-item">
                <span className="lp-dot" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* ── CORE LOOP ───────────────────────────────────────── */}
        <section className="lp-wrap lp-section" id="funktion">
          <div className="lp-section-head">
            <p className="vl-label-caps">So funktioniert&apos;s</p>
            <h2>Sechs Schritte — von der Aufnahme bis zum <em>nächsten Drill.</em></h2>
            <p className="lp-lede">Der Loop ist absichtlich kurz. Du redest, das Modell hört zu, du siehst sofort, was geklappt hat — und beim nächsten Mal redest du anders.</p>
          </div>
          <div className="lp-steps">
            {[
              { n: '01', lbl: 'Thema',     title: 'Wähle ein Thema',         desc: '50+ kuratierte deutsche Themen in sechs Kategorien — von Pitch bis Smalltalk. Oder lass das Modell eines vorschlagen.' },
              { n: '02', lbl: 'Setup',     title: 'Konfiguriere die Session', desc: 'Dauer von 30 Sekunden bis 5 Minuten. Optional: ein Sprech-Framework wie PREP, STAR oder Monroe.' },
              { n: '03', lbl: 'Aufnahme',  title: 'Rede los — Audio oder Video', desc: 'Live-Wellenform, Countdown, ein einziger Knopf. Der Rest ist still — bis du fertig bist.' },
              { n: '04', lbl: 'Analyse',   title: 'Whisper, Metriken, Claude', desc: 'Transkription mit Wort-Timestamps, Metrik-Engine für WPM und Füllwörter, dann Claude für strukturiertes Feedback.' },
              { n: '05', lbl: 'Feedback',  title: 'Score & Voice-Timeline',   desc: '0–100 mit Sub-Scores. Jede Empfehlung mit Originalzitat aus deinem Transkript — kein vages „mehr Energie".' },
              { n: '06', lbl: 'Fortschritt', title: 'Streak & Trends',        desc: 'Wochenziel, Streak-Counter, Score-Verlauf über die letzten 20 Aufnahmen. Sieh, wo du besser wirst — und wo nicht.' },
            ].map(({ n, lbl, title, desc }) => (
              <article key={n} className="lp-step">
                <span className="lp-step-num">{n}</span>
                <span className="vl-label-caps">{lbl}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── RECORDING MODES ─────────────────────────────────── */}
        <section className="lp-wrap lp-section" id="modi">
          <div className="lp-section-head">
            <p className="vl-label-caps">Aufnahme-Modi</p>
            <h2>Zwei Modi — für zwei sehr <em>verschiedene</em> Situationen.</h2>
            <p className="lp-lede">Das Modell weiß, ob du im Gespräch oder vor Publikum übst. WPM-Zielbereich und Toleranz für Pausen passen sich an.</p>
          </div>
          <div className="lp-modes">
            <article className="lp-mode">
              <div className="lp-mode-top">
                <div>
                  <p className="vl-label-caps" style={{ margin: '0 0 6px' }}>Modus · Gespräch</p>
                  <h3>Übung & Gespräch</h3>
                </div>
                <div className={`lp-mode-glyph lp-mode-glyph-conv`}>◆</div>
              </div>
              <p>Für kurze Drills im Alltag — Pitch im Aufzug, Smalltalk im Café, eine schwierige Frage in der Sitzung.</p>
              <div className="lp-duration">5<small>min · max</small></div>
              <div className="lp-mode-stats">
                {[['WPM Ziel', '130–160'], ['Füllwörter', '≤ 3'], ['Toleranz', 'Eng']].map(([k, v]) => (
                  <div key={k} className="lp-pair">
                    <span className="lp-k">{k}</span>
                    <span className="lp-v">{v}</span>
                  </div>
                ))}
              </div>
            </article>
            <article className="lp-mode">
              <div className="lp-mode-top">
                <div>
                  <p className="vl-label-caps" style={{ margin: '0 0 6px' }}>Modus · Bühne</p>
                  <h3>Präsentation & Pitch</h3>
                </div>
                <div className={`lp-mode-glyph lp-mode-glyph-pres`}>⊕</div>
              </div>
              <p>Für längere Vorträge mit bewussten Pausen. Mehr Raum für Spannungsbögen — weniger Sanktion für drei Sekunden Stille.</p>
              <div className="lp-duration">20<small>min · max</small></div>
              <div className="lp-mode-stats">
                {[['WPM Ziel', '110–140'], ['Füllwörter', '≤ 6'], ['Toleranz', 'Locker']].map(([k, v]) => (
                  <div key={k} className="lp-pair">
                    <span className="lp-k">{k}</span>
                    <span className="lp-v">{v}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* ── DIMENSIONS ──────────────────────────────────────── */}
        <section className="lp-wrap lp-section" id="feedback">
          <div className="lp-section-head">
            <p className="vl-label-caps">Feedback-Dimensionen</p>
            <h2>Vier Achsen. Jede Empfehlung mit echtem <em>Zitat.</em></h2>
            <p className="lp-lede">Kein „mehr Klarheit" ohne Beleg. Claude bekommt deinen vollständigen Transkript plus die rohen Metriken — und muss jeden Vorschlag an einer konkreten Stelle festmachen.</p>
          </div>
          <div className="lp-dims">
            <article className="lp-dim lp-dim-struktur">
              <div className="lp-dim-tile">◇</div>
              <div>
                <p className="lp-what">Roter Faden · Frameworks</p>
                <h3>Struktur</h3>
              </div>
              <p>Erkennt PREP, STAR, 1-2-3, PEEL, Monroe, Minto, Hook-Story-Offer. Bewertet Übergänge und ob deine Pointe trägt.</p>
              <div className="lp-score">
                <span className="lp-big">7</span>
                <span className="lp-max">/10</span>
                <span className="lp-delta">+1</span>
              </div>
            </article>
            <article className="lp-dim lp-dim-klarheit">
              <div className="lp-dim-tile">◈</div>
              <div>
                <p className="lp-what">Satzlänge · Wortwahl</p>
                <h3>Klarheit</h3>
              </div>
              <p>Sentence complexity, Vokabular, Direktheit. Erklärst du es so, dass ein 12-Jähriger folgt — oder versteckst du dich hinter Substantiven?</p>
              <div className="lp-score">
                <span className="lp-big">8</span>
                <span className="lp-max">/10</span>
                <span className="lp-delta">+2</span>
              </div>
            </article>
            <article className="lp-dim lp-dim-delivery">
              <div className="lp-dim-tile">◐</div>
              <div>
                <p className="lp-what">WPM · Füllwörter · Pausen</p>
                <h3>Delivery</h3>
              </div>
              <p>142 WPM. 4 × „ähm". 2 × „ich denke". Eine 5,3-Sekunden-Pause. Alles im Voice-Timeline-Marker direkt am Wort.</p>
              <div className="lp-score">
                <span className="lp-big">142</span>
                <span className="lp-max">WPM</span>
                <span className={`lp-delta lp-delta-down`}>−4</span>
              </div>
            </article>
            <article className="lp-dim lp-dim-engage">
              <div className="lp-dim-tile">★</div>
              <div>
                <p className="lp-what">Hook · Storytelling</p>
                <h3>Engagement</h3>
              </div>
              <p>Die ersten 10 Sekunden zählen doppelt. Misst Hook-Qualität, Story-Elemente, konkrete Bilder vs. abstrakte Behauptungen.</p>
              <div className="lp-score">
                <span className="lp-big">6</span>
                <span className="lp-max">/10</span>
                <span className="lp-delta">+0</span>
              </div>
            </article>
          </div>
        </section>

        {/* ── FRAMEWORKS ──────────────────────────────────────── */}
        <section className="lp-wrap lp-section" id="frameworks">
          <div className="lp-frameworks">
            <div className="lp-fw-grid">
              {[
                { tile: 'coral',    glyph: '◆', name: '1-2-3',           when: 'Drei Punkte, klar gezählt' },
                { tile: 'amber',    glyph: '✶', name: 'PREP',            when: 'Position, Reason, Example, Position' },
                { tile: 'amber',    glyph: '★', name: 'STAR',            when: 'Situation, Task, Action, Result' },
                { tile: 'lavender', glyph: '⊕', name: 'SCQ',             when: 'Situation, Komplikation, Frage' },
                { tile: 'mint',     glyph: '◇', name: 'FAB',             when: 'Feature, Advantage, Benefit' },
                { tile: 'ocean',    glyph: '◐', name: 'Hook-Story-Offer', when: 'Aufmerksamkeit, Beweis, Angebot' },
                { tile: 'rose',     glyph: '○', name: 'Monroe',          when: 'Motivated Sequence' },
                { tile: 'lavender', glyph: '⊕', name: 'Minto',           when: 'Pyramide — Antwort zuerst' },
              ].map(({ tile, glyph, name, when }) => (
                <article key={name} className="lp-fw-card">
                  <div className={`lp-fw-tile lp-fw-tile-${tile}`}>{glyph}</div>
                  <div>
                    <div className="lp-fw-name">{name}</div>
                    <div className="lp-fw-when">{when}</div>
                  </div>
                </article>
              ))}
            </div>
            <aside className="lp-fw-side">
              <p className="vl-label-caps">Frameworks-Bibliothek</p>
              <h3>Zehn Sprech-Frameworks — <em>als wären sie deine.</em></h3>
              <p>Jedes Framework mit voller Erklärung: wann du es brauchst, wie es aufgebaut ist, Beispieleinstiege. Wählst du eines im Setup, fließt es in den Claude-Prompt ein — die Analyse misst dann gegen diese Struktur.</p>
              <ul className="lp-fw-list">
                <li><span className="lp-arrow">→</span> Schritt-für-Schritt-Aufbau pro Framework</li>
                <li><span className="lp-arrow">→</span> Beispieleinstiege auf Deutsch</li>
                <li><span className="lp-arrow">→</span> Auto-Erkennung beim Feedback</li>
                <li><span className="lp-arrow">→</span> Empfohlene Themen-Kategorien</li>
              </ul>
            </aside>
          </div>
        </section>

        {/* ── PROGRESS ────────────────────────────────────────── */}
        <section className="lp-wrap lp-section" id="fortschritt">
          <div className="lp-section-head">
            <p className="vl-label-caps">Fortschritt</p>
            <h2>Trends über Zeit — keine <em>Wohlfühl-Charts.</em></h2>
            <p className="lp-lede">Streak, Wochenziel, Score-Verlauf, Top-Füllwörter aggregiert über alle Aufnahmen. Genug, um zu sehen, wo du wirklich besser wirst — und wo du dich wiederholst.</p>
          </div>
          <div className="lp-progress">
            <article className="lp-chart-card">
              <div className="lp-chart-top">
                <h3>Score-Verlauf · Letzte 20</h3>
                <div className="lp-chart-meta">
                  <span><span className="lp-legend-dot" style={{ background: 'var(--vl-coral)' }} />Overall</span>
                  <span><span className="lp-legend-dot" style={{ background: 'var(--vl-lavender)' }} />Struktur</span>
                  <span><span className="lp-legend-dot" style={{ background: 'var(--vl-ocean)' }} />Klarheit</span>
                </div>
              </div>
              <svg viewBox="0 0 640 280" preserveAspectRatio="none">
                <rect x="0" y="80" width="640" height="80" fill="oklch(0.70 0.16 145 / 8%)" />
                <g stroke="oklch(0.140 0.015 55 / 6%)" strokeWidth="1">
                  <line x1="0" y1="40" x2="640" y2="40" />
                  <line x1="0" y1="120" x2="640" y2="120" />
                  <line x1="0" y1="200" x2="640" y2="200" />
                  <line x1="0" y1="260" x2="640" y2="260" />
                </g>
                <path d="M0,180 L34,170 L67,178 L101,160 L134,158 L168,165 L202,140 L235,142 L269,128 L303,135 L336,118 L370,124 L403,108 L437,110 L471,98 L504,104 L538,90 L572,95 L605,86 L640,82"
                  fill="none" stroke="var(--vl-ocean)" strokeWidth="2" strokeLinejoin="round" opacity="0.7" />
                <path d="M0,210 L34,205 L67,212 L101,195 L134,202 L168,180 L202,185 L235,170 L269,175 L303,162 L336,170 L370,148 L403,155 L437,140 L471,148 L504,128 L538,130 L572,118 L605,124 L640,112"
                  fill="none" stroke="var(--vl-lavender)" strokeWidth="2" strokeLinejoin="round" opacity="0.7" />
                <path d="M0,200 L34,195 L67,180 L101,182 L134,168 L168,170 L202,150 L235,158 L269,140 L303,145 L336,120 L370,128 L403,108 L437,114 L471,96 L504,100 L538,80 L572,86 L605,68 L640,64"
                  fill="none" stroke="var(--vl-coral)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                <circle cx="640" cy="64" r="5" fill="var(--vl-coral)" stroke="var(--card)" strokeWidth="2" />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                <span className="vl-label-caps">Apr 28</span>
                <span className="vl-label-caps">Heute</span>
              </div>
            </article>
            <div className="lp-stat-grid">
              <article className="lp-stat-card">
                <p className="vl-label-caps">Streak</p>
                <div className="lp-stat-row">
                  <span className="lp-big">7<small> Tage</small></span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'oklch(0.45 0.14 145)' }}>+1 heute</span>
                </div>
                <span className="lp-sub">Ein kurzer Drill hält den Streak am Leben.</span>
              </article>
              <article className="lp-stat-card">
                <p className="vl-label-caps">Wochenziel</p>
                <div className="lp-stat-row">
                  <span className="lp-big">3<small> / 5</small></span>
                  <div className="lp-pellets">
                    <span className="lp-on" /><span className="lp-on" /><span className="lp-on" />
                    <span /><span />
                  </div>
                </div>
                <span className="lp-sub">Noch zwei Aufnahmen bis Sonntag.</span>
              </article>
              <article className="lp-stat-card">
                <p className="vl-label-caps">Avg Score · 30 Tage</p>
                <div className="lp-stat-row">
                  <span className="lp-big">74<small> /100</small></span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'oklch(0.45 0.14 145)' }}>+8 ggü. Vormonat</span>
                </div>
                <span className="lp-sub">Stärkster Sprung: Klarheit.</span>
              </article>
            </div>
          </div>
        </section>

        {/* ── BODY LANGUAGE ───────────────────────────────────── */}
        <section className="lp-wrap lp-section" id="koerper">
          <div className="lp-section-head">
            <p className="vl-label-caps">Körpersprache · Video-Modus</p>
            <h2>Auch wie du dastehst — <em>zählt.</em></h2>
            <p className="lp-lede">MediaPipe läuft im Browser, keine Cloud, keine Latenz. Direkt nach der Aufnahme analysiert es jedes Frame auf Blickkontakt, Haltung, Kopfstabilität und Gestik.</p>
          </div>
          <div className="lp-body-row">
            <div className="lp-body-text">
              <h3>Vier Signale — <em>still ausgewertet.</em></h3>
              <p>Die Auswertung passiert lokal nach dem Stop-Knopf. Was die Kamera sah, bleibt im Browser — auf den Server kommt nur das fertige <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875em' }}>body_samples</code>-JSON.</p>
              <ul className="lp-body-bullets">
                {[
                  { k: 'Blickkontakt', v: 'Anteil der Frames mit direktem Blick zur Kamera — nicht zu starr, nicht zu unstet.' },
                  { k: 'Haltung', v: 'Schulterlinie und Wirbelsäulen-Winkel. Wann sackst du in dich zusammen?' },
                  { k: 'Kopfstabilität', v: 'Mikro-Bewegungen pro Sekunde. Zu viel Nicken liest sich als unsicher.' },
                  { k: 'Gestik', v: 'Hand-Aktivität in den Zonen. Zu wenig wirkt steif — zu viel überlagert die Worte.' },
                ].map(({ k, v }) => (
                  <li key={k}>
                    <span className="lp-k">{k}</span>
                    <span className="lp-v">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lp-body-mock" aria-hidden="true">
              <div className="lp-body-frame">
                <div className="lp-body-silhouette">
                  <svg viewBox="0 0 240 320" fill="none" stroke="oklch(0.140 0.015 55 / 18%)" strokeWidth="1.5">
                    <ellipse cx="120" cy="78" rx="40" ry="48" />
                    <path d="M40 320 C 44 230, 64 178, 88 152 L 152 152 C 176 178, 196 230, 200 320" />
                    <path d="M104 122 L 100 152 M 136 122 L 140 152" />
                  </svg>
                </div>
                <div className="lp-pose-pt" style={{ left: '50%', top: '25%' }} />
                <div className="lp-pose-pt" style={{ left: '42%', top: '36%', background: 'var(--vl-lavender)', boxShadow: '0 0 0 4px oklch(0.65 0.22 295 / 22%)' }} />
                <div className="lp-pose-pt" style={{ left: '58%', top: '36%', background: 'var(--vl-lavender)', boxShadow: '0 0 0 4px oklch(0.65 0.22 295 / 22%)' }} />
                <div className="lp-pose-pt" style={{ left: '36%', top: '48%', background: 'var(--vl-ocean)', boxShadow: '0 0 0 4px oklch(0.65 0.18 235 / 22%)' }} />
                <div className="lp-pose-pt" style={{ left: '64%', top: '48%', background: 'var(--vl-ocean)', boxShadow: '0 0 0 4px oklch(0.65 0.18 235 / 22%)' }} />
                <div className="lp-gaze-label">Blick · 78 %</div>
              </div>
              <div className="lp-body-stats">
                {[
                  { k: 'Blickkontakt', v: '78', unit: ' %' },
                  { k: 'Haltung',      v: 'stabil', unit: '' },
                  { k: 'Gestik',       v: 'moderat', unit: '' },
                ].map(({ k, v, unit }) => (
                  <div key={k} className="lp-body-stat">
                    <span className="lp-k">{k}</span>
                    <span className="lp-v">{v}<small>{unit}</small></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ───────────────────────────────────────── */}
        <section className="lp-final" id="start">
          <div className="lp-wrap lp-final-inner">
            <div>
              <p className="vl-label-caps" style={{ margin: '0 0 16px' }}>Bereit?</p>
              <h2>Starte heute. <em>Heute. Nicht morgen.</em></h2>
              <p className="lp-final-lede">Drei Minuten reichen für den ersten Drill. Magic Link per Mail, keine Kreditkarte, kein Passwort — und dann ist die erste Aufnahme schon vorbei.</p>
              <div className="lp-hero-ctas">
                <Link href="/register" className="lp-btn lp-btn-primary">Aufnahme starten →</Link>
                <Link href="/upload" className="lp-btn lp-btn-ghost">Datei hochladen</Link>
              </div>
            </div>
            <div className="lp-final-side">
              {[
                { color: 'var(--vl-coral)',    text: 'Aufnahme bis 5 Minuten',    label: 'Audio · Video' },
                { color: 'var(--vl-lavender)', text: 'Upload bestehender Dateien', label: 'MP3 · MP4 · 24 MB' },
                { color: 'var(--vl-ocean)',    text: 'Magic-Link Login',           label: 'Supabase Auth' },
                { color: 'var(--vl-sage)',     text: 'Strikte RLS pro Nutzer',     label: 'Deine Daten' },
              ].map(({ color, text, label }) => (
                <div key={text} className="lp-final-row">
                  <span className="lp-row-dot" style={{ background: color }} />
                  <span>{text}</span>
                  <span className="lp-row-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="lp-wrap lp-footer">
        <div className="lp-foot-grid">
          <div className="lp-foot-brand">
            <Link href="/" className="lp-brand">
              <Image src="/icon.png" alt="SpeechLab" width={32} height={32} className="rounded-lg" />
              <span>SpeechLab</span>
            </Link>
            <p>Personal communication training. Ein Produkt von Webroids — Beta, deutschsprachig, PWA.</p>
          </div>
          <div>
            <h4>Produkt</h4>
            <ul>
              <li><a href="#funktion">So funktioniert&apos;s</a></li>
              <li><a href="#frameworks">Frameworks</a></li>
              <li><a href="#feedback">Feedback-Dimensionen</a></li>
              <li><a href="#fortschritt">Fortschritt</a></li>
            </ul>
          </div>
          <div>
            <h4>Ressourcen</h4>
            <ul>
              <li><Link href="/topics">Themen-Bibliothek</Link></li>
              <li><Link href="/frameworks">Framework-Guide</Link></li>
              <li><a href="#">Changelog</a></li>
              <li><a href="#">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4>Rechtliches</h4>
            <ul>
              <li><a href="#">Impressum</a></li>
              <li><a href="#">Datenschutz</a></li>
              <li><a href="#">AGB</a></li>
              <li><a href="#">Kontakt</a></li>
            </ul>
          </div>
        </div>
        <div className="lp-foot-bottom">
          <span>© 2026 Webroids · SpeechLab Beta</span>
          <div className="lp-tech">
            <span>Next.js 16</span>
            <span>Supabase</span>
            <span>Whisper</span>
            <span>Claude Sonnet 4.6</span>
            <span>MediaPipe</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
