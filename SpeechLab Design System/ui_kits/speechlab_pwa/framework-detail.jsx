/* global React, LabelCaps, Pill, Button, Icon, SL_FRAMEWORKS */

const cardFD = {
  background: 'var(--card)',
  border: '1px solid var(--vl-hairline)',
  borderRadius: 18,
  boxShadow: 'var(--vl-inset)',
};

const wrapFD = {
  padding: '54px 18px 100px',
  maxWidth: 480,
  margin: '0 auto',
};

function SectionEyebrow({ label, hint }) {
  return (
    <div style={{ marginTop: 28, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <LabelCaps>{label}</LabelCaps>
        {hint && <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{hint}</span>}
      </div>
      <div style={{ height: 1, background: 'var(--vl-hairline)' }} />
    </div>
  );
}

function FrameworkDetailScreen({ frameworkId, onBack, onStart }) {
  const fw = SL_FRAMEWORKS.find(f => f.id === frameworkId);
  if (!fw) return null;

  return (
    <div style={wrapFD}>
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <button onClick={onBack} aria-label="Zurück" style={{
          width: 36, height: 36, borderRadius: 9999, background: 'var(--secondary)',
          border: '1px solid var(--vl-hairline)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          color: 'var(--foreground)',
        }}>
          <Icon name="arrowLeft" size={16} />
        </button>
        <LabelCaps>FRAMEWORK</LabelCaps>
      </div>

      {/* ─── HERO: glyph + name + tagline ─────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: fw.bg, color: fw.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, flexShrink: 0,
        }}>
          {fw.glyph}
        </div>
        <div style={{ flex: 1, paddingTop: 4 }}>
          <h1 style={{
            margin: 0, fontFamily: 'var(--font-display)', fontSize: 36,
            lineHeight: 1.05, letterSpacing: '-0.025em', fontWeight: 400,
          }}>{fw.name}</h1>
          <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 500, color: fw.color, lineHeight: 1.35 }}>
            {fw.tagline}
          </p>
        </div>
      </div>

      {/* ─── 1. Kurz erklärt — answer "what is it" first ──────────────── */}
      <div style={{ ...cardFD, padding: 18, marginBottom: 8 }}>
        <div style={{ marginBottom: 8 }}><LabelCaps color={fw.color}>KURZ ERKLÄRT</LabelCaps></div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{fw.shortExplanation}</p>
      </div>

      {/* ─── 2. Struktur — numbered steps ─────────────────────────────── */}
      <SectionEyebrow label="STRUKTUR" hint={`${fw.structure.length} Teile`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {fw.structure.map((step, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '12px 14px', borderRadius: 14,
            background: 'var(--card)', border: '1px solid var(--vl-hairline)',
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: 9999,
              background: fw.color, color: 'var(--background)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1,
            }}>{i + 1}</span>
            <span style={{ fontSize: 13.5, lineHeight: 1.5, paddingTop: 2 }}>{step}</span>
          </div>
        ))}
      </div>

      {/* ─── 3. Wann nutzen / Wann nicht — stacked side by side ───────── */}
      <SectionEyebrow label="WANN NUTZEN" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          ...cardFD, padding: 14,
          borderColor: 'oklch(0.70 0.16 145 / 30%)',
          background: 'oklch(0.70 0.16 145 / 8%)',
          boxShadow: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              width: 18, height: 18, borderRadius: 9999, background: 'var(--vl-sage)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--background)',
            }}><Icon name="check" size={10} strokeWidth={3} /></span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'oklch(0.46 0.14 145)' }}>Gut für</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{fw.when}</p>
        </div>
        <div style={{
          ...cardFD, padding: 14,
          borderColor: 'oklch(0.70 0.20 35 / 25%)',
          background: 'oklch(0.70 0.20 35 / 6%)',
          boxShadow: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              width: 18, height: 18, borderRadius: 9999, background: 'var(--vl-coral)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--background)',
              fontSize: 12, fontWeight: 700, lineHeight: 1,
            }}>×</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--vl-coral)' }}>Nicht für</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{fw.whenNot}</p>
        </div>
      </div>

      {/* ─── 4. Tiefgehende Erklärung — the why ───────────────────────── */}
      <SectionEyebrow label="WIE ES FUNKTIONIERT" />
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--foreground)' }}>
        {fw.deepExplanation}
      </p>

      {/* ─── 5. Beispiele ─────────────────────────────────────────────── */}
      <SectionEyebrow label="BEISPIELE" hint={`${fw.examples.length} Anwendungen`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {fw.examples.map((ex, i) => (
          <div key={i} style={{ ...cardFD, padding: 16 }}>
            <div style={{ marginBottom: 8 }}><LabelCaps>{ex.context}</LabelCaps></div>
            <blockquote style={{
              margin: 0, padding: 0,
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontSize: 15, lineHeight: 1.5, letterSpacing: '-0.005em',
              color: 'var(--foreground)',
            }}>
              „{ex.text}"
            </blockquote>
          </div>
        ))}
      </div>

      {/* ─── 6. Pro Tipps ─────────────────────────────────────────────── */}
      {fw.proTips?.length > 0 && (
        <>
          <SectionEyebrow label="PRO TIPPS" />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {fw.proTips.map((t, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: fw.color, fontWeight: 700, fontSize: 14, flexShrink: 0, lineHeight: 1.5 }}>→</span>
                <span style={{ fontSize: 13.5, lineHeight: 1.55 }}>{t}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ─── 7. Häufige Fehler ────────────────────────────────────────── */}
      {fw.mistakes?.length > 0 && (
        <>
          <SectionEyebrow label="HÄUFIGE FEHLER" />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {fw.mistakes.map((m, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 9999, flexShrink: 0, marginTop: 3,
                  background: 'oklch(0.80 0.18 80 / 25%)', color: 'oklch(0.55 0.16 70)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, lineHeight: 1,
                }}>!</span>
                <span style={{ fontSize: 13.5, lineHeight: 1.55 }}>{m}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ─── CTA — practice with this framework ──────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <Button variant="coral" full icon={<Icon name="mic" size={16} />} onClick={() => onStart?.(fw.id)} style={{ padding: '14px 18px', fontSize: 14 }}>
          Mit {fw.name} üben
        </Button>
      </div>
    </div>
  );
}

window.FrameworkDetailScreen = FrameworkDetailScreen;
