// Voicelabs — composes the 9 screens into a Design Canvas

const sectionStyle = { fontFamily: '"Instrument Serif", serif' };

function App() {
  return (
    <DesignCanvas>
      <DCSection id="core" title="Voicelabs · Core loop"
        subtitle="Personal communication coach in your browser. Record, get AI feedback in 30s.">
        <DCArtboard id="01-today"      label="01 · Today"             width={402} height={874}><ScreenToday /></DCArtboard>
        <DCArtboard id="02-topics"     label="02 · Topic library"     width={402} height={874}><ScreenTopics /></DCArtboard>
        <DCArtboard id="03-setup"      label="03 · Setup"             width={402} height={874}><ScreenSetup /></DCArtboard>
      </DCSection>

      <DCSection id="record" title="Recording surface"
        subtitle="Dark screen for focus. Countdown → ring + waveform → analysing.">
        <DCArtboard id="04-countdown"  label="04 · 3-2-1 countdown"   width={402} height={874}><ScreenCountdown /></DCArtboard>
        <DCArtboard id="05-recording"  label="05 · Recording (STAR)"  width={402} height={874}><ScreenRecording /></DCArtboard>
        <DCArtboard id="06-processing" label="06 · Processing"        width={402} height={874}><ScreenProcessing /></DCArtboard>
      </DCSection>

      <DCSection id="feedback" title="Feedback & journey"
        subtitle="Score 0-100, four sub-scores, strengths + improvements with quotes, next drill.">
        <DCArtboard id="07-score"      label="07 · Score"             width={402} height={874}><ScreenScore /></DCArtboard>
        <DCArtboard id="08-feedback"   label="08 · Detailed feedback" width={402} height={874}><ScreenFeedback /></DCArtboard>
        <DCArtboard id="09-journey"    label="09 · Journey"           width={402} height={874}><ScreenJourney /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
