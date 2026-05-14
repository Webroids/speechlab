/* global React, LabelCaps, Pill, FilterPill, Button, Icon, VLRing, MiniSparkline,
   SL_CATEGORIES, SL_CATEGORY_TIPS, SL_FRAMEWORKS, SL_RECORDINGS, SL_FEEDBACK */

const { useState, useEffect, useRef, useMemo } = React;

const cardStyle = {
  background: 'var(--card)',
  border: '1px solid var(--vl-hairline)',
  borderRadius: 20,
  boxShadow: 'var(--vl-inset)',
};

const screenWrap = {
  padding: '54px 18px 100px',
  maxWidth: 480,
  margin: '0 auto',
};

// ── HOME (condensed) ──────────────────────────────────────────────────────
function HomeScreen({ onStartSetup, onOpenRecording, sessionConfig }) {
  const cat = SL_CATEGORIES[sessionConfig.topic.category];
  const tip = SL_CATEGORY_TIPS[sessionConfig.topic.category];
  const fw = sessionConfig.framework ? SL_FRAMEWORKS.find(f => f.id === sessionConfig.framework) : null;
  const dur = sessionConfig.duration;
  const durLabel = dur < 60 ? `${dur}s` : `${dur/60} min`;

  const h = new Date().getHours();
  const greet = h < 12 ? 'Guten Morgen,' : h < 18 ? 'Guten Tag,' : 'Guten Abend,';

  return (
    <div style={screenWrap}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0 18px' }}>
        <LabelCaps>SPEECHLAB</LabelCaps>
        <div style={{
          width: 36, height: 36, borderRadius: 9999,
          background: 'var(--secondary)', border: '1px solid var(--vl-hairline)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15,
          color: 'var(--muted-foreground)',
        }}>S</div>
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, lineHeight: 1.05, letterSpacing: '-0.025em', fontWeight: 400, margin: 0 }}>
          {greet}<br />
          <em style={{ color: 'var(--muted-foreground)' }}>Deine Stimme.</em>
        </h1>
        <p style={{ marginTop: 10, fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
          Ein kurzer Drill halt den Streak am Leben.
        </p>
      </div>

      {/* Today's Drill */}
      <div style={{ ...cardStyle, padding: '20px 20px 18px', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
          <span style={{ width: 7, height: 7, borderRadius: 9999, background: 'var(--vl-coral)' }} />
          <LabelCaps color="var(--vl-coral)">TODAY'S DRILL</LabelCaps>
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.22, letterSpacing: '-0.015em', margin: 0 }}>
          {(() => {
            const words = sessionConfig.topic.text.split(' ');
            const cut = Math.max(words.length - 2, 1);
            return (<>{words.slice(0, cut).join(' ')} <em style={{ color: 'var(--muted-foreground)' }}>{words.slice(cut).join(' ')}</em></>);
          })()}
        </p>
        <p style={{ marginTop: 12, fontSize: 12.5, color: 'var(--muted-foreground)', lineHeight: 1.55 }}>{tip}</p>
        <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Pill bg={cat.bg} color={cat.accent}>{cat.label}</Pill>
          <Pill bg="oklch(0.95 0.07 95)" color="oklch(0.50 0.15 80)">{durLabel}</Pill>
          {fw && <Pill bg={fw.bg} color={fw.color}>{fw.name}</Pill>}
        </div>
      </div>

      {/* Primary CTA → Setup */}
      <Button variant="primary" full icon={<Icon name="mic" size={16} />} onClick={onStartSetup} style={{ marginBottom: 22, padding: '14px 18px', fontSize: 14 }}>
        Aufnahme starten
      </Button>

      {/* Streak + Avg Score */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <StatTile label="STREAK" value={12} unit="Tage" />
        <StatTile label="AVG SCORE" value={74} delta={+6} />
      </div>

      {/* Weekly goal */}
      <div style={{ ...cardStyle, padding: '14px 16px', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <LabelCaps>WOCHENZIEL</LabelCaps>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--muted-foreground)', fontFeatureSettings: '"tnum"' }}>3 / 5</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1,1,1,0,0].map((on, i) => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 9999, background: on ? 'var(--vl-coral)' : 'var(--muted)' }} />
          ))}
        </div>
      </div>

      {/* Recent */}
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <LabelCaps>RECENT</LabelCaps>
        <span style={{ fontSize: 11.5, fontWeight: 500, cursor: 'pointer' }}>Alle ansehen</span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {SL_RECORDINGS.slice(0, 3).map((rec, i, arr) => (
          <RecordingRow key={rec.id} rec={rec} last={i === arr.length - 1} onClick={() => onOpenRecording(rec.id)} />
        ))}
      </ul>
    </div>
  );
}

// Stat tile — number on its own line, caption below. Robust to font metrics.
function StatTile({ label, value, unit, delta }) {
  return (
    <div style={{ ...cardStyle, padding: '12px 14px 14px' }}>
      <div style={{ marginBottom: 8 }}><LabelCaps>{label}</LabelCaps></div>
      <div style={{ fontFamily: 'var(--font-display)', fontFeatureSettings: '"tnum"', fontSize: 36, lineHeight: 1, letterSpacing: '-0.04em' }}>
        {value}
      </div>
      {(unit || delta != null) && (
        <div style={{ marginTop: 6, fontSize: 12, color: 'var(--muted-foreground)' }}>
          {unit}
          {delta != null && (
            <span style={{ marginLeft: unit ? 6 : 0, color: delta > 0 ? 'var(--vl-sage)' : 'var(--vl-coral)', fontWeight: 500 }}>
              {delta > 0 ? '+' : ''}{delta}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function RecordingRow({ rec, last, onClick }) {
  const cat = SL_CATEGORIES[rec.category];
  const durLabel = rec.duration >= 60 ? `${Math.round(rec.duration / 60)} min` : `${rec.duration}s`;
  return (
    <li style={{ borderBottom: last ? 'none' : '1px solid var(--vl-hairline)' }}>
      <button onClick={onClick} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <VLRing score={rec.score} size={48} stroke={3.5} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, lineHeight: 1.4,
                       overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {rec.topic}
          </p>
          <div style={{ marginTop: 6, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <Pill bg={cat.bg} color={cat.accent}>{cat.label}</Pill>
            <Pill bg="oklch(0.95 0.07 95)" color="oklch(0.50 0.15 80)">{durLabel}</Pill>
            <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{rec.ago}</span>
          </div>
        </div>
        <Icon name="chevron" size={14} style={{ color: 'var(--muted-foreground)', strokeWidth: 1.6 }} />
      </button>
    </li>
  );
}

window.HomeScreen = HomeScreen;
window.RecordingRow = RecordingRow;
