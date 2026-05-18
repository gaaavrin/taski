// Монетки – встроенный финансовый хелпер
const AtlCoins = () => {
  const T = window.__atlT; const t = T.theme;
  const [error, setError] = React.useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, minHeight: 0 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "stretch", flexShrink: 0,
        background: t.paper, borderBottom: `2px solid ${t.ink}` }}>
        <div style={{ padding: "16px 22px", display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: T.fonts.display, fontSize: 28, fontWeight: 800,
            color: t.ink, textTransform: "uppercase", letterSpacing: ".005em" }}>Монетки</span>
          <span style={{ width: 8, height: 8, background: t.yellow }}/>
        </div>
        <span style={{ flex: 1 }}/>
        <div style={{ padding: "12px 18px", display: "flex", alignItems: "center" }}>
          <a href="http://194.87.145.2/" target="_blank" rel="noreferrer"
            style={{ fontFamily: T.fonts.body, fontWeight: 700, fontSize: 10,
              color: t.ink3, textDecoration: "none", textTransform: "uppercase",
              letterSpacing: ".12em" }}>
            ↗ открыть отдельно
          </a>
        </div>
      </div>

      {/* iframe */}
      {error ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 16,
          background: t.paper2, color: t.ink3 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <rect x="4" y="10" width="40" height="28" rx="0"/>
            <line x1="4" y1="18" x2="44" y2="18"/>
            <line x1="20" y1="30" x2="28" y2="30"/>
          </svg>
          <div style={{ fontFamily: T.fonts.body, fontSize: 14, textAlign: "center" }}>
            Сайт не разрешает встраивание
          </div>
          <a href="http://194.87.145.2/" target="_blank" rel="noreferrer"
            style={{ fontFamily: T.fonts.body, fontWeight: 700, fontSize: 11,
              color: t.accent, textDecoration: "none", textTransform: "uppercase",
              letterSpacing: ".1em", border: `1px solid ${t.accent}`,
              padding: "6px 16px" }}>
            Открыть в браузере
          </a>
        </div>
      ) : (
        <iframe
          src="http://194.87.145.2/"
          onError={() => setError(true)}
          style={{ flex: 1, border: "none", width: "100%", minHeight: 0 }}
          title="Монетки"
        />
      )}
    </div>
  );
};

window.AtlCoins = AtlCoins;
