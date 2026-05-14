/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// ── LabelCaps ──────────────────────────────────────────────────────────────
function LabelCaps({ children, color, style }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: color ?? 'var(--muted-foreground)',
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Pill ──────────────────────────────────────────────────────────────────
// tinted bg + accent text (the canonical design-system pill)
function Pill({ children, bg, color, style }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
        background: bg,
        color: color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function FilterPill({ active, children, onClick, dotColor }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: active ? 600 : 500,
        background: active ? 'var(--foreground)' : 'var(--card)',
        color: active ? 'var(--background)' : 'var(--muted-foreground)',
        border: active ? '1px solid transparent' : '1px solid var(--vl-hairline)',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transition: 'all 150ms',
      }}
    >
      {dotColor && <span style={{ width: 6, height: 6, borderRadius: 9999, background: active ? 'var(--background)' : dotColor, opacity: active ? 0.6 : 1 }} />}
      {children}
    </button>
  );
}

// ── Buttons ───────────────────────────────────────────────────────────────
function Button({ variant = 'primary', icon, children, onClick, style, full }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '11px 18px',
    borderRadius: 14,
    fontSize: 13.5,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 150ms',
    width: full ? '100%' : undefined,
  };
  const variants = {
    primary:   { background: 'var(--foreground)', color: 'var(--background)' },
    coral:     { background: 'var(--vl-coral)',   color: 'var(--background)' },
    secondary: { background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--vl-hairline)' },
    ghost:     { background: 'transparent', color: 'var(--muted-foreground)' },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {icon}
      {children}
    </button>
  );
}

// ── Icons (Lucide-style, hand-coded paths) ────────────────────────────────
function Icon({ name, size = 16, strokeWidth = 1.75, style }) {
  const paths = {
    home: <><path d="M3 9.5L12 3l9 6.5"/><path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/></>,
    library: <><path d="M4 19V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2zM6 17h13"/></>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></>,
    book: <><path d="M2 19V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v13"/><path d="M14 4h4a2 2 0 0 1 2 2v14H14V4z"/></>,
    chart: <><line x1="3" y1="20" x2="21" y2="20"/><polyline points="6 16 10 11 14 13 20 6"/></>,
    dices: <><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor"/></>,
    video: <><rect x="2" y="6" width="14" height="12" rx="2"/><polygon points="22 8 16 12 22 16"/></>,
    repeat: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><polyline points="3 3 3 8 8 8"/></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 5 5 12 12 19"/></>,
    chevron: <path d="M5 2l5 5-5 5" />,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    pause: <><line x1="9" y1="5" x2="9" y2="19"/><line x1="15" y1="5" x2="15" y2="19"/></>,
    stop: <rect x="6" y="6" width="12" height="12" rx="1.5"/>,
    check: <polyline points="20 6 9 17 4 12"/>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  };
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={{ stroke: 'currentColor', fill: 'none', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0, ...style }}
    >
      {paths[name]}
    </svg>
  );
}

// ── VLRing ────────────────────────────────────────────────────────────────
function scoreColor(score) {
  if (score >= 80) return 'var(--vl-sage)';
  if (score >= 60) return 'var(--vl-amber)';
  return 'var(--vl-coral)';
}

function VLRing({ score, size = 48, stroke = 3.5, color, mono }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(1, Math.max(0, score / 100)));
  const ring = color ?? scoreColor(score);
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--vl-hairline)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={ring} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
      </svg>
      <span
        style={{
          position: 'relative',
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)',
          fontFeatureSettings: '"tnum"',
          fontSize: size * 0.32,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {score}
      </span>
    </div>
  );
}

// ── VLArcGauge ────────────────────────────────────────────────────────────
function VLArcGauge({ score, width = 260, stroke = 14, gradientId = 'vlArc' }) {
  const value = Math.min(1, Math.max(0, score / 100));
  const h = width / 2 + stroke + 6;
  const cy = width / 2 + stroke / 2;
  const r = width / 2 - stroke / 2;
  const total = Math.PI * r;
  const filled = total * value;
  return (
    <div style={{ position: 'relative', width, height: h }}>
      <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="var(--vl-coral)" />
            <stop offset="50%"  stopColor="var(--vl-amber)" />
            <stop offset="100%" stopColor="var(--vl-sage)"  />
          </linearGradient>
        </defs>
        <path d={`M ${stroke/2 + 2} ${cy} A ${r} ${r} 0 0 1 ${width - stroke/2 - 2} ${cy}`} fill="none" stroke="var(--vl-hairline)" strokeWidth={stroke} strokeLinecap="round" />
        <path d={`M ${stroke/2 + 2} ${cy} A ${r} ${r} 0 0 1 ${width - stroke/2 - 2} ${cy}`} fill="none" stroke={`url(#${gradientId})`} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${filled} ${total}`} />
      </svg>
      <div style={{ position: 'absolute', insetInline: 0, bottom: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontFeatureSettings: '"tnum"', fontSize: width * 0.24, lineHeight: 1, letterSpacing: '-0.03em' }}>{score}</span>
      </div>
    </div>
  );
}

// ── Score Sparkline ───────────────────────────────────────────────────────
function MiniSparkline({ values, color = 'var(--vl-coral)', width = 40, height = 20, max = 100 }) {
  if (values.length < 2) return null;
  const step = width / (values.length - 1);
  const pts = values.map((v, i) => `${i * step},${height - (v / max) * height}`).join(' ');
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

Object.assign(window, { LabelCaps, Pill, FilterPill, Button, Icon, VLRing, VLArcGauge, MiniSparkline, scoreColor });
