/* global React, LabelCaps, Pill, FilterPill, Button, Icon, VLRing, MiniSparkline,
   SL_CATEGORIES, SL_FRAMEWORKS, SL_RECORDINGS, RecordingRow,
   SL_WPM_SERIES, SL_FILLER_SERIES, SL_RECENT_SCORES, SL_DAYS, SL_TOP_FILLERS */

const { useState: useStateS } = React;

const cardStyleS = {
  background: 'var(--card)',
  border: '1px solid var(--vl-hairline)',
  borderRadius: 20,
  boxShadow: 'var(--vl-inset)',
};

const wrapS = { padding: '54px 18px 100px', maxWidth: 480, margin: '0 auto' };

// ── LIBRARY ───────────────────────────────────────────────────────────────
function LibraryScreen({ onOpenRecording }) {
  const [query, setQuery] = useStateS('');
  const filtered = SL_RECORDINGS.filter(r => r.topic.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={wrapS}>
      <div style={{ paddingTop: 22, marginBottom: 18, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ marginBottom: 4 }}><LabelCaps>BIBLIOTHEK</LabelCaps></div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}>
            Deine <em style={{ color: 'var(--muted-foreground)' }}>Aufnahmen</em>
          </h1>
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--muted-foreground)' }}>{filtered.length} Aufnahmen</span>
      </div>

      <input
        type="text" value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder="Suche nach Thema…"
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 12,
          background: 'var(--card)', border: '1px solid var(--vl-hairline)',
          color: 'var(--foreground)', fontSize: 13, outline: 'none', marginBottom: 12,
          fontFamily: 'inherit',
        }}
      />

      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {filtered.map((rec, i, arr) => (
          <RecordingRow key={rec.id} rec={rec} last={i === arr.length - 1} onClick={() => onOpenRecording(rec.id)} />
        ))}
      </ul>
    </div>
  );
}

// ── FRAMEWORKS ────────────────────────────────────────────────────────────
function FrameworksScreen({ onOpenFramework }) {
  return (
    <div style={wrapS}>
      <div style={{ paddingTop: 22, marginBottom: 18, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ marginBottom: 4 }}><LabelCaps>FRAMEWORKS</LabelCaps></div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}>
            Kommunikations-<br/><em style={{ color: 'var(--muted-foreground)' }}>Werkzeuge</em>
          </h1>
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--muted-foreground)' }}>{SL_FRAMEWORKS.length} Frameworks</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SL_FRAMEWORKS.map((fw) => (
          <button
            key={fw.id}
            onClick={() => onOpenFramework?.(fw.id)}
            style={{ ...cardStyleS, padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start',
                     width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: fw.bg, color: fw.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {fw.glyph}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{fw.name}</h3>
                <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{fw.parts} Teile</span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: 12.5, fontWeight: 500, color: fw.color }}>{fw.tagline}</p>
              <p style={{ margin: '6px 0 0', fontSize: 11.5, color: 'var(--muted-foreground)', lineHeight: 1.55 }}>{fw.desc}</p>
            </div>
            <Icon name="chevron" size={14} style={{ color: 'var(--muted-foreground)', strokeWidth: 1.6, alignSelf: 'center', flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ── TRENDS ────────────────────────────────────────────────────────────────
function TrendsScreen() {
  return (
    <div style={wrapS}>
      <div style={{ paddingTop: 22, marginBottom: 18 }}>
        <div style={{ marginBottom: 4 }}><LabelCaps>FORTSCHRITT</LabelCaps></div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 400, margin: 0 }}>
          Deine <em style={{ color: 'var(--muted-foreground)' }}>Entwicklung</em>
        </h1>
      </div>

      <ChartCard label="GESAMT-SCORE" series={SL_RECENT_SCORES.map((v, i) => ({ v, l: `T${i+1}` }))} color="var(--vl-sage)" max={100} />
      <ChartCard label="SPRECHTEMPO (WPM)" hint="Zielbereich: 130–160" series={SL_WPM_SERIES.map((v, i) => ({ v, l: SL_DAYS[i] }))} color="var(--vl-coral)" max={180} band={[130,160]} />
      <ChartCard label="FÜLLWÖRTER-ANTEIL" hint="Ziel: unter 2 %" series={SL_FILLER_SERIES.map((v, i) => ({ v, l: SL_DAYS[i] }))} color="var(--vl-amber)" max={6} refLine={2} unit="%" />

      <div style={{ ...cardStyleS, padding: 16, marginTop: 14 }}>
        <div style={{ marginBottom: 14 }}><LabelCaps>DEINE TOP-FÜLLWÖRTER</LabelCaps></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SL_TOP_FILLERS.map((f, i) => (
            <div key={f.word} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 14, textAlign: 'right', fontSize: 11, color: 'var(--muted-foreground)', fontFeatureSettings: '"tnum"' }}>{i + 1}.</span>
              <span style={{ width: 80, padding: '2px 8px', background: 'var(--muted)', borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 12, textAlign: 'center' }}>{f.word}</span>
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ height: 6, background: 'oklch(0.80 0.18 80 / 60%)', borderRadius: 9999, width: `${(f.count / SL_TOP_FILLERS[0].count) * 100}%` }} />
              </div>
              <span style={{ width: 32, textAlign: 'right', fontSize: 11, color: 'var(--muted-foreground)', fontFeatureSettings: '"tnum"' }}>{f.count}×</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ label, hint, series, color, max, band, refLine, unit }) {
  const W = 380, H = 100;
  const stepX = W / (series.length - 1);
  const yOf = (v) => H - (v / max) * H;
  const pts = series.map((d, i) => `${i * stepX},${yOf(d.v)}`).join(' ');

  return (
    <div style={{ ...cardStyleS, padding: 16, marginBottom: 14 }}>
      <div style={{ marginBottom: hint ? 2 : 10 }}><LabelCaps>{label}</LabelCaps></div>
      {hint && <p style={{ margin: '0 0 10px', fontSize: 11, color: 'var(--muted-foreground)' }}>{hint}</p>}
      <svg viewBox={`0 0 ${W} ${H + 14}`} width="100%" height={H + 14} preserveAspectRatio="none">
        {band && (
          <rect x="0" y={yOf(band[1])} width={W} height={yOf(band[0]) - yOf(band[1])} fill="oklch(0.70 0.16 145 / 12%)" />
        )}
        {refLine != null && (
          <line x1="0" y1={yOf(refLine)} x2={W} y2={yOf(refLine)} stroke={color} strokeDasharray="4 3" strokeWidth={1} opacity={0.7} />
        )}
        <line x1="0" y1={H} x2={W} y2={H} stroke="var(--vl-hairline)" />
        <polyline fill="none" stroke={color} strokeWidth={2} points={pts} strokeLinecap="round" strokeLinejoin="round" />
        {series.map((d, i) => <circle key={i} cx={i * stepX} cy={yOf(d.v)} r={3} fill={color} />)}
        {series.map((d, i) => (
          <text key={i} x={i * stepX} y={H + 12} fontSize="9" fill="var(--muted-foreground)" textAnchor="middle" fontFamily="Inter">{d.l}</text>
        ))}
      </svg>
    </div>
  );
}

window.LibraryScreen = LibraryScreen;
window.FrameworksScreen = FrameworksScreen;
window.TrendsScreen = TrendsScreen;
