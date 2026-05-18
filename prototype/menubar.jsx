// Меню-бар – быстрое добавление задачи
const AtlMenuBar = ({ S, dispatch, onClose, openCard }) => {
  const T = window.__atlT; const t = T.theme;
  const [text, setText] = React.useState("");
  const [horizon, setHorizon] = React.useState(
    ["day","week","month","year"].includes(S.view) ? S.view : "day"
  );

  const overdue = Object.values(S.cards).filter(c => c.overdue && !c.done).slice(0, 3);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: "QUICK_ADD", title: text.trim(), horizon });
    setText("");
    onClose();
  };

  const HORIZONS = [
    { id: "day",   label: "День" },
    { id: "week",  label: "Неделя" },
    { id: "month", label: "Месяц" },
    { id: "year",  label: "Год" },
  ];

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 40,
      background: "rgba(14,14,12,.18)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "absolute", top: 16, right: 18, width: 340,
        background: t.paper, color: t.ink, border: `2px solid ${t.ink}`,
        boxShadow: "8px 8px 0 rgba(0,0,0,.18)",
        display: "flex", flexDirection: "column",
        animation: "atlPop .18s cubic-bezier(.2,.7,.2,1)" }}>

        <div style={{ background: t.ink, color: t.paper, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: T.fonts.display, fontSize: 16, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: ".05em" }}>TASKI</span>
          <span style={{ flex: 1 }}/>
          <span onClick={onClose} style={{ cursor: "pointer", display: "flex" }}>
            <Icon name="x" size={12} color={t.paper}/>
          </span>
        </div>

        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Горизонт */}
          <div style={{ display: "flex", gap: 4 }}>
            {HORIZONS.map(h => (
              <button key={h.id} onClick={() => setHorizon(h.id)} style={{
                flex: 1, background: horizon === h.id ? t.ink : "transparent",
                color: horizon === h.id ? t.paper : t.ink3,
                border: `1px solid ${horizon === h.id ? t.ink : t.rule2}`,
                padding: "4px 0", fontFamily: T.fonts.body, fontWeight: 700,
                fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em",
                cursor: "pointer",
              }}>{h.label}</button>
            ))}
          </div>

          {/* Ввод задачи */}
          <form onSubmit={submit} style={{ border: `1.5px solid ${t.ink}`, padding: "8px 10px",
            display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 18, height: 18, background: t.accent,
              color: t.paper, display: "grid", placeItems: "center",
              fontFamily: T.fonts.bold, fontSize: 12, fontWeight: 800 }}>＋</span>
            <input value={text} onChange={(e) => setText(e.target.value)}
              placeholder="новая задача…" autoFocus
              style={{ background: "transparent", border: 0, outline: "none", flex: 1,
                fontFamily: T.fonts.body, fontSize: 13, color: t.ink }}/>
            <Num color={t.ink3} size={11}>↵</Num>
          </form>

          {/* Просроченные */}
          {overdue.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
                <span style={{ width: 12, height: 4, background: t.accent }}/>
                <Label color={t.accent}>Просрочено</Label>
                <span style={{ flex: 1, height: 1, background: t.rule2 }}/>
              </div>
              {overdue.map(c => (
                <div key={c.id} onClick={() => { onClose(); openCard(c.id); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <span style={{ width: 4, height: 16, background: t.accent, flexShrink: 0 }}/>
                  <span style={{ fontSize: 12.5, color: t.ink, flex: 1,
                    fontFamily: T.fonts.body }}>{c.title}</span>
                  <Num color={t.accent} size={11}>{c.due || "просрочено"}</Num>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ padding: "10px 14px", borderTop: `1px solid ${t.rule2}`,
          background: t.paper2, display: "flex", alignItems: "center",
          justifyContent: "space-between" }}>
          <Label>Открыть Taski</Label>
          <Num color={t.ink3} size={11} weight={400}>⌘K</Num>
        </div>
      </div>
    </div>
  );
};

window.AtlMenuBar = AtlMenuBar;
