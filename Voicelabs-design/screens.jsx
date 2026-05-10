// Voicelabs — all screens
// Warm cream + serif display + colored rings, plus a focused dark recording surface.

const VL = {
  cream: '#F4EFE8',
  creamLight: '#FBF8F2',
  creamDeep: '#EBE3D5',
  ink: '#1C1814',
  ink2: '#3A332B',
  inkMuted: '#7A6F62',
  inkSoft: '#A89D8E',
  hairline: 'rgba(28,24,20,0.08)',
  hairlineStrong: 'rgba(28,24,20,0.14)',
  // accents — saturated, vivid
  coral:    'oklch(0.70 0.20 35)',
  sage:     'oklch(0.70 0.16 145)',
  lavender: 'oklch(0.65 0.22 295)',
  amber:    'oklch(0.80 0.18 80)',
  rose:     'oklch(0.70 0.20 10)',
  ocean:    'oklch(0.65 0.18 235)',
  lemon:    'oklch(0.85 0.18 95)',
  mint:     'oklch(0.78 0.16 165)',
  // dark mode
  dark:      '#0F0E0D',
  darkPanel: '#1A1816',
  darkInk:   '#F4EFE8',
  darkMuted: '#8B8076',
};

const DISPLAY = '"Instrument Serif", "Cormorant Garamond", Georgia, serif';
const UI = '"Geist", "DM Sans", -apple-system, system-ui, sans-serif';
const MONO = '"Geist Mono", "JetBrains Mono", ui-monospace, monospace';

// ─── Tiny SVG helpers ─────────────────────────────────────────
const Ring = ({ size = 44, stroke = 4, value = 0.5, color = VL.coral, trackColor = 'rgba(28,24,20,0.08)', children, gap }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value);
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  );
};

