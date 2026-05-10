// Mood Reflect — three phone screens
// Visual system: cream canvas, muted pastels, editorial serif + geometric mood tokens.

const MOOD = {
  apricot:    '#f3c39a',
  sage:       '#bccfa6',
  periwinkle: '#b6c2dc',
  rose:       '#ecbcbc',
  butter:     '#efd886',
  lilac:      '#d6bedd',
  stone:      '#cfc8be',
};
const INK = '#1c1a17';
const INK_SOFT = '#5b554d';
const PAPER = '#fbf8f1';
const CANVAS = '#ede7e0';

// ───────────────────────── Mood tokens (geometric circles with primitive expressions) ─────────────────────────
function MoodToken({ mood = 'sage', expression = 'calm', size = 56, shape = 'circle', tilt = 0 }) {
  const fill = MOOD[mood];
  const r = size / 2;
  const stroke = INK;
  const sw = Math.max(1.4, size * 0.038);

  // shape: circle | squircle | drop
  const Shape = () => {
    if (shape === 'squircle') {
      return <rect x={size*0.04} y={size*0.04} width={size*0.92} height={size*0.92} rx={size*0.28} fill={fill} />;
    }
    if (shape === 'drop') {
      return <path d={`M ${r} ${size*0.06} C ${size*0.95} ${size*0.4}, ${size*0.85} ${size*0.96}, ${r} ${size*0.96} C ${size*0.15} ${size*0.96}, ${size*0.05} ${size*0.4}, ${r} ${size*0.06} Z`} fill={fill} />;
    }
    return <circle cx={r} cy={r} r={r*0.94} fill={fill} />;
  };

  // expressions: calm, bright, blue, anxious, tired, neutral, peaceful
  const eyeY = size * 0.42;
  const eyeOff = size * 0.18;
  const mouthY = size * 0.66;
  const Expression = () => {
    switch (expression) {
      case 'bright':
        return (<>
          {/* crescent eyes */}
          <path d={`M ${r-eyeOff-size*0.06} ${eyeY} q ${size*0.06} ${-size*0.05} ${size*0.12} 0`} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round"/>
          <path d={`M ${r+eyeOff-size*0.06} ${eyeY} q ${size*0.06} ${-size*0.05} ${size*0.12} 0`} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round"/>
          {/* smile */}
          <path d={`M ${r-size*0.16} ${mouthY} q ${size*0.16} ${size*0.13} ${size*0.32} 0`} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round"/>
        </>);
      case 'calm':
        return (<>
          <line x1={r-eyeOff-size*0.05} y1={eyeY} x2={r-eyeOff+size*0.05} y2={eyeY} stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
          <line x1={r+eyeOff-size*0.05} y1={eyeY} x2={r+eyeOff+size*0.05} y2={eyeY} stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
          <path d={`M ${r-size*0.10} ${mouthY+size*0.02} q ${size*0.10} ${size*0.06} ${size*0.20} 0`} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round"/>
        </>);
      case 'blue':
        return (<>
          <circle cx={r-eyeOff} cy={eyeY} r={sw*0.9} fill={stroke}/>
          <circle cx={r+eyeOff} cy={eyeY} r={sw*0.9} fill={stroke}/>
          <path d={`M ${r-size*0.14} ${mouthY+size*0.05} q ${size*0.14} ${-size*0.08} ${size*0.28} 0`} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round"/>
        </>);
      case 'anxious':
        return (<>
          <circle cx={r-eyeOff} cy={eyeY} r={sw*1.0} fill={stroke}/>
          <circle cx={r+eyeOff} cy={eyeY} r={sw*1.0} fill={stroke}/>
          {/* zigzag mouth */}
          <path d={`M ${r-size*0.16} ${mouthY+size*0.02} l ${size*0.06} ${-size*0.04} l ${size*0.06} ${size*0.04} l ${size*0.06} ${-size*0.04} l ${size*0.06} ${size*0.04} l ${size*0.06} ${-size*0.04}`} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </>);
      case 'tired':
        return (<>
          <path d={`M ${r-eyeOff-size*0.06} ${eyeY+size*0.02} q ${size*0.06} ${size*0.05} ${size*0.12} 0`} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round"/>
          <path d={`M ${r+eyeOff-size*0.06} ${eyeY+size*0.02} q ${size*0.06} ${size*0.05} ${size*0.12} 0`} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round"/>
          <line x1={r-size*0.10} y1={mouthY+size*0.04} x2={r+size*0.10} y2={mouthY+size*0.04} stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
        </>);
      case 'neutral':
        return (<>
          <circle cx={r-eyeOff} cy={eyeY} r={sw*0.9} fill={stroke}/>
          <circle cx={r+eyeOff} cy={eyeY} r={sw*0.9} fill={stroke}/>
          <line x1={r-size*0.10} y1={mouthY+size*0.02} x2={r+size*0.10} y2={mouthY+size*0.02} stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
        </>);
      case 'peaceful':
        return (<>
          {/* asterisk-style closed eyes */}
          <line x1={r-eyeOff-size*0.05} y1={eyeY} x2={r-eyeOff+size*0.05} y2={eyeY} stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
          <line x1={r+eyeOff-size*0.05} y1={eyeY} x2={r+eyeOff+size*0.05} y2={eyeY} stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
          <circle cx={r} cy={mouthY+size*0.02} r={sw*1.2} fill={stroke} opacity={0}/>
          <path d={`M ${r-size*0.12} ${mouthY+size*0.02} q ${size*0.12} ${size*0.10} ${size*0.24} 0`} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round"/>
        </>);
      default: return null;
    }
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: `rotate(${tilt}deg)`, display: 'block' }}>
      <Shape />
      <Expression />
    </svg>
  );
}

