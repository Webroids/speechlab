/* global React, LabelCaps, Pill, Button, Icon, VLArcGauge, VLRing, MiniSparkline,
   SL_CATEGORIES, SL_FRAMEWORKS, SL_RECORDINGS, SL_FEEDBACK, SL_SAMPLE_TRANSCRIPT,
   SL_RECENT_SCORES */

const { useState: useStateR, useEffect: useEffectR, useRef: useRefR } = React;

// Dark surface tokens (record screen)
const D = {
  ink:     'var(--vl-dark-ink)',
  muted:   'var(--vl-dark-muted)',
  coral:   'var(--vl-coral)',
  panel:   'var(--vl-dark-panel)',
  bg:      'var(--vl-dark-bg)',
  hairline: 'var(--vl-dark-hairline)',
};

// ── RECORD ────────────────────────────────────────────────────────────────
function RecordScreen({ topic = 'Pitch eine Zusammenarbeit an einen Kunden, der sagt: „Wir haben schon eine Agentur."', duration = 60, framework = 'prep', onCancel, onComplete }) {
  const [elapsed, setElapsed] = useStateR(0);
  const [active, setActive] = useStateR(true);
  const [levels, setLevels] = useStateR(() => new Array(28).fill(8));

  useEffectR(() => {
    if (!active) return;
    const id = setInterval(() => {
      setElapsed((e) => {
        if (e + 0.1 >= duration) { clearInterval(id); onComplete?.(); return duration; }
        return +(e + 0.1).toFixed(1);
      });
      setLevels((arr) => arr.map((_, i) => 6 + Math.abs(Math.sin(Date.now() / 130 + i * 0.65)) * 28 + Math.random() * 4));
    }, 100);
    return () => clearInterval(id);
  }, [active, duration, onComplete]);

  const fw = SL_FRAMEWORKS.find(f => f.id === framework);
  const remaining = Math.max(0, duration - elapsed);
  const mmss = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;

  return (
    <div className="screen dark" style={{ padding: '54px 22px 32px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: 8 }}>
        <div style={{ flex: 1, paddingRight: 12 }}>
          <div style={{ marginBottom: 8 }}><LabelCaps color={D.muted}>DEIN THEMA</LabelCaps></div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 21, lineHeight: 1.25, letterSpacing: '-0.015em', margin: 0, color: D.ink }}>
            {topic}
          </p>
        </div>
        <button onClick={onCancel} style={{
          width: 36, height: 36, borderRadius: 9999, background: D.hairline, color: D.muted,
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer',
        }} aria-label="Zurück">
          <Icon name="x" size={16} />
        </button>
      </div>

      {/* Framework cheat sheet */}
      {fw && (
        <div style={{ background: D.panel, border: `1px solid ${D.hairline}`, borderRadius: 18, padding: 14, marginTop: 18 }}>
          <div style={{ marginBottom: 10 }}>
            <LabelCaps color={D.coral}>{fw.name} · CHEAT SHEET</LabelCaps>
          </div>
          {['Point', 'Reason', 'Example', 'Point'].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
              <span style={{
                width: 16, height: 16, borderRadius: 9999, background: D.coral, color: D.bg,
                fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{i+1}</span>
              <span style={{ color: D.muted, fontSize: 12, lineHeight: 1.45 }}>{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Mic + timer */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, marginTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: 9999, background: D.coral, boxShadow: '0 0 0 4px oklch(0.70 0.20 35 / 25%)' }} />
          <LabelCaps color={D.coral}>AUFNAHME · {mmss(elapsed)}</LabelCaps>
        </div>

        <button onClick={() => setActive((a) => !a)} style={{
          width: 116, height: 116, borderRadius: 9999, background: D.coral, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 10px oklch(0.70 0.20 35 / 18%), 0 0 0 22px oklch(0.70 0.20 35 / 8%)',
        }}>
          <Icon name={active ? 'pause' : 'mic'} size={40} strokeWidth={2} style={{ color: D.bg }} />
        </button>

        <div style={{ display: 'flex', gap: 3, height: 40, alignItems: 'center' }}>
          {levels.map((h, i) => <span key={i} style={{ display: 'block', width: 4, height: active ? h : 6, background: D.coral, borderRadius: 2, opacity: active ? 1 : 0.4, transition: 'height 80ms, opacity 200ms' }} />)}
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontFeatureSettings: '"tnum"', fontSize: 52, letterSpacing: '-0.03em', lineHeight: 1, color: D.ink }}>
          {mmss(remaining)}
        </div>
        <span style={{ fontSize: 11.5, color: D.muted }}>verbleibend</span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={() => onComplete?.()} style={{
          flex: 1, padding: '14px 0', borderRadius: 14, fontSize: 13.5, fontWeight: 600,
          background: D.ink, color: D.bg, border: 'none', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="stop" size={16} strokeWidth={2} /> Aufnahme stoppen
        </button>
      </div>
    </div>
  );
}

window.RecordScreen = RecordScreen;
