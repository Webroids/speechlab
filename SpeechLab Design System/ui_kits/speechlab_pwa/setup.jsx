/* global React, LabelCaps, Pill, FilterPill, Button, Icon,
   SL_CATEGORIES, SL_CATEGORY_TIPS, SL_FRAMEWORKS, SL_TOPICS */

const { useState: useStateS, useMemo: useMemoS } = React;

const setupCard = {
  background: 'var(--card)',
  border: '1px solid var(--vl-hairline)',
  borderRadius: 20,
  boxShadow: 'var(--vl-inset)',
};

const setupWrap = {
  padding: '54px 18px 28px',
  maxWidth: 480,
  margin: '0 auto',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
};

// Recommended framework per category (from frameworks.ts → app/frameworks)
const RECOMMENDED = {
  business_pitch:        'prep',
  storytelling:          'star',
  streit_position:       'prep',
  erklaerung_teachback:  '1-2-3',
  smalltalk:             'hook',
  persoenlich_reflexion: '1-2-3',
};

// Convert seconds to a nicely-formatted label
const durLabel = (s) => s < 60 ? `${s}s` : `${s/60} min`;

// ── Stepper at top — three segments, coral fills as you advance ───────────
function Stepper({ step }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
      {[1, 2, 3].map((s) => (
        <div key={s} style={{
          flex: 1, height: 4, borderRadius: 9999,
          background: s <= step ? 'var(--vl-coral)' : 'var(--muted)',
          transition: 'background 200ms',
        }} />
      ))}
    </div>
  );
}

// Wraps each step: stepper, back arrow + heading, content, primary CTA
function StepShell({ step, eyebrow, title, titleEm, onBack, children, primary }) {
  return (
    <div style={setupWrap}>
      <Stepper step={step} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 22 }}>
        <button onClick={onBack} aria-label="Zurück" style={{
          width: 36, height: 36, borderRadius: 9999, flexShrink: 0,
          background: 'var(--secondary)', border: '1px solid var(--vl-hairline)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          color: 'var(--foreground)',
        }}>
          <Icon name="arrowLeft" size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 6 }}><LabelCaps>{eyebrow}</LabelCaps></div>
          <h2 style={{
            margin: 0, fontFamily: 'var(--font-display)', fontSize: 28,
            lineHeight: 1.25, letterSpacing: '-0.02em', fontWeight: 400,
            paddingBottom: 2,
          }}>
            {title} <em style={{ color: 'var(--muted-foreground)' }}>{titleEm}</em>
          </h2>
        </div>
      </div>

      <div style={{ flex: 1 }}>{children}</div>

      <div style={{ marginTop: 24 }}>{primary}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// STEP 1 — Topic