// ───────────────────────── Screen 1 — Onboarding ─────────────────────────
function ScreenOnboarding() {
  return (
    <div data-screen-label="01 Onboarding" style={{
      width: '100%', height: '100%', background: PAPER,
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
    }}>
      {/* page label */}
      <div style={{ padding: '78px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: INK_SOFT }}>
          ✱ Reflect&nbsp;&nbsp;·&nbsp;&nbsp;Day&nbsp;01
        </div>
        <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 11, letterSpacing: 1.5, color: INK_SOFT }}>
          SKIP →
        </div>
      </div>

      {/* headline */}
      <div style={{ padding: '36px 28px 0' }}>
        <div style={{
          fontFamily: '"Instrument Serif", serif', fontSize: 60, lineHeight: 0.94,
          letterSpacing: -1.6, color: INK, fontWeight: 400,
        }}>
          Not&nbsp;sure<br/>
          how you<br/>
          <em style={{ fontStyle: 'italic', color: MOOD.sage, filter: 'brightness(0.7) saturate(1.4)' }}>feel today?</em>
        </div>
        <div style={{
          marginTop: 18, maxWidth: 280,
          fontFamily: 'Geist, sans-serif', fontSize: 14.5, lineHeight: 1.45, color: INK_SOFT,
        }}>
          A quiet space to name your weather — one mark a day, no streak shaming.
        </div>

        {/* CTA */}
        <button style={{
          marginTop: 24, height: 52, padding: '0 8px 0 24px',
          background: INK, color: PAPER, border: 'none', borderRadius: 999,
          display: 'inline-flex', alignItems: 'center', gap: 14,
          fontFamily: 'Geist, sans-serif', fontSize: 15.5, fontWeight: 500, cursor: 'pointer',
        }}>
          Help me reflect
          <span style={{
            width: 38, height: 38, borderRadius: 999, background: MOOD.butter,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 7h12M8 2l5 5-5 5" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </button>
      </div>

      {/* mood token cluster */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 360, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: 22, top: 88 }}><MoodToken mood="rose" expression="blue" size={92} shape="circle" tilt={-8}/></div>
        <div style={{ position: 'absolute', left: 118, top: 30 }}><MoodToken mood="lilac" expression="anxious" size={104} shape="squircle" tilt={6}/></div>
        <div style={{ position: 'absolute', left: 240, top: 70 }}><MoodToken mood="sage" expression="bright" size={88} shape="circle" tilt={-4}/></div>
        <div style={{ position: 'absolute', left: 76, top: 178 }}><MoodToken mood="butter" expression="calm" size={76} shape="drop" tilt={-12}/></div>
        <div style={{ position: 'absolute', left: 168, top: 178 }}><MoodToken mood="apricot" expression="tired" size={84} shape="squircle" tilt={4}/></div>
        <div style={{ position: 'absolute', left: 268, top: 198 }}><MoodToken mood="periwinkle" expression="peaceful" size={70} shape="circle" tilt={-6}/></div>
        <div style={{ position: 'absolute', left: 24, top: 268 }}><MoodToken mood="stone" expression="neutral" size={62} shape="circle" tilt={2}/></div>
      </div>

      {/* page indicator */}
      <div style={{ position: 'absolute', bottom: 56, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
        <div style={{ width: 22, height: 6, borderRadius: 3, background: INK }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.18)' }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.18)' }} />
      </div>
    </div>
  );
}

// ───────────────────────── Screen 2 — Daily Check-in ─────────────────────────
function MoodChip({ mood, expression, label, active }) {
  return (
    <div style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      padding: '8px 4px',
      background: active ? PAPER : 'transparent',
      borderRadius: 16, minWidth: 64,
      border: active ? `1px solid ${INK}` : '1px solid transparent',
    }}>
      <MoodToken mood={mood} expression={expression} size={42} shape="circle" />
      <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 11.5, color: INK, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function ScreenCheckIn() {
  return (
    <div data-screen-label="02 Check-in" style={{
      width: '100%', height: '100%', background: CANVAS,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* top bar */}
      <div style={{ padding: '70px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 999, background: MOOD.apricot,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Instrument Serif", serif', fontSize: 22, color: INK,
          }}>M</div>
          <div>
            <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: 1.2, color: INK_SOFT, textTransform: 'uppercase' }}>Welcome back</div>
            <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 15, fontWeight: 600, color: INK }}>Maren Holm</div>
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 999, background: PAPER,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ width: 14, height: 1.5, background: INK, borderRadius: 1 }}/>
            <span style={{ width: 10, height: 1.5, background: INK, borderRadius: 1 }}/>
            <span style={{ width: 14, height: 1.5, background: INK, borderRadius: 1 }}/>
          </div>
        </div>
      </div>

      {/* date */}
      <div style={{ padding: '20px 22px 0', fontFamily: '"Geist Mono", monospace', fontSize: 11, color: INK_SOFT, letterSpacing: 1.2 }}>
        TUE · SEP 14 · 2025
      </div>

      {/* prompt */}
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{
          fontFamily: '"Instrument Serif", serif', fontSize: 34, lineHeight: 1.0,
          letterSpacing: -0.6, color: INK, fontWeight: 400,
        }}>
          Hello Maren — what's the<br/><em style={{ fontStyle: 'italic' }}>inner weather</em> today?
        </div>
      </div>

      {/* mood chips */}
      <div style={{ marginTop: 18, padding: '0 14px', display: 'flex', gap: 4, justifyContent: 'space-between' }}>
        <MoodChip mood="sage" expression="bright" label="Bright" active />
        <MoodChip mood="rose" expression="anxious" label="Anxious" />
        <MoodChip mood="periwinkle" expression="tired" label="Foggy" />
        <MoodChip mood="butter" expression="calm" label="Calm" />
        <MoodChip mood="lilac" expression="blue" label="Low" />
      </div>

      {/* stats row */}
      <div style={{ marginTop: 18, padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* Sleep card */}
        <div style={{ background: MOOD.apricot, borderRadius: 22, padding: 14, height: 138, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Geist, sans-serif', fontSize: 11, fontWeight: 600, color: INK }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: INK }} />
            Sleep
          </div>
          {/* tiny bar chart */}
          <svg width="100%" height="58" viewBox="0 0 140 58" style={{ marginTop: 14, display: 'block' }}>
            {[28, 36, 22, 44, 32, 50, 38].map((h, i) => (
              <rect key={i} x={6 + i*19} y={56 - h} width="11" height={h} rx="3" fill={INK} opacity={i === 5 ? 1 : 0.78} />
            ))}
          </svg>
          <div style={{ position: 'absolute', bottom: 12, left: 14, fontFamily: '"Instrument Serif", serif', fontSize: 26, color: INK, lineHeight: 1 }}>
            7h 20m
          </div>
        </div>
        {/* Stress card */}
        <div style={{ background: MOOD.lilac, borderRadius: 22, padding: 14, height: 138, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Geist, sans-serif', fontSize: 11, fontWeight: 600, color: INK }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: INK }} />
            Stress
          </div>
          <svg width="100%" height="58" viewBox="0 0 140 58" style={{ marginTop: 14, display: 'block' }}>
            <path d="M 4 50 L 24 42 L 44 38 L 64 28 L 84 30 L 104 18 L 124 10" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            {[[4,50],[24,42],[44,38],[64,28],[84,30],[104,18],[124,10]].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r="2.4" fill={INK}/>
            ))}
          </svg>
          <div style={{ position: 'absolute', bottom: 12, left: 14, fontFamily: '"Instrument Serif", serif', fontSize: 26, color: INK, lineHeight: 1 }}>
            Elevated
          </div>
        </div>
      </div>

      {/* journal prompt card */}
      <div style={{ margin: '12px 16px 0', background: MOOD.sage, borderRadius: 22, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 11, fontWeight: 600, color: INK }}>
            ✎ &nbsp;Today's prompt
          </div>
          <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, color: INK_SOFT }}>1 / 8</div>
        </div>
        <div style={{ marginTop: 8, fontFamily: '"Instrument Serif", serif', fontSize: 19, lineHeight: 1.15, color: INK }}>
          What's one small thing that softened your day?
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button style={{ flex: 1, height: 38, borderRadius: 999, background: INK, color: PAPER, border: 'none', fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500 }}>Write it down</button>
          <button style={{ flex: '0 0 96px', height: 38, borderRadius: 999, background: 'transparent', color: INK, border: `1px solid ${INK}`, fontFamily: 'Geist, sans-serif', fontSize: 13, fontWeight: 500 }}>Skip</button>
        </div>
      </div>

      {/* bottom tab bar */}
      <div style={{ marginTop: 'auto', padding: '0 16px 28px' }}>
        <div style={{
          background: PAPER, borderRadius: 999, height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 18px',
        }}>
          {[
            ['home', true],
            ['stats', false],
            ['cal', false],
            ['grid', false],
          ].map(([k, active], i) => (
            <div key={i} style={{
              width: 38, height: 38, borderRadius: 999,
              background: active ? INK : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TabIcon kind={k} color={active ? PAPER : INK} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabIcon({ kind, color }) {
  const s = 18;
  if (kind === 'home') return <svg width={s} height={s} viewBox="0 0 18 18"><path d="M2 8l7-6 7 6v8H2V8z" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round"/></svg>;
  if (kind === 'stats') return <svg width={s} height={s} viewBox="0 0 18 18"><circle cx="9" cy="9" r="6.5" stroke={color} strokeWidth="1.6" fill="none"/><path d="M9 3 v6 h6" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>;
  if (kind === 'cal') return <svg width={s} height={s} viewBox="0 0 18 18"><rect x="2" y="3" width="14" height="13" rx="2" stroke={color} strokeWidth="1.6" fill="none"/><line x1="2" y1="7" x2="16" y2="7" stroke={color} strokeWidth="1.6"/><line x1="6" y1="2" x2="6" y2="5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><line x1="12" y1="2" x2="12" y2="5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></svg>;
  return <svg width={s} height={s} viewBox="0 0 18 18">{[[3,3],[10,3],[3,10],[10,10]].map(([x,y],i)=><rect key={i} x={x} y={y} width="5" height="5" rx="1" stroke={color} strokeWidth="1.6" fill="none"/>)}</svg>;
}

// ───────────────────────── Screen 3 — Mood Calendar ─────────────────────────
function ScreenCalendar() {
  // Sept 2025: Sept 1 = Monday. We render Sun-first.
  // Days 1..30 mapped to a Sun-first 5-row grid starting on Sun Aug 31 (blank)
  const monthDays = [];
  // first row offset: Sept 1 = Mon, so 1 leading blank (Sun)
  for (let i = 0; i < 1; i++) monthDays.push(null);
  for (let d = 1; d <= 30; d++) monthDays.push(d);
  while (monthDays.length < 35) monthDays.push(null);

  // pseudo-random but stable mood per day
  const moodKeys = ['sage','apricot','periwinkle','rose','butter','lilac','stone'];
  const expKeys = ['bright','calm','blue','anxious','tired','neutral','peaceful'];
  const dayMood = (d) => {
    if (d === null) return null;
    const i = (d * 7 + 3) % moodKeys.length;
    const j = (d * 11 + 5) % expKeys.length;
    return { mood: moodKeys[i], expression: expKeys[j] };
  };
  const today = 14;

  return (
    <div data-screen-label="03 Calendar" style={{
      width: '100%', height: '100%', background: PAPER,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* nav */}
      <div style={{ padding: '70px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 38, height: 38, borderRadius: 999, background: CANVAS,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M8 1L3 6l5 5" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 22, color: INK, lineHeight: 1 }}>September</div>
          <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: 1.2, color: INK_SOFT, marginTop: 4 }}>2025 · 22 marks</div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 999, background: CANVAS,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="3" width="10" height="9" rx="1.5" stroke={INK} strokeWidth="1.6" fill="none"/><line x1="2" y1="6" x2="12" y2="6" stroke={INK} strokeWidth="1.6"/></svg>
        </div>
      </div>

      {/* day labels */}
      <div style={{ padding: '18px 16px 0', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} style={{
            fontFamily: '"Geist Mono", monospace', fontSize: 9.5, color: INK_SOFT,
            textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1,
          }}>{d}</div>
        ))}
      </div>

      {/* grid */}
      <div style={{ padding: '8px 16px 0', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {monthDays.map((d, i) => {
          const m = dayMood(d);
          const isToday = d === today;
          const isFuture = d !== null && d > today;
          return (
            <div key={i} style={{
              aspectRatio: '1 / 1', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 14, background: isToday ? CANVAS : 'transparent',
              border: isToday ? `1px solid ${INK}` : 'none',
            }}>
              {m && !isFuture && <MoodToken mood={m.mood} expression={m.expression} size={32} shape={d % 4 === 0 ? 'squircle' : 'circle'} />}
              {m && isFuture && <div style={{ width: 8, height: 8, borderRadius: 999, background: 'rgba(0,0,0,0.10)' }} />}
              {d !== null && (
                <div style={{
                  position: 'absolute', bottom: 2, fontFamily: '"Geist Mono", monospace',
                  fontSize: 8, color: isToday ? INK : INK_SOFT,
                }}>{d}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* monthly summary */}
      <div style={{ margin: '14px 16px 0', background: MOOD.sage, borderRadius: 22, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, letterSpacing: 1.2, color: INK_SOFT, textTransform: 'uppercase' }}>
              Monthly mood
            </div>
            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 36, color: INK, lineHeight: 1, marginTop: 2 }}>
              Mostly <em style={{ fontStyle: 'italic' }}>bright</em>
            </div>
            <div style={{ marginTop: 6, fontFamily: 'Geist, sans-serif', fontSize: 12, color: INK_SOFT, maxWidth: 200, lineHeight: 1.4 }}>
              You've leaned calm and optimistic — keep noticing the small softenings.
            </div>
          </div>
          <div style={{ marginRight: -8, marginTop: -4 }}>
            <MoodToken mood="sage" expression="peaceful" size={66} shape="circle" />
          </div>
        </div>
      </div>

      {/* stats row */}
      <div style={{ margin: '10px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
          { label: 'Marks', big: '22', sub: 'of 30' },
          { label: 'Reflections', big: '08', sub: 'this month' },
          { label: 'Streak', big: '6d', sub: 'and counting' },
        ].map((s, i) => (
          <div key={i} style={{ background: CANVAS, borderRadius: 18, padding: '10px 12px' }}>
            <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9.5, color: INK_SOFT, letterSpacing: 1, textTransform: 'uppercase' }}>
              {s.label}
            </div>
            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 26, color: INK, lineHeight: 1, marginTop: 4 }}>
              {s.big}
            </div>
            <div style={{ fontFamily: 'Geist, sans-serif', fontSize: 10.5, color: INK_SOFT, marginTop: 2 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />
    </div>
  );
}

Object.assign(window, { ScreenOnboarding, ScreenCheckIn, ScreenCalendar, MoodToken, MOOD, INK, INK_SOFT, PAPER, CANVAS });