const ArcGauge = ({ width = 280, value = 0.78, track = 'rgba(28,24,20,0.07)', stroke = 14, gradientId = 'vlArc' }) => {
  // half-arc (180°) gauge with smooth multi-stop gradient
  const h = width / 2 + stroke + 4;
  const cy = width / 2 + stroke / 2;
  const r = width / 2 - stroke / 2;
  const total = Math.PI * r;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor="oklch(0.85 0.18 95)"/>
          <stop offset="30%"  stopColor="oklch(0.80 0.18 70)"/>
          <stop offset="55%"  stopColor="oklch(0.70 0.20 35)"/>
          <stop offset="80%"  stopColor="oklch(0.66 0.22 350)"/>
          <stop offset="100%" stopColor="oklch(0.62 0.24 295)"/>
        </linearGradient>
      </defs>
      <path d={`M ${stroke/2 + 2} ${cy} A ${r} ${r} 0 0 1 ${width - stroke/2 - 2} ${cy}`}
            fill="none" stroke={track} strokeWidth={stroke} strokeLinecap="round" />
      <path d={`M ${stroke/2 + 2} ${cy} A ${r} ${r} 0 0 1 ${width - stroke/2 - 2} ${cy}`}
            fill="none" stroke={`url(#${gradientId})`} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${total * value} ${total}`} />
    </svg>
  );
};

// Tiny vivid pill — used for tags, scores, category badges
const Pill = ({ children, color = VL.amber, dark = false }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '3px 8px', borderRadius: 999, background: color,
    color: dark ? VL.cream : VL.ink, fontFamily: UI, fontSize: 11, fontWeight: 600,
    letterSpacing: -0.1, lineHeight: 1.3,
  }}>{children}</span>
);

const Wave = ({ bars = 28, color = VL.darkInk, active = true, height = 64 }) => {
  // soft randomized bars, frozen
  const heights = React.useMemo(
    () => Array.from({ length: bars }).map((_, i) => {
      const t = i / bars;
      // bell-ish curve so middle bars are taller, with noise
      const bell = Math.sin(t * Math.PI);
      const noise = 0.4 + Math.random() * 0.6;
      return Math.max(0.18, bell * 0.85 * noise + 0.18);
    }), [bars]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, height }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 4, height: `${h * 100}%`, borderRadius: 4,
          background: color, opacity: active ? (0.5 + h * 0.5) : 0.25,
        }} />
      ))}
    </div>
  );
};

const Chip = ({ children, active, dark, style }) => (
  <div style={{
    height: 36, padding: '0 14px', borderRadius: 999,
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontFamily: UI, fontSize: 13, fontWeight: 500, letterSpacing: -0.1,
    background: active ? (dark ? VL.darkInk : VL.ink) : (dark ? 'rgba(244,239,232,0.08)' : 'rgba(28,24,20,0.05)'),
    color: active ? (dark ? VL.dark : VL.cream) : (dark ? VL.darkInk : VL.ink2),
    border: active ? 'none' : `1px solid ${dark ? 'rgba(244,239,232,0.1)' : VL.hairline}`,
    ...style,
  }}>{children}</div>
);

// Status bar — cream version
const StatusBar = ({ dark = false, time = '9:41' }) => {
  const c = dark ? '#fff' : VL.ink;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 32px 8px', position: 'relative', zIndex: 5,
    }}>
      <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 16, color: c, letterSpacing: -0.2 }}>{time}</div>
      <div style={{ width: 126, height: 0 }} />
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><path d="M1 8.5h2v2H1zm4-2h2v4H5zm4-2h2v6H9zm4-2h2v8h-2z" fill={c}/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 2.5c1.9 0 3.6 0.7 4.9 2l1-1c-1.6-1.5-3.7-2.5-5.9-2.5S3.1 2 1.6 3.5l1 1c1.3-1.3 3-2 4.9-2zm0 3c1 0 2 0.4 2.7 1.1l1-1c-1-1-2.3-1.6-3.7-1.6s-2.7 0.6-3.7 1.6l1 1c0.7-0.7 1.7-1.1 2.7-1.1zM6 9.5h3v-2H6v2z" fill={c}/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke={c} strokeOpacity="0.4" fill="none"/><rect x="2" y="2" width="17" height="7" rx="1.5" fill={c}/><path d="M21.5 4v3c0.6-0.2 1-0.7 1-1.5s-0.4-1.3-1-1.5z" fill={c} opacity="0.5"/></svg>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────
// Frame — wraps each screen with status bar + dynamic island.
// We don't use IOSDevice for these; we want full design control.
// ───────────────────────────────────────────────────────────────
const Phone = ({ children, dark = false, bg, screen, time = '9:41' }) => (
  <div data-screen-label={screen} style={{
    width: 402, height: 874, position: 'relative', overflow: 'hidden',
    background: bg || (dark ? VL.dark : VL.cream),
    fontFamily: UI, color: dark ? VL.darkInk : VL.ink,
    WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale',
  }}>
    <div style={{
      position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
      width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
    }} />
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
      <StatusBar dark={dark} time={time} />
    </div>
    <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
    <div style={{
      position: 'absolute', bottom: 8, left: 0, right: 0, height: 5, zIndex: 60,
      display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none',
    }}>
      <div style={{ width: 134, height: 5, borderRadius: 100, background: dark ? 'rgba(244,239,232,0.7)' : 'rgba(28,24,20,0.3)' }} />
    </div>
  </div>
);

// ───────────────────────────────────────────────────────────────
// Tab bar — bottom nav
// ───────────────────────────────────────────────────────────────
const TabBar = ({ active = 'home' }) => {
  const tab = (id, label, icon) => (
    <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      color: active === id ? VL.ink : VL.inkSoft, flex: 1 }}>
      {icon}
      <div style={{ fontFamily: UI, fontSize: 10, fontWeight: 500, letterSpacing: -0.1 }}>{label}</div>
    </div>
  );
  const ic = (path) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 24, paddingTop: 10,
      background: 'linear-gradient(to top, rgba(244,239,232,1) 60%, rgba(244,239,232,0))',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '14px 22px 28px',
      zIndex: 40,
    }}>
      {tab('home', 'Today',     ic(<><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></>))}
      {tab('topics', 'Topics',  ic(<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></>))}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: VL.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(28,24,20,0.25)', marginTop: -14,
          color: VL.cream }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="9" y="3" width="6" height="12" rx="3"/>
            <path d="M5 11a7 7 0 0014 0M12 18v3"/>
          </svg>
        </div>
      </div>
      {tab('journey', 'Journey', ic(<><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>))}
      {tab('me', 'Profile',     ic(<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></>))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 1 · TODAY — home screen
// ═══════════════════════════════════════════════════════════════
function ScreenToday() {
  return (
    <Phone screen="01 Today">
      {/* header */}
      <div style={{ paddingTop: 64, paddingLeft: 28, paddingRight: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: VL.inkMuted }}>VOICELABS</div>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: VL.creamDeep,
            border: `1px solid ${VL.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: DISPLAY, fontSize: 16, fontStyle: 'italic', color: VL.ink2 }}>L</div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '24px 28px 100px' }}>
        {/* greeting */}
        <div style={{ fontFamily: DISPLAY, fontSize: 44, lineHeight: 1.05, fontWeight: 400, letterSpacing: -1, marginTop: 8 }}>
          Good morning,<br/>
          <span style={{ fontStyle: 'italic', color: VL.ink2 }}>Lena.</span>
        </div>
        <div style={{ fontFamily: UI, fontSize: 14, color: VL.inkMuted, marginTop: 12, lineHeight: 1.5 }}>
          A 90-second drill keeps the streak alive.
        </div>

        {/* hero card */}
        <div style={{ marginTop: 28, borderRadius: 24, padding: 22,
          background: VL.creamLight, border: `1px solid ${VL.hairline}`,
          boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 10,
            letterSpacing: 1.4, textTransform: 'uppercase', color: VL.coral }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: VL.coral }} />
            TODAY'S DRILL
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 28, lineHeight: 1.1, marginTop: 12, letterSpacing: -0.4 }}>
            Pitch your project in <span style={{ fontStyle: 'italic' }}>60 seconds</span>
          </div>
          <div style={{ fontFamily: UI, fontSize: 13, color: VL.inkMuted, marginTop: 8, lineHeight: 1.5 }}>
            Practise the PREP framework. Open with a sharp claim, support with one reason.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <Pill color={VL.coral}>Pitch</Pill>
              <Pill color={VL.lemon}>1 min</Pill>
              <Pill color={VL.lavender} dark>PREP</Pill>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: VL.ink, color: VL.cream,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 7h8M7 3l4 4-4 4"/>
              </svg>
            </div>
          </div>
        </div>

        {/* streak strip */}
        <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
          <div style={{ flex: 1, padding: 16, borderRadius: 20, border: `1px solid ${VL.hairline}` }}>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1.2, color: VL.inkMuted, textTransform: 'uppercase' }}>STREAK</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 38, lineHeight: 1, letterSpacing: -1 }}>12</div>
              <div style={{ fontFamily: UI, fontSize: 12, color: VL.inkMuted }}>days</div>
            </div>
          </div>
          <div style={{ flex: 1, padding: 16, borderRadius: 20, border: `1px solid ${VL.hairline}` }}>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1.2, color: VL.inkMuted, textTransform: 'uppercase' }}>AVG SCORE</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 38, lineHeight: 1, letterSpacing: -1 }}>74</div>
              <div style={{ fontFamily: UI, fontSize: 12, color: VL.sage, fontWeight: 600 }}>+6</div>
            </div>
          </div>
        </div>

        {/* recents */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 12 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.inkMuted, textTransform: 'uppercase' }}>RECENT</div>
          <div style={{ fontFamily: UI, fontSize: 12, color: VL.ink2, fontWeight: 500 }}>See all</div>
        </div>

        {[
          { topic: 'Why we should kill the meeting', cat: 'Debate', when: 'Yesterday', dur: '2 min', score: 81, color: VL.lavender },
          { topic: 'Explain compound interest to a 12-year-old', cat: 'Explanation', when: '2 days ago', dur: '90 s', score: 68, color: VL.amber },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
            borderBottom: i === 0 ? `1px solid ${VL.hairline}` : 'none' }}>
            <Ring size={44} stroke={3} value={s.score / 100} color={s.color}>
              <span style={{ fontFamily: DISPLAY, fontSize: 16, letterSpacing: -0.4 }}>{s.score}</span>
            </Ring>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: UI, fontSize: 14, fontWeight: 500, color: VL.ink, lineHeight: 1.3,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.topic}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <Pill color={s.color}>{s.cat}</Pill>
                <Pill color={VL.lemon}>{s.dur}</Pill>
                <span style={{ fontFamily: UI, fontSize: 11, color: VL.inkSoft }}>{s.when}</span>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={VL.inkSoft} strokeWidth="1.6" strokeLinecap="round">
              <path d="M5 2l5 5-5 5"/>
            </svg>
          </div>
        ))}
      </div>

      <TabBar active="home" />
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2 · TOPICS — 6 categories grid
// ═══════════════════════════════════════════════════════════════
function ScreenTopics() {
  const cats = [
    { name: 'Pitch',        count: 22, color: VL.coral,    bg: 'oklch(0.94 0.06 35)',  glyph: '◆' },
    { name: 'Storytelling', count: 24, color: VL.amber,    bg: 'oklch(0.94 0.08 85)',  glyph: '✶' },
    { name: 'Debate',       count: 18, color: VL.lavender, bg: 'oklch(0.92 0.08 295)', glyph: '⊕' },
    { name: 'Smalltalk',    count: 16, color: VL.mint,     bg: 'oklch(0.93 0.07 165)', glyph: '◇' },
    { name: 'Explanation',  count: 20, color: VL.ocean,    bg: 'oklch(0.93 0.06 235)', glyph: '◐' },
    { name: 'Reflection',   count: 14, color: VL.rose,     bg: 'oklch(0.94 0.06 10)',  glyph: '○' },
  ];

  return (
    <Phone screen="02 Topic Library">
      <div style={{ paddingTop: 64, paddingLeft: 28, paddingRight: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.inkMuted, textTransform: 'uppercase' }}>LIBRARY</div>
          <div style={{ fontFamily: UI, fontSize: 12, color: VL.ink2, fontWeight: 500 }}>114 topics</div>
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 40, lineHeight: 1.05, marginTop: 14, letterSpacing: -1, fontWeight: 400 }}>
          What do you want<br/>to <span style={{ fontStyle: 'italic' }}>practise</span>?
        </div>
      </div>

      {/* search */}
      <div style={{ padding: '20px 28px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
          background: VL.creamLight, borderRadius: 14, border: `1px solid ${VL.hairline}` }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={VL.inkMuted} strokeWidth="1.6">
            <circle cx="6" cy="6" r="4.5"/><path d="M9.5 9.5L13 13" strokeLinecap="round"/>
          </svg>
          <div style={{ fontFamily: UI, fontSize: 14, color: VL.inkMuted, flex: 1 }}>Search or type your own…</div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: VL.inkSoft, padding: '2px 6px',
            border: `1px solid ${VL.hairline}`, borderRadius: 4 }}>⌘K</div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '20px 28px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {cats.map((c, i) => (
            <div key={c.name} style={{
              padding: 18, borderRadius: 20, background: c.bg,
              position: 'relative', overflow: 'hidden', minHeight: 130,
            }}>
              <div style={{ position: 'absolute', top: -16, right: -8, fontSize: 96,
                color: c.color, opacity: 0.55, fontFamily: DISPLAY, lineHeight: 1, userSelect: 'none' }}>{c.glyph}</div>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: c.color, marginBottom: 14,
                  boxShadow: `0 4px 12px ${c.color}` }} />
                <div style={{ fontFamily: DISPLAY, fontSize: 22, letterSpacing: -0.4, color: VL.ink }}>{c.name}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: VL.ink2, marginTop: 4, fontWeight: 500 }}>{c.count} topics</div>
              </div>
            </div>
          ))}
        </div>

        {/* daily challenge */}
        <div style={{ marginTop: 16, padding: 16, borderRadius: 18,
          background: VL.ink, color: VL.cream, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(244,239,232,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontStyle: 'italic', fontSize: 20 }}>?</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1.4, color: VL.amber, textTransform: 'uppercase' }}>SURPRISE ME</div>
            <div style={{ fontFamily: UI, fontSize: 13, marginTop: 3 }}>Random topic, random framework</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 2l5 5-5 5"/>
          </svg>
        </div>
      </div>

      <TabBar active="topics" />
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3 · SETUP — pick duration + framework
// ═══════════════════════════════════════════════════════════════
function ScreenSetup() {
  const frameworks = [
    { id: 'star', name: 'STAR', sub: 'Situation · Task · Action · Result', active: true },
    { id: 'prep', name: 'PREP', sub: 'Point · Reason · Example · Point' },
    { id: 'pyr',  name: 'Pyramid', sub: 'Answer first, support after' },
  ];

  return (
    <Phone screen="03 Setup">
      <div style={{ paddingTop: 56, paddingLeft: 22, paddingRight: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: VL.creamLight,
            border: `1px solid ${VL.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={VL.ink2} strokeWidth="1.8" strokeLinecap="round"><path d="M9 2L4 7l5 5"/></svg>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.inkMuted, textTransform: 'uppercase' }}>STORYTELLING</div>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: VL.creamLight,
            border: `1px solid ${VL.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill={VL.ink2}><circle cx="2" cy="6.5" r="1.2"/><circle cx="6.5" cy="6.5" r="1.2"/><circle cx="11" cy="6.5" r="1.2"/></svg>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '24px 28px 24px' }}>
        {/* topic title */}
        <div style={{ fontFamily: DISPLAY, fontSize: 32, lineHeight: 1.1, letterSpacing: -0.6, fontWeight: 400, marginTop: 12 }}>
          Tell us about a time you <span style={{ fontStyle: 'italic' }}>changed someone's mind.</span>
        </div>
        <div style={{ fontFamily: UI, fontSize: 13, color: VL.inkMuted, marginTop: 12, lineHeight: 1.55 }}>
          A short personal story. Set the scene, name the conflict, land the turn.
        </div>

        {/* duration */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.4, color: VL.inkMuted, textTransform: 'uppercase', marginBottom: 10 }}>DURATION</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ t: '60s' }, { t: '90s', active: true }, { t: '2 min' }, { t: '3 min' }].map((d, i) => (
              <div key={i} style={{ flex: 1, padding: '14px 0', borderRadius: 14, textAlign: 'center',
                background: d.active ? VL.ink : VL.creamLight,
                color: d.active ? VL.cream : VL.ink,
                border: d.active ? 'none' : `1px solid ${VL.hairline}`,
                fontFamily: UI, fontSize: 14, fontWeight: 500 }}>{d.t}</div>
            ))}
          </div>
        </div>

        {/* framework */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.4, color: VL.inkMuted, textTransform: 'uppercase' }}>FRAMEWORK</div>
            <div style={{ fontFamily: UI, fontSize: 11, color: VL.inkSoft }}>Optional</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {frameworks.map((f) => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14,
                background: f.active ? VL.creamLight : 'transparent',
                border: f.active ? `1px solid ${VL.ink}` : `1px solid ${VL.hairline}` }}>
                <div style={{ width: 22, height: 22, borderRadius: 11,
                  background: f.active ? VL.ink : 'transparent',
                  border: f.active ? 'none' : `1.5px solid ${VL.hairlineStrong}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {f.active && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={VL.cream} strokeWidth="2" strokeLinecap="round"><path d="M2 5l2.5 2.5L8.5 2.5"/></svg>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: DISPLAY, fontSize: 20, letterSpacing: -0.3 }}>{f.name}</div>
                  <div style={{ fontFamily: UI, fontSize: 11, color: VL.inkMuted, marginTop: 1 }}>{f.sub}</div>
                </div>
              </div>
            ))}
            <div style={{ fontFamily: UI, fontSize: 12, color: VL.ink2, fontWeight: 500, padding: '10px 14px' }}>
              + 9 more frameworks
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 22px 36px', position: 'relative', zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 8px 8px 22px', borderRadius: 999, background: VL.ink, color: VL.cream }}>
          <div>
            <div style={{ fontFamily: UI, fontSize: 11, color: 'rgba(244,239,232,0.6)' }}>Begin recording</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 18, fontStyle: 'italic' }}>I'm ready</div>
          </div>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: VL.coral,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={VL.cream} strokeWidth="2" strokeLinecap="round">
              <rect x="9" y="3" width="6" height="12" rx="3"/>
              <path d="M5 11a7 7 0 0014 0M12 18v3"/>
            </svg>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4 · COUNTDOWN — dark, 3-2-1
// ═══════════════════════════════════════════════════════════════
function ScreenCountdown() {
  return (
    <Phone screen="04 Countdown" dark>
      <div style={{ paddingTop: 64, paddingLeft: 22, paddingRight: 22, position: 'relative', zIndex: 5 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.darkMuted, textTransform: 'uppercase', textAlign: 'center' }}>
          GET READY
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative' }}>
        {/* glow */}
        <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, oklch(0.72 0.13 35 / 0.18), transparent 70%)' }} />
        <div style={{ position: 'relative', fontFamily: DISPLAY, fontSize: 220, lineHeight: 1, color: VL.darkInk,
          letterSpacing: -8, fontWeight: 400 }}>3</div>
        <div style={{ fontFamily: DISPLAY, fontStyle: 'italic', fontSize: 22, color: VL.darkMuted, marginTop: 12, letterSpacing: -0.4 }}>
          take a breath
        </div>
      </div>

      {/* topic at bottom */}
      <div style={{ padding: '0 28px 60px', textAlign: 'center', position: 'relative', zIndex: 5 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.coral, textTransform: 'uppercase', marginBottom: 8 }}>YOUR TOPIC</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 17, lineHeight: 1.35, color: VL.darkInk, fontStyle: 'italic' }}>
          Tell us about a time you changed someone's mind.
        </div>
      </div>
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5 · RECORDING — dark, ring + waveform + cheat sheet
// ═══════════════════════════════════════════════════════════════
function ScreenRecording() {
  const elapsed = 38; // seconds
  const target = 90;
  const value = elapsed / target;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <Phone screen="05 Recording" dark>
      {/* cheat sheet — STAR steps */}
      <div style={{ paddingTop: 60, paddingLeft: 22, paddingRight: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.darkMuted, textTransform: 'uppercase' }}>STAR · CHEAT SHEET</div>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.coral, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: VL.coral }} />
            REC
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { l: 'S', sub: 'Situation', done: true },
            { l: 'T', sub: 'Task', done: true },
            { l: 'A', sub: 'Action', active: true },
            { l: 'R', sub: 'Result' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '10px 0', borderRadius: 10, textAlign: 'center',
              background: s.active ? VL.coral : (s.done ? 'rgba(244,239,232,0.06)' : 'transparent'),
              border: s.done && !s.active ? `1px solid rgba(244,239,232,0.08)` : (s.active ? 'none' : `1px solid rgba(244,239,232,0.04)`),
              opacity: s.done && !s.active ? 0.5 : 1 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 18, color: s.active ? VL.dark : VL.darkInk, lineHeight: 1 }}>{s.l}</div>
              <div style={{ fontFamily: UI, fontSize: 9, color: s.active ? 'rgba(15,14,13,0.7)' : VL.darkMuted, marginTop: 3, letterSpacing: 0.5, textTransform: 'uppercase' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* progress ring + time */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative' }}>
        <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle, oklch(0.72 0.13 35 / 0.14), transparent 65%)' }} />
        <div style={{ position: 'relative' }}>
          <Ring size={260} stroke={4} value={value} color={VL.coral} trackColor="rgba(244,239,232,0.06)">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.darkMuted, textTransform: 'uppercase' }}>ELAPSED</div>
              <div style={{ fontFamily: DISPLAY, fontSize: 78, lineHeight: 1, letterSpacing: -2, color: VL.darkInk,
                fontVariantNumeric: 'tabular-nums', marginTop: 6 }}>{mm}:{ss}</div>
              <div style={{ fontFamily: UI, fontSize: 12, color: VL.darkMuted, marginTop: 4 }}>of 1:30 target</div>
            </div>
          </Ring>
        </div>

        <div style={{ marginTop: 36, width: 280 }}>
          <Wave bars={36} color={VL.coral} active height={50}/>
        </div>
      </div>

      {/* controls */}
      <div style={{ padding: '0 28px 56px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, position: 'relative', zIndex: 5 }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: 'rgba(244,239,232,0.08)',
          border: '1px solid rgba(244,239,232,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: VL.darkInk }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <rect x="4" y="3" width="3.5" height="12" rx="1"/>
            <rect x="10.5" y="3" width="3.5" height="12" rx="1"/>
          </svg>
        </div>
        <div style={{ width: 76, height: 76, borderRadius: 38, background: VL.coral,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: VL.darkInk,
          boxShadow: '0 8px 30px oklch(0.72 0.13 35 / 0.4)' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
            <rect x="5" y="5" width="12" height="12" rx="2"/>
          </svg>
        </div>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: 'rgba(244,239,232,0.08)',
          border: '1px solid rgba(244,239,232,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: VL.darkInk }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M14 5L5 14M5 5l9 9"/>
          </svg>
        </div>
      </div>
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════
// 6 · PROCESSING — analysing
// ═══════════════════════════════════════════════════════════════
function ScreenProcessing() {
  const steps = [
    { l: 'Transcribing', sub: 'Whisper · 312 words', done: true },
    { l: 'Analysing structure', sub: 'STAR pattern match', done: true },
    { l: 'Scoring delivery', sub: 'pace · clarity · filler', active: true },
    { l: 'Drafting feedback', sub: 'strengths · improvements' },
  ];
  return (
    <Phone screen="06 Processing">
      <div style={{ paddingTop: 64, padding: '64px 28px 0' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.inkMuted, textTransform: 'uppercase', textAlign: 'center' }}>
          ANALYSING · 18 SEC LEFT
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* concentric dotted rings */}
        <div style={{ position: 'relative', width: 240, height: 240,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {[
            { d: 220, c: VL.coral,    delay: 0 },
            { d: 180, c: VL.amber,    delay: 0.3 },
            { d: 140, c: VL.lavender, delay: 0.6 },
          ].map((r, i) => (
            <div key={i} style={{
              position: 'absolute', width: r.d, height: r.d, borderRadius: '50%',
              border: `1px dashed ${r.c}`, opacity: 0.6,
              animation: `vl-spin ${10 + i * 4}s linear infinite${i % 2 ? ' reverse' : ''}`,
            }} />
          ))}
          <div style={{ width: 80, height: 80, borderRadius: 40, background: VL.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wave bars={5} color={VL.cream} height={32}/>
          </div>
        </div>

        <div style={{ fontFamily: DISPLAY, fontSize: 32, marginTop: 36, letterSpacing: -0.4, fontWeight: 400 }}>
          Listening <span style={{ fontStyle: 'italic' }}>carefully…</span>
        </div>
      </div>

      {/* steps */}
      <div style={{ padding: '0 28px 56px' }}>
        <div style={{ borderRadius: 18, background: VL.creamLight, border: `1px solid ${VL.hairline}`, padding: 6 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
              borderTop: i ? `1px solid ${VL.hairline}` : 'none' }}>
              <div style={{ width: 18, height: 18, borderRadius: 9,
                background: s.done ? VL.sage : (s.active ? 'transparent' : 'transparent'),
                border: s.active ? `2px solid ${VL.coral}` : (s.done ? 'none' : `1.5px solid ${VL.hairlineStrong}`),
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.done && <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M2 4.5l2 2L7 2.5"/></svg>}
                {s.active && <span style={{ width: 6, height: 6, borderRadius: 3, background: VL.coral, animation: 'vl-pulse 1.2s ease-in-out infinite' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 500, color: s.done ? VL.inkMuted : VL.ink }}>{s.l}</div>
                <div style={{ fontFamily: UI, fontSize: 11, color: VL.inkSoft, marginTop: 1 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════
// 7 · SCORE — overall + 4 sub-scores
// ═══════════════════════════════════════════════════════════════
function ScreenScore() {
  const subs = [
    { l: 'Structure',  v: 86, c: VL.amber },
    { l: 'Clarity',    v: 71, c: VL.coral },
    { l: 'Delivery',   v: 78, c: VL.lavender },
    { l: 'Engagement', v: 75, c: VL.sage },
  ];
  return (
    <Phone screen="07 Score">
      <div style={{ paddingTop: 56, padding: '56px 22px 0', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: VL.creamLight,
          border: `1px solid ${VL.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={VL.ink2} strokeWidth="1.8" strokeLinecap="round"><path d="M9 2L4 7l5 5"/></svg>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.inkMuted, textTransform: 'uppercase' }}>YOUR SCORE</div>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: VL.creamLight,
          border: `1px solid ${VL.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke={VL.ink2} strokeWidth="1.6" strokeLinecap="round">
            <path d="M6.5 8.5V2M3.5 5l3-3 3 3M2 11h9"/>
          </svg>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '12px 28px 24px' }}>
        {/* big tagline */}
        <div style={{ fontFamily: DISPLAY, fontSize: 32, lineHeight: 1.05, letterSpacing: -0.5, marginTop: 12, fontWeight: 400 }}>
          Strong middle. <span style={{ fontStyle: 'italic', color: VL.ink2 }}>Loose ending.</span>
        </div>

        {/* gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 18, position: 'relative' }}>
          <ArcGauge width={290} value={0.78} stroke={14} segments={[VL.amber, VL.coral, VL.lavender, VL.sage]} />
          <div style={{ position: 'absolute', top: 36, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 86, lineHeight: 1, letterSpacing: -3, fontWeight: 400 }}>78</div>
            <div style={{ fontFamily: UI, fontSize: 11, color: VL.inkMuted, marginTop: 2 }}>out of 100</div>
          </div>
          {/* min / max ticks */}
          <div style={{ width: 290, display: 'flex', justifyContent: 'space-between', marginTop: -2,
            fontFamily: MONO, fontSize: 10, color: VL.inkSoft, letterSpacing: 1 }}>
            <span>0</span><span>100</span>
          </div>
        </div>

        {/* delta */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.4, color: VL.sage, textTransform: 'uppercase',
            padding: '4px 8px', borderRadius: 6, background: 'oklch(0.72 0.06 150 / 0.14)' }}>+ 9 vs LAST</span>
          <span style={{ fontFamily: UI, fontSize: 12, color: VL.inkMuted }}>Personal best on Storytelling</span>
        </div>

        {/* sub-scores */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 22 }}>
          {subs.map((s) => (
            <div key={s.l} style={{ padding: 14, borderRadius: 16,
              background: `color-mix(in oklab, ${s.c} 14%, ${VL.creamLight})`,
              border: `1px solid color-mix(in oklab, ${s.c} 22%, transparent)`,
              display: 'flex', alignItems: 'center', gap: 12 }}>
              <Ring size={52} stroke={5} value={s.v / 100} color={s.c}>
                <span style={{ fontFamily: DISPLAY, fontSize: 17, letterSpacing: -0.3 }}>{s.v}</span>
              </Ring>
              <div>
                <div style={{ fontFamily: UI, fontSize: 12, color: VL.ink, fontWeight: 600 }}>{s.l}</div>
                <div style={{ fontFamily: UI, fontSize: 10, color: VL.ink2, marginTop: 2,
                  fontFamily: MONO, letterSpacing: 0.6, textTransform: 'uppercase' }}>
                  {s.v >= 80 ? 'Excellent' : s.v >= 70 ? 'Solid' : s.v >= 60 ? 'Working on it' : 'Needs work'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 22, padding: '14px 18px', borderRadius: 16, background: VL.ink, color: VL.cream,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: UI, fontSize: 11, color: 'rgba(244,239,232,0.6)' }}>What worked, what to fix</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 18, fontStyle: 'italic' }}>Detailed feedback</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M5 3l5 5-5 5"/>
          </svg>
        </div>
      </div>
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════
// 8 · FEEDBACK DETAIL — strengths, improvements w/ quotes, next drill
// ═══════════════════════════════════════════════════════════════
function ScreenFeedback() {
  return (
    <Phone screen="08 Feedback">
      <div style={{ paddingTop: 56, padding: '56px 22px 0', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: VL.creamLight,
          border: `1px solid ${VL.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={VL.ink2} strokeWidth="1.8" strokeLinecap="round"><path d="M9 2L4 7l5 5"/></svg>
        </div>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.inkMuted, textTransform: 'uppercase', textAlign: 'center' }}>FEEDBACK · 78</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
            {['Summary','Transcript','Drill'].map((t, i) => (
              <div key={t} style={{ fontFamily: UI, fontSize: 11, fontWeight: 500,
                color: i === 0 ? VL.ink : VL.inkSoft }}>{t}{i < 2 ? ' ·' : ''}</div>
            ))}
          </div>
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '20px 24px 28px' }}>
        {/* what worked */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: VL.sage }} />
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.inkMuted, textTransform: 'uppercase' }}>WHAT WORKED</div>
        </div>
        {[
          { t: 'Concrete opening hook', q: '"It was 11pm and the deck still wasn\'t done…"' },
          { t: 'Active verbs throughout', q: '"I cut", "I rewrote", "I shipped" — strong ownership.' },
        ].map((s, i) => (
          <div key={i} style={{ paddingBottom: 14, marginBottom: 14, borderBottom: `1px solid ${VL.hairline}` }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 19, letterSpacing: -0.3, lineHeight: 1.25 }}>{s.t}</div>
            <div style={{ fontFamily: DISPLAY, fontStyle: 'italic', fontSize: 13, color: VL.inkMuted,
              marginTop: 6, lineHeight: 1.5, paddingLeft: 12, borderLeft: `2px solid ${VL.sage}` }}>{s.q}</div>
          </div>
        ))}

        {/* fix this */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, marginBottom: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: VL.coral }} />
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.inkMuted, textTransform: 'uppercase' }}>FIX THIS NEXT</div>
        </div>
        {[
          {
            t: '8 filler words — try a beat instead',
            q: '"…we needed to, um, basically rethink, you know, the whole…"',
            tag: 'CLARITY',
          },
          {
            t: 'Ending trailed off',
            q: '"…and yeah, that\'s pretty much it I guess."',
            tag: 'STRUCTURE',
          },
        ].map((s, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 14, background: VL.creamLight,
            border: `1px solid ${VL.hairline}`, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 17, letterSpacing: -0.2, lineHeight: 1.3, flex: 1 }}>{s.t}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1.2, color: VL.coral, textTransform: 'uppercase',
                padding: '3px 7px', borderRadius: 6, background: 'oklch(0.72 0.13 35 / 0.12)', flexShrink: 0 }}>{s.tag}</div>
            </div>
            <div style={{ fontFamily: DISPLAY, fontStyle: 'italic', fontSize: 13, color: VL.inkMuted,
              marginTop: 8, lineHeight: 1.5, paddingLeft: 12, borderLeft: `2px solid ${VL.coral}` }}>{s.q}</div>
          </div>
        ))}

        {/* next drill */}
        <div style={{ marginTop: 14, padding: 18, borderRadius: 18, background: VL.ink, color: VL.cream }}>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1.4, color: VL.amber, textTransform: 'uppercase' }}>NEXT DRILL · 60s</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 22, lineHeight: 1.15, letterSpacing: -0.3, marginTop: 8 }}>
            Re-record the <span style={{ fontStyle: 'italic' }}>last 15 seconds</span> with a sharp ending.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
            <div style={{ fontFamily: UI, fontSize: 12, color: 'rgba(244,239,232,0.6)' }}>Same topic · Pyramid framework</div>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: VL.coral,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={VL.cream} strokeWidth="2" strokeLinecap="round">
                <rect x="9" y="3" width="6" height="12" rx="3"/>
                <path d="M5 11a7 7 0 0014 0M12 18v3"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ═══════════════════════════════════════════════════════════════
