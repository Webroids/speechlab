/* global React, ReactDOM, IOSDevice,
   HomeScreen, SetupScreen, RecordScreen, FeedbackScreen, LibraryScreen, FrameworksScreen, TrendsScreen,
   Icon, SL_TOPICS */

const { useState: useStateApp } = React;

// Bottom nav
function BottomNav({ tab, onTab, onRecord }) {
  const items = [
    { id: 'home', label: 'Today', icon: 'home' },
    { id: 'library', label: 'Bibliothek', icon: 'library' },
    null,
    { id: 'frameworks', label: 'Frameworks', icon: 'book' },
    { id: 'trends', label: 'Fortschritt', icon: 'chart' },
  ];
  return (
    <nav style={{
      position: 'absolute', insetInline: 0, bottom: 0, zIndex: 10,
      background: 'linear-gradient(to top, var(--background) 65%, transparent)',
      paddingBottom: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '12px 18px 4px' }}>
        {items.map((it) => {
          if (!it) {
            return (
              <button key="record" onClick={onRecord} aria-label="Schnell üben" style={{
                width: 56, height: 56, borderRadius: 9999, background: 'var(--foreground)',
                color: 'var(--background)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: -22,
                boxShadow: '0 6px 20px oklch(0.140 0.015 55 / 25%)',
              }}>
                <Icon name="mic" size={22} strokeWidth={2} />
              </button>
            );
          }
          const active = tab === it.id;
          return (
            <button key={it.id} onClick={() => onTab(it.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '4px 0', fontSize: 10, fontWeight: 500,
              background: 'none', border: 'none', cursor: 'pointer',
              color: active ? 'var(--foreground)' : 'var(--muted-foreground)',
            }}>
              <Icon name={it.icon} size={22} strokeWidth={active ? 2.25 : 1.75} style={{ transform: active ? 'scale(1.06)' : 'scale(1)', transition: 'transform 150ms' }} />
              <span>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function App() {
  const [tab, setTab] = useStateApp('home');
  const [route, setRoute] = useStateApp({ name: 'home' });

  // Default session config (today's drill)
  const [sessionConfig, setSessionConfig] = useStateApp({
    topic: SL_TOPICS[0],
    duration: 60,
    framework: 'prep',
  });

  function go(name, params = {}) { setRoute({ name, ...params }); }

  // Record screen overrides everything (full-screen dark)
  if (route.name === 'record') {
    return (
      <IOSDevice width={390} height={844} dark>
        <RecordScreen
          topic={sessionConfig.topic.text}
          duration={sessionConfig.duration}
          framework={sessionConfig.framework}
          onCancel={() => go('home')}
          onComplete={() => go('feedback', { recId: 'r1' })}
        />
      </IOSDevice>
    );
  }

  // Setup
  if (route.name === 'setup') {
    return (
      <IOSDevice width={390} height={844}>
        <div className="screen no-scrollbar">
          <SetupScreen
            initial={{ duration: sessionConfig.duration, framework: sessionConfig.framework }}
            onCancel={() => go('home')}
            onStart={(cfg) => { setSessionConfig({ ...sessionConfig, ...cfg }); go('record'); }}
          />
        </div>
      </IOSDevice>
    );
  }

  // Feedback
  if (route.name === 'feedback') {
    return (
      <IOSDevice width={390} height={844}>
        <div style={{ position: 'relative', height: '100%' }}>
          <div className="screen no-scrollbar" style={{ paddingBottom: 90 }}>
            <FeedbackScreen
              recordingId={route.recId}
              onBack={() => go('home')}
              onRepeat={() => go('setup')}
              onNewTopic={() => go('setup')}
            />
          </div>
          <BottomNav tab={tab} onTab={(t) => { setTab(t); go(t); }} onRecord={() => go('setup')} />
        </div>
      </IOSDevice>
    );
  }

  // Framework detail
  if (route.name === 'framework_detail') {
    return (
      <IOSDevice width={390} height={844}>
        <div className="screen no-scrollbar">
          <FrameworkDetailScreen
            frameworkId={route.fwId}
            onBack={() => go('frameworks_tab')}
            onStart={(fwId) => { setSessionConfig({ ...sessionConfig, framework: fwId }); go('setup'); }}
          />
        </div>
      </IOSDevice>
    );
  }

  // Main tabs
  const screen =
    tab === 'home'       ? <HomeScreen sessionConfig={sessionConfig} onStartSetup={() => go('setup')} onOpenRecording={(id) => go('feedback', { recId: id })} /> :
    tab === 'library'    ? <LibraryScreen onOpenRecording={(id) => go('feedback', { recId: id })} /> :
    tab === 'frameworks' ? <FrameworksScreen onOpenFramework={(fwId) => go('framework_detail', { fwId })} /> :
    /* trends */           <TrendsScreen />;

  return (
    <IOSDevice width={390} height={844}>
      <div style={{ position: 'relative', height: '100%' }}>
        <div className="screen no-scrollbar">
          {screen}
        </div>
        <BottomNav tab={tab} onTab={(t) => { setTab(t); setRoute({ name: t === 'frameworks' ? 'frameworks_tab' : t }); }} onRecord={() => go('setup')} />
      </div>
    </IOSDevice>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
