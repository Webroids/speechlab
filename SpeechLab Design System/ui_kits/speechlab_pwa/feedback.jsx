/* global React, LabelCaps, Pill, Button, Icon, VLArcGauge, VLRing, MiniSparkline,
   SL_CATEGORIES, SL_FRAMEWORKS, SL_RECORDINGS, SL_FEEDBACK, SL_SAMPLE_TRANSCRIPT,
   SL_RECENT_SCORES */

const { useState: useStateF, useEffect: useEffectF } = React;

const cardStyleF = {
  background: 'var(--card)',
  border: '1px solid var(--vl-hairline)',
  borderRadius: 20,
  boxShadow: 'var(--vl-inset)',
};

const screenWrapF = { padding: '54px 18px 100px', maxWidth: 480, margin: '0 auto' };

// Section break: caps eyebrow with a hairline underneath
function SectionBreak({ label, hint }) {
  return (
    <div style={{ marginTop: 28, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <LabelCaps>{label}</LabelCaps>
        {hint && <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{hint}</span>}
      </div>
      <div style={{ height: 1, background: 'var(--vl-hairline)' }} />
    </div>
  );
}

// ── FEEDBACK ──────────────────────────────────────────────────────────────
function FeedbackScreen({ recordingId = 'r1', onBack, onRepeat, onNewTopic }) {
  const rec = SL_RECORDINGS.find(r => r.id === recordingId) ?? SL_RECORDINGS[0];
  const fb = SL_FEEDBACK[recordingId] ?? SL_FEEDBACK.r1;
  const cat = SL_CATEGORIES[rec.category];
  const fw = rec.framework ? SL_FRAMEWORKS.find(f => f.id === rec.framework) : null;
  const durLabel = rec.duration < 60 ? `${rec.duration}s` : `${Math.round(rec.duration/60)} min`;

  return (
    <div style={screenWrapF}>
      {/* ─── 0. Compact header — context only, doesn't dominate ─────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <button onClick={onBack} aria-label="Zurück" style={{
          width: 36, height: 36, borderRadius: 9999, background: 'var(--secondary)',
          border: '1px solid var(--vl-hairline)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          color: 'var(--foreground)',
        }}>
          <Icon name="arrowLeft" size={16} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <LabelCaps>FEEDBACK</LabelCaps>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--muted-foreground)' }}>
            {rec.ago} · {durLabel}
          </p>
        </div>
      </div>

      {/* Topic — full text, smallish serif so the score remains the headline */}
      <p style={{
        margin: '0 0 10px',
        fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 1.35,
        letterSpacing: '-0.015em',
      }}>{rec.topic}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        <Pill bg={cat.bg} color={cat.accent}>{cat.label}</Pill>
        <Pill bg="oklch(0.95 0.07 95)" color="oklch(0.50 0.15 80)">{durLabel}</Pill>
        {fw && <Pill bg={fw.bg} color={fw.color}>{fw.name}</Pill>}
      </div>

      {/* ─── 1. HEADLINE: the score is the answer ──────────────────────── */}
      <div style={{ ...cardStyleF, padding: '24px 22px 18px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 14 }}>
        <VLArcGauge score={fb.overall} width={250} stroke={14} />
        <p style={{ margin: '4px 0 0', fontSize: 14, lineHeight: 1.5, maxWidth: '32ch', fontWeight: 500 }}>
          {fb.summary}
        </p>
        {/* Trend chip — quick context, doesn't compete */}
        <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 11px', borderRadius: 9999, background: 'oklch(0.70 0.16 145 / 14%)' }}>
          <Icon name="chart" size={11} style={{ color: 'var(--vl-sage)', strokeWidth: 2 }} />
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'oklch(0.46 0.14 145)' }}>+12 seit Anfang Woche</span>
        </div>
      </div>

      {/* ─── 2. ACTION — immediately let the user decide what's next ───── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
        <Button variant="primary" full icon={<Icon name="repeat" size={14} />} onClick={onRepeat} style={{ padding: '13px 18px' }}>Nochmal üben</Button>
        <Button variant="secondary" onClick={onNewTopic} style={{ padding: '13px 18px' }}>Neues Thema</Button>
      </div>

      {/* ─── 3. COACHING — the actual value of the feedback ────────────── */}
      <SectionBreak label="COACHING" hint="3 Stärken · 3 Verbesserungen" />

      {/* Strengths */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ marginBottom: 10, fontSize: 12.5, fontWeight: 600, color: 'oklch(0.46 0.14 145)' }}>
          Was du gut gemacht hast
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {fb.strengths.map((s, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{
                width: 20, height: 20, borderRadius: 9999, background: 'var(--vl-sage)', color: 'var(--background)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
              }}>
                <Icon name="check" size={11} strokeWidth={3} />
              </span>
              <span style={{ fontSize: 13.5, lineHeight: 1.5 }}>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements — the highest-value content, gets the richest card */}
      <div>
        <div style={{ marginBottom: 10, fontSize: 12.5, fontWeight: 600, color: 'var(--vl-coral)' }}>
          Wo du wachsen kannst
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {fb.improvements.map((it, i) => (
            <div key={i} style={{
              background: 'var(--card)', border: '1px solid var(--vl-hairline)',
              borderRadius: 16, padding: 14, boxShadow: 'var(--vl-inset)',
            }}>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500, lineHeight: 1.4 }}>{it.issue}</p>
              <blockquote style={{
                margin: '10px 0', padding: '0 0 0 10px',
                borderLeft: '2px solid var(--vl-hairline-strong)',
                color: 'var(--muted-foreground)', fontStyle: 'italic',
                fontSize: 12, lineHeight: 1.5,
              }}>„{it.example}"</blockquote>
              <p style={{
                margin: 0, fontSize: 12.5, fontWeight: 500, color: 'var(--vl-coral)', lineHeight: 1.4,
              }}>→ {it.better}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 4. NEXT DRILL — actionable suggestion ─────────────────────── */}
      <div style={{
        marginTop: 22,
        background: 'oklch(0.70 0.20 35 / 8%)',
        border: '1px solid oklch(0.70 0.20 35 / 20%)',
        borderRadius: 18, padding: 16,
      }}>
        <div style={{ marginBottom: 8 }}><LabelCaps color="var(--vl-coral)">NÄCHSTE ÜBUNG</LabelCaps></div>
        <p style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 500, lineHeight: 1.4 }}>{fb.nextDrill}</p>
        <Button variant="coral" full icon={<Icon name="arrowRight" size={14} />} onClick={onNewTopic}>Jetzt üben</Button>
      </div>

      {/* ─── 5. DIMENSIONS — sub-scores, dimensional breakdown ─────────── */}
      <SectionBreak label="DIMENSIONEN" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {fb.sub.map((s) => <SubScoreCard key={s.label} {...s} />)}
      </div>

      {/* ─── 6. REPLAY — audio + transcript + voice ────────────────────── */}
      <SectionBreak label="WIEDERGABE" hint="Hör dir zu" />
      <AudioPlayerMock duration={rec.duration} />
      <TranscriptCard />
      <VoiceTimelineCard />

      {/* ─── 7. METRICS — quantitative, deepest layer ──────────────────── */}
      <SectionBreak label="METRIKEN" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <MetricTile label="WPM"            value={fb.metrics.wpm}     status="good" hint="Ziel: 130–160" />
        <MetricTile label="Füllwörter"      value={fb.metrics.filler}  status="ok"   hint="Ziel: ≤3" />
        <MetricTile label="Abschwächungen"  value={fb.metrics.hedging} status="bad"  hint="Ziel: ≤2" />
        <MetricTile label="Lange Pausen"    value={fb.metrics.longPause} status="good" hint="Ziel: ≤1" />
        <MetricTile label="Wort-Latenz"     value={`${fb.metrics.latency}s`} status="good" hint="Ziel: ≤2s" />
        <MetricTile label="Wörter"          value={fb.metrics.words} />
      </div>

      {/* ─── 8. TRAJECTORY — small context, end of the page ───────────── */}
      <SectionBreak label="DEINE ENTWICKLUNG" />
      <div style={{ ...cardStyleF, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>Letzte 10 Aufnahmen</p>
          <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'var(--muted-foreground)' }}>62 → 82</p>
        </div>
        <MiniSparkline values={SL_RECENT_SCORES} color="var(--vl-sage)" width={130} height={34} max={100} />
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────

function AudioPlayerMock({ duration }) {
  const mmss = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  return (
    <div style={{ ...cardStyleF, padding: '12px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
      <button style={{
        width: 38, height: 38, borderRadius: 9999, background: 'var(--foreground)', color: 'var(--background)',
        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20" /></svg>
      </button>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ height: 4, borderRadius: 9999, background: 'var(--muted)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: '34%', borderRadius: 9999, background: 'var(--vl-coral)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted-foreground)', fontFeatureSettings: '"tnum"' }}>
          <span>00:21</span><span>{mmss(duration)}</span>
        </div>
      </div>
    </div>
  );
}

function VoiceTimelineCard() {
  const colors = ['oklch(0.72 0.13 280)', 'oklch(0.72 0.14 145)', 'oklch(0.70 0.20 35)'];
  const N = 60;
  const bars = [];
  for (let i = 0; i < N; i++) {
    const x = (i / N) * 100;
    const isSilence = (i > 18 && i < 22) || (i > 41 && i < 45);
    const w = (100 / N) * 0.8;
    if (isSilence) {
      bars.push(<rect key={i} x={x + 100/N*0.1} y={45} width={w} height={3} rx={w*0.3} fill="var(--muted)" opacity={0.3} />);
    } else {
      const phase = i / N;
      const e = 0.5 + 0.35 * Math.sin(phase * 11) + 0.12 * Math.cos(phase * 19);
      const h = Math.max(4, e * 38);
      const colorIdx = Math.min(2, Math.floor((0.5 + 0.4 * Math.sin(phase * 4.4)) * 3));
      bars.push(<rect key={i} x={x + 100/N*0.1} y={48 - h} width={w} height={h} rx={w*0.3} fill={colors[colorIdx]} opacity={0.85} />);
    }
  }
  return (
    <div style={{ ...cardStyleF, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>Tonhöhe & Energie</span>
        <div style={{ fontSize: 11, color: 'var(--muted-foreground)', display: 'flex', gap: 12 }}>
          <span>Ø 167 Hz</span><span>83% gesprochen</span>
        </div>
      </div>
      <svg viewBox="0 0 100 48" preserveAspectRatio="none" style={{ width: '100%', height: 56 }}>{bars}</svg>
      <div style={{ display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
        {[{c:colors[0], l:'Tief'}, {c:colors[1], l:'Mittel'}, {c:colors[2], l:'Hoch'}].map(x => (
          <span key={x.l} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--muted-foreground)' }}>
            <span style={{ width: 7, height: 7, borderRadius: 9999, background: x.c }} />{x.l}
          </span>
        ))}
      </div>
    </div>
  );
}

function TranscriptCard() {
  const catStyles = {
    nonword: { background: 'oklch(0.80 0.18 70 / 22%)', color: 'oklch(0.50 0.18 70)' },
    filler:  { background: 'oklch(0.65 0.22 295 / 22%)', color: 'oklch(0.46 0.18 295)' },
    soft:    { background: 'oklch(0.70 0.16 145 / 22%)', color: 'oklch(0.46 0.14 145)' },
  };
  const activeIdx = 10;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>Transkript</span>
        <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 9999, border: '1px solid oklch(0.14 0.015 55 / 18%)', background: 'oklch(0.14 0.015 55 / 8%)' }}>5 markiert ✕</span>
      </div>
      <div style={{ background: 'oklch(0.14 0.015 55 / 4%)', borderRadius: 12, padding: '14px 16px', fontSize: 13.5, lineHeight: 1.95 }}>
        {SL_SAMPLE_TRANSCRIPT.map((w, i) => {
          const isActive = i === activeIdx;
          const isPast = i < activeIdx;
          const s = w.cat ? catStyles[w.cat] : null;
          return (
            <span key={i} style={{
              padding: '0 2px', borderRadius: 3, cursor: 'pointer',
              ...(isActive ? { background: 'var(--foreground)', color: 'var(--background)', fontWeight: 500 } :
                  s ? { ...s, textDecoration: 'underline dotted' } :
                  isPast ? { color: 'oklch(0.14 0.015 55 / 60%)' } : {})
            }}>{w.w} </span>
          );
        })}
      </div>
    </div>
  );
}

function SubScoreCard({ label, score, comment }) {
  const ring = Math.round(score * 10);
  return (
    <div style={{ ...cardStyleF, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{label}</span>
        <VLRing score={ring} size={36} stroke={3} />
      </div>
      <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.45, color: 'var(--muted-foreground)' }}>{comment}</p>
    </div>
  );
}

function MetricTile({ label, value, status = 'neutral', hint }) {
  const dotColor =
    status === 'good' ? 'var(--vl-sage)' :
    status === 'ok'   ? 'var(--vl-amber)' :
    status === 'bad'  ? 'var(--vl-coral)' : 'transparent';
  const valColor =
    status === 'good' ? 'var(--vl-sage)' :
    status === 'ok'   ? 'var(--vl-amber)' :
    status === 'bad'  ? 'var(--vl-coral)' : 'var(--foreground)';
  return (
    <div style={{ ...cardStyleF, padding: '11px 6px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontFeatureSettings: '"tnum"', fontSize: 22, lineHeight: 1, letterSpacing: '-0.02em', color: valColor }}>{value}</div>
      <div style={{ marginTop: 4, fontSize: 10.5, color: 'var(--muted-foreground)' }}>{label}</div>
      {hint && (
        <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: 9999, background: dotColor }} />
          <span style={{ fontSize: 9, color: 'var(--muted-foreground)' }}>{hint}</span>
        </div>
      )}
    </div>
  );
}

window.FeedbackScreen = FeedbackScreen;