// 9 · JOURNEY — progress over time
// ═══════════════════════════════════════════════════════════════
function ScreenJourney() {
  // 14 days of scores
  const data = [62, 65, 58, 70, 64, 72, 68, 74, 71, 76, 73, 78, 74, 78];
  const max = 100;
  const w = 346, h = 140, pad = 6;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y];
  });
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const fillPath = `${path} L ${points[points.length-1][0]} ${h} L ${points[0][0]} ${h} Z`;

  return (
    <Phone screen="09 Journey">
      <div style={{ paddingTop: 64, paddingLeft: 28, paddingRight: 28 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.inkMuted, textTransform: 'uppercase' }}>YOUR JOURNEY</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 40, lineHeight: 1.05, letterSpacing: -1, marginTop: 12, fontWeight: 400 }}>
          You're getting <span style={{ fontStyle: 'italic' }}>sharper.</span>
        </div>
        <div style={{ fontFamily: UI, fontSize: 13, color: VL.inkMuted, marginTop: 10, lineHeight: 1.5 }}>
          14 sessions · 22 min spoken · streak of 12 days
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '24px 28px 100px' }}>
        {/* range chips */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {['Week', '2 wk', 'Month', 'All'].map((r, i) => (
            <Chip key={r} active={i === 1}>{r}</Chip>
          ))}
        </div>

        {/* chart */}
        <div style={{ borderRadius: 20, background: VL.creamLight, border: `1px solid ${VL.hairline}`, padding: '20px 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingLeft: 6 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 44, lineHeight: 1, letterSpacing: -1 }}>74</div>
            <div style={{ fontFamily: UI, fontSize: 11, color: VL.sage, fontWeight: 600 }}>+ 12 vs prior</div>
          </div>
          <div style={{ fontFamily: UI, fontSize: 11, color: VL.inkMuted, paddingLeft: 6, marginTop: 2 }}>
            Average score · last 14 days
          </div>

          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ marginTop: 12, display: 'block' }}>
            <defs>
              <linearGradient id="vlGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.13 35)" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="oklch(0.72 0.13 35)" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {[25, 50, 75].map((y) => (
              <line key={y} x1={0} x2={w} y1={h - pad - (y/100)*(h-pad*2)} y2={h - pad - (y/100)*(h-pad*2)}
                stroke={VL.hairline} strokeDasharray="2 4" />
            ))}
            <path d={fillPath} fill="url(#vlGrad)" />
            <path d={path} stroke={VL.coral} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* end-point dot */}
            <circle cx={points[points.length-1][0]} cy={points[points.length-1][1]} r={5} fill={VL.cream} stroke={VL.coral} strokeWidth="2"/>
          </svg>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 9,
            color: VL.inkSoft, letterSpacing: 1, padding: '4px 6px 0' }}>
            <span>26 APR</span><span>3 MAY</span><span>9 MAY</span>
          </div>
        </div>

        {/* breakdown by category */}
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: VL.inkMuted, textTransform: 'uppercase', marginTop: 22, marginBottom: 12 }}>
          BY CATEGORY
        </div>
        {[
          { l: 'Pitch',        v: 82, c: VL.coral },
          { l: 'Storytelling', v: 78, c: VL.amber },
          { l: 'Debate',       v: 71, c: VL.lavender },
          { l: 'Explanation',  v: 64, c: VL.ocean },
        ].map((b, i) => (
          <div key={b.l} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0',
            borderTop: i ? `1px solid ${VL.hairline}` : 'none' }}>
            <div style={{ fontFamily: UI, fontSize: 13, fontWeight: 500, width: 92, color: VL.ink }}>{b.l}</div>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(28,24,20,0.06)', position: 'relative' }}>
              <div style={{ height: '100%', width: `${b.v}%`, background: b.c, borderRadius: 2 }} />
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 18, letterSpacing: -0.3, width: 32, textAlign: 'right' }}>{b.v}</div>
          </div>
        ))}
      </div>

      <TabBar active="journey" />
    </Phone>
  );
}

// keyframes
if (typeof document !== 'undefined' && !document.getElementById('vl-keyframes')) {
  const s = document.createElement('style');
  s.id = 'vl-keyframes';
  s.textContent = `
    @keyframes vl-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
    @keyframes vl-pulse { 0%, 100% { opacity: 1; transform: scale(1) } 50% { opacity: 0.4; transform: scale(0.7) } }
  `;
  document.head.appendChild(s);
}

Object.assign(window, {
  ScreenToday, ScreenTopics, ScreenSetup, ScreenCountdown, ScreenRecording,
  ScreenProcessing, ScreenScore, ScreenFeedback, ScreenJourney,
});