// ─────────────────────────────────────────────────────────────────────────
function SetupStep1({ value, onChange, onCancel, onNext }) {
  const { source, custom, category, difficulty, topicIdx } = value;

  const filtered = useMemoS(() =>
    SL_TOPICS.filter(t =>
      (category === 'all' || t.category === category) &&
      (difficulty === 'all' || t.difficulty === difficulty)
    ), [category, difficulty]);
  const topic = filtered[topicIdx % Math.max(1, filtered.length)] ?? SL_TOPICS[0];
  const cat = SL_CATEGORIES[topic.category];

  const ready = source === 'custom' ? custom.trim().length > 3 : !!topic;

  function set(patch) { onChange({ ...value, ...patch }); }

  return (
    <StepShell
      step={1}
      eyebrow="SCHRITT 1 VON 3"
      title="Worüber sprichst du"
      titleEm="heute?"
      onBack={onCancel}
      primary={
        <Button variant="primary" full icon={<Icon name="arrowRight" size={16} />}
                onClick={() => ready && onNext({ ...value, resolvedTopic: source === 'custom' ? { id: 'custom', text: custom.trim(), category: 'business_pitch', difficulty: 'medium' } : topic })}
                style={{ padding: '14px 18px', fontSize: 14, opacity: ready ? 1 : 0.5, cursor: ready ? 'pointer' : 'not-allowed' }}>
          Weiter
        </Button>
      }
    >
      {/* Source toggle */}
      <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--secondary)', borderRadius: 14, marginBottom: 18 }}>
        {[
          { id: 'random', label: 'Zufällig' },
          { id: 'custom', label: 'Eigenes Thema' },
        ].map((opt) => (
          <button key={opt.id} onClick={() => set({ source: opt.id })} style={{
            flex: 1, padding: '9px 0', borderRadius: 10,
            background: source === opt.id ? 'var(--background)' : 'transparent',
            color: source === opt.id ? 'var(--foreground)' : 'var(--muted-foreground)',
            border: 'none', fontSize: 13, fontWeight: source === opt.id ? 600 : 500,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: source === opt.id ? '0 1px 3px oklch(0.14 0.015 55 / 8%)' : 'none',
            transition: 'all 150ms',
          }}>{opt.label}</button>
        ))}
      </div>

      {source === 'random' && (
        <>
          {/* Category pills */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}><LabelCaps>KATEGORIE</LabelCaps></div>
            <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
              <FilterPill active={category === 'all'} onClick={() => set({ category: 'all', topicIdx: 0 })}>Alle</FilterPill>
              {Object.entries(SL_CATEGORIES).map(([id, c]) => (
                <FilterPill key={id} active={category === id} onClick={() => set({ category: id, topicIdx: 0 })} dotColor={c.color}>{c.label}</FilterPill>
              ))}
            </div>
          </div>

          {/* Difficulty segmented */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ marginBottom: 8 }}><LabelCaps>SCHWIERIGKEIT</LabelCaps></div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[['all','Alle'],['easy','Leicht'],['medium','Mittel'],['hard','Schwer']].map(([id, lbl]) => (
                <button key={id} onClick={() => set({ difficulty: id, topicIdx: 0 })} style={{
                  flex: 1, padding: '9px 0', borderRadius: 12, fontSize: 12, fontWeight: 500,
                  background: difficulty === id ? 'var(--foreground)' : 'var(--card)',
                  color: difficulty === id ? 'var(--background)' : 'var(--muted-foreground)',
                  border: difficulty === id ? '1px solid transparent' : '1px solid var(--vl-hairline)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{lbl}</button>
              ))}
            </div>
          </div>

          {/* Topic preview */}
          <div style={{ ...setupCard, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: 9999, background: cat.color }} />
              <LabelCaps color={cat.accent}>{cat.label.toUpperCase()}</LabelCaps>
            </div>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 19, lineHeight: 1.3, letterSpacing: '-0.015em' }}>
              {topic.text}
            </p>
            <button onClick={() => set({ topicIdx: topicIdx + 1 })} style={{
              marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px 6px 10px', borderRadius: 9999,
              border: '1px solid var(--vl-hairline)', background: 'var(--background)',
              color: 'var(--foreground)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              <Icon name="dices" size={14} /> Neues Thema würfeln
            </button>
          </div>
        </>
      )}

      {source === 'custom' && (
        <>
          <div style={{ marginBottom: 8 }}><LabelCaps>DEIN THEMA</LabelCaps></div>
          <textarea
            rows={5} value={custom} onChange={(e) => set({ custom: e.target.value })}
            placeholder={'z. B. "Erkläre, warum dein Lieblingsprodukt funktioniert."\nBeschreibe das Thema so, wie du darüber sprechen willst.'}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 16,
              background: 'var(--card)', border: '1px solid var(--vl-hairline)',
              boxShadow: 'var(--vl-inset)',
              color: 'var(--foreground)', fontSize: 14, lineHeight: 1.5, outline: 'none',
              fontFamily: 'inherit', resize: 'none', minHeight: 130,
            }}
          />
          <p style={{ marginTop: 10, fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
            Konkrete Themen funktionieren besser. Nenne den Kontext, das Publikum und das Ziel.
          </p>
        </>
      )}
    </StepShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// STEP 2 — Framework (with recommended)
// ─────────────────────────────────────────────────────────────────────────
function SetupStep2({ value, onChange, onBack, onNext }) {
  const { framework, resolvedTopic } = value;
  const recId = RECOMMENDED[resolvedTopic?.category] ?? null;
  const recFw = recId ? SL_FRAMEWORKS.find(f => f.id === recId) : null;

  return (
    <StepShell
      step={2}
      eyebrow="SCHRITT 2 VON 3"
      title="Welches Framework"
      titleEm="willst du üben?"
      onBack={onBack}
      primary={
        <Button variant="primary" full icon={<Icon name="arrowRight" size={16} />}
                onClick={onNext} style={{ padding: '14px 18px', fontSize: 14 }}>
          Weiter
        </Button>
      }
    >
      {/* Recommended highlight */}
      {recFw && (
        <button
          onClick={() => onChange({ ...value, framework: recFw.id })}
          style={{
            width: '100%', textAlign: 'left', cursor: 'pointer',
            display: 'flex', alignItems: 'flex-start', gap: 14,
            padding: 16, marginBottom: 14, borderRadius: 18,
            background: 'oklch(0.70 0.20 35 / 8%)',
            border: framework === recFw.id ? '1.5px solid var(--vl-coral)' : '1px solid oklch(0.70 0.20 35 / 25%)',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: recFw.bg, color: recFw.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
            {recFw.glyph}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <LabelCaps color="var(--vl-coral)">EMPFOHLEN FÜR DICH</LabelCaps>
            </div>
            <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{recFw.name}</h3>
            <p style={{ margin: '2px 0 0', fontSize: 12.5, fontWeight: 500, color: recFw.color }}>{recFw.tagline}</p>
            <p style={{ margin: '6px 0 0', fontSize: 11.5, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>{recFw.desc}</p>
          </div>
          {framework === recFw.id && (
            <div style={{ width: 22, height: 22, borderRadius: 9999, background: 'var(--vl-coral)', color: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="check" size={12} strokeWidth={3} />
            </div>
          )}
        </button>
      )}

      {/* "No framework" option */}
      <FrameworkRow
        active={!framework}
        glyph="∅"
        bg="var(--secondary)"
        color="var(--muted-foreground)"
        name="Ohne Framework"
        tagline="Frei sprechen"
        desc="Keine Struktur — gut, um deinen natürlichen Stil zu erkunden."
        onClick={() => onChange({ ...value, framework: '' })}
      />

      {/* All other frameworks */}
      <div style={{ marginTop: 14, marginBottom: 8 }}><LabelCaps>ALLE FRAMEWORKS</LabelCaps></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SL_FRAMEWORKS.filter(f => f.id !== recId).map((fw) => (
          <FrameworkRow
            key={fw.id}
            active={framework === fw.id}
            glyph={fw.glyph}
            bg={fw.bg}
            color={fw.color}
            name={fw.name}
            tagline={fw.tagline}
            desc={fw.desc}
            onClick={() => onChange({ ...value, framework: framework === fw.id ? '' : fw.id })}
          />
        ))}
      </div>
    </StepShell>
  );
}

function FrameworkRow({ active, glyph, bg, color, name, tagline, desc, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', alignItems: 'flex-start', gap: 14,
      padding: 14, borderRadius: 16,
      background: 'var(--card)',
      border: active ? '1.5px solid var(--foreground)' : '1px solid var(--vl-hairline)',
      boxShadow: active ? 'none' : 'var(--vl-inset)',
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>
        {glyph}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{name}</h3>
        <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 500, color }}>{tagline}</p>
        <p style={{ margin: '4px 0 0', fontSize: 11.5, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>{desc}</p>
      </div>
      {active && (
        <div style={{ width: 22, height: 22, borderRadius: 9999, background: 'var(--foreground)', color: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="check" size={12} strokeWidth={3} />
        </div>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// STEP 3 — Duration + summary + Start
// ─────────────────────────────────────────────────────────────────────────
function SetupStep3({ value, onChange, onBack, onStart }) {
  const { duration, resolvedTopic, framework } = value;
  const cat = resolvedTopic ? SL_CATEGORIES[resolvedTopic.category] : null;
  const fw = framework ? SL_FRAMEWORKS.find(f => f.id === framework) : null;
  const DURS = [
    { v: 30,  label: '30 Sekunden', sub: 'Schnelle Antwort' },
    { v: 60,  label: '1 Minute',    sub: 'Standard-Drill' },
    { v: 120, label: '2 Minuten',   sub: 'Kompakte Story' },
    { v: 180, label: '3 Minuten',   sub: 'Längere Argumentation' },
    { v: 300, label: '5 Minuten',   sub: 'Mini-Vortrag' },
  ];

  function start() {
    onStart({
      topic: resolvedTopic,
      framework,
      duration,
    });
  }

  return (
    <StepShell
      step={3}
      eyebrow="SCHRITT 3 VON 3"
      title="Wie lange willst du"
      titleEm="sprechen?"
      onBack={onBack}
      primary={
        <Button variant="coral" full icon={<Icon name="mic" size={16} />}
                onClick={start} style={{ padding: '14px 18px', fontSize: 14 }}>
          Aufnahme starten
        </Button>
      }
    >
      {/* Duration list — vertical, each option shows label + helper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
        {DURS.map((d) => (
          <button key={d.v} onClick={() => onChange({ ...value, duration: d.v })} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '13px 16px', borderRadius: 14,
            background: 'var(--card)',
            border: duration === d.v ? '1.5px solid var(--foreground)' : '1px solid var(--vl-hairline)',
            boxShadow: duration === d.v ? 'none' : 'var(--vl-inset)',
            cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>{d.label}</div>
              <div style={{ marginTop: 2, fontSize: 11.5, color: 'var(--muted-foreground)' }}>{d.sub}</div>
            </div>
            <div style={{
              width: 20, height: 20, borderRadius: 9999,
              border: '1.5px solid ' + (duration === d.v ? 'var(--foreground)' : 'var(--vl-hairline-strong)'),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {duration === d.v && <div style={{ width: 10, height: 10, borderRadius: 9999, background: 'var(--foreground)' }} />}
            </div>
          </button>
        ))}
      </div>

      {/* Summary */}
      <div style={{ ...setupCard, padding: 16 }}>
        <div style={{ marginBottom: 12 }}><LabelCaps>DEIN DRILL</LabelCaps></div>
        <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 17, lineHeight: 1.3, letterSpacing: '-0.015em' }}>
          {resolvedTopic?.text}
        </p>
        <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {cat && <Pill bg={cat.bg} color={cat.accent}>{cat.label}</Pill>}
          <Pill bg="oklch(0.95 0.07 95)" color="oklch(0.50 0.15 80)">{durLabel(duration)}</Pill>
          {fw && <Pill bg={fw.bg} color={fw.color}>{fw.name}</Pill>}
        </div>
      </div>
    </StepShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SETUP WIZARD — holds state, swaps between steps
// ─────────────────────────────────────────────────────────────────────────
function SetupWizard({ initial, onCancel, onStart }) {
  const [step, setStep] = useStateS(1);
  const [data, setData] = useStateS({
    source: 'random',
    custom: '',
    category: 'all',
    difficulty: 'all',
    topicIdx: 0,
    resolvedTopic: null,
    framework: initial?.framework ?? '',
    duration: initial?.duration ?? 60,
  });

  if (step === 1) {
    return (
      <SetupStep1
        value={data}
        onChange={setData}
        onCancel={onCancel}
        onNext={(next) => { setData(next); setStep(2); }}
      />
    );
  }
  if (step === 2) {
    return (
      <SetupStep2
        value={data}
        onChange={setData}
        onBack={() => setStep(1)}
        onNext={() => setStep(3)}
      />
    );
  }
  return (
    <SetupStep3
      value={data}
      onChange={setData}
      onBack={() => setStep(2)}
      onStart={onStart}
    />
  );
}

window.SetupScreen = SetupWizard;
