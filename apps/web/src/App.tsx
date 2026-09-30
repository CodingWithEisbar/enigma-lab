import { useState } from 'react';

export function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="app-shell">
      {!loaded && (
        <div className="loading" role="status" aria-live="polite">
          <span className="loading-mark">E</span>
          <strong>Đang khởi động Enigma Lab…</strong>
        </div>
      )}
      <iframe
        className={loaded ? 'simulator is-ready' : 'simulator'}
        src="/enigma_simulator.html"
        title="Enigma Lab simulator"
        onLoad={() => setLoaded(true)}
      />
    </main>
  );
}
