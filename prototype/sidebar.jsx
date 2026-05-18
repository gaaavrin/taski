// Sidebar – навигация по горизонтам
const AtlSidebar = ({ view, setView, S, openMenuBar, dispatch }) => {
  const T = window.__atlT;
  const t = T.theme;

  const cards = Object.values(S.cards || {});
  const total = cards.filter(c => !c.done).length;

  return (
    <aside className="titlebar-drag" style={{
      width: 220, background: t.ink, color: t.paper,
      display: "flex", flexDirection: "column", flexShrink: 0,
      fontFamily: T.fonts.body, position: "relative",
    }}>
      <div style={{ height: 28 }}/>

      {/* Логотип */}
      <div style={{ padding: "6px 18px 14px", borderBottom: `1px solid ${t.ink2}` }}>
        <div style={{ fontFamily: T.fonts.display, fontSize: 26, fontWeight: 800,
          letterSpacing: ".01em", lineHeight: 1, color: t.paper,
          textTransform: "uppercase" }}>TASKI</div>
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <span style={{ width: 16, height: 4, background: t.accent }}/>
          <span style={{ width: 16, height: 4, background: t.yellow }}/>
          <span style={{ width: 16, height: 4, background: t.blue }}/>
        </div>
      </div>

      <div style={{ padding: "12px 18px 4px" }}>
        <Label color={t.ink4}>Задачи</Label>
      </div>

      <SRow icon="today"   label="Сегодня" active={view==="day"}     onClick={()=>setView("day")}/>
      <SRow icon="boards"  label="Бэклог"  active={view==="backlog"} onClick={()=>setView("backlog")}/>

      <div style={{ padding: "14px 18px 4px" }}>
        <Label color={t.ink4}>Календарь</Label>
      </div>

      <SRow icon="sprint"  label="Неделя"  active={view==="week"}   onClick={()=>setView("week")}/>
      <SRow icon="boards"  label="Месяц"   active={view==="month"}  onClick={()=>setView("month")}/>
      <SRow icon="archive" label="Год"     active={view==="year"}   onClick={()=>setView("year")}/>

      <div style={{ flex: 1 }}/>

      {/* Привычки */}
      <div style={{ padding: "8px 14px 4px", borderTop: `1px solid ${t.ink2}` }}>
        <button onClick={() => setView("habits")}
          style={{
            width: "100%",
            border: `1px solid ${view === "habits" ? t.blue : "rgba(27,60,255,.3)"}`,
            color: t.blue,
            background: view === "habits" ? "rgba(27,60,255,.08)" : "transparent",
            padding: "7px 8px", fontFamily: T.fonts.body, fontWeight: 700,
            fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em",
            cursor: "pointer", borderRadius: 0,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 7 l2.5 2.5 L11 3"/>
          </svg>
          Привычки
        </button>
      </div>

      {/* Тренировки */}
      <div style={{ padding: "8px 14px 4px", borderTop: `1px solid ${t.ink2}` }}>
        <button onClick={() => setView("training")}
          style={{
            width: "100%",
            border: `1px solid ${view === "training" ? t.accent : "rgba(255,72,20,.3)"}`,
            color: t.accent,
            background: view === "training" ? "rgba(255,72,20,.08)" : "transparent",
            padding: "7px 8px", fontFamily: T.fonts.body, fontWeight: 700,
            fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em",
            cursor: "pointer", borderRadius: 0,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <line x1="2" y1="10" x2="4" y2="6"/>
            <line x1="4" y1="6"  x2="7" y2="8"/>
            <line x1="7" y1="8"  x2="9" y2="3"/>
            <line x1="9" y1="3"  x2="11" y2="5"/>
          </svg>
          Тренировки
        </button>
      </div>

      {/* Монетки */}
      <div style={{ padding: "4px 14px", borderTop: `1px solid ${t.ink2}` }}>
        <button onClick={() => setView("coins")}
          style={{
            width: "100%",
            border: `1px solid ${view === "coins" ? t.yellow : "rgba(245,197,24,.35)"}`,
            color: t.yellow,
            background: view === "coins" ? "rgba(245,197,24,.08)" : "transparent",
            padding: "7px 8px", fontFamily: T.fonts.body, fontWeight: 700,
            fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em",
            cursor: "pointer", borderRadius: 0,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
            <text x="6.5" y="10" textAnchor="middle" fontSize="7" fontWeight="700"
              fill="currentColor" fontFamily="system-ui">₽</text>
          </svg>
          Монетки
        </button>
      </div>

      {/* Настройки */}
      <div style={{ padding: "8px 14px", borderTop: `1px solid ${t.ink2}`, display: "flex", gap: 6 }}>
        <button onClick={() => window.__openSettings?.(true)} title="Настройки" style={{
          flex: 1, background: "transparent", border: `1px solid ${t.ink2}`, color: t.paper,
          padding: "6px 8px", fontFamily: T.fonts.body, fontWeight: 700, fontSize: 9.5,
          textTransform: "uppercase", letterSpacing: ".12em", cursor: "pointer", borderRadius: 0,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <Icon name="settings" size={11} color={t.ink4}/> настройки
        </button>
      </div>

      {/* Статистика */}
      <div style={{ padding: "10px 18px", borderTop: `1px solid ${t.ink2}`,
        display: "flex", alignItems: "baseline", gap: 8 }}>
        <Num color={t.paper} size={24}>{total}</Num>
        <Label color={t.ink4} size={9}>активных задач</Label>
      </div>
    </aside>
  );
};

const SRow = ({ icon, label, badge, active, onClick }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "8px 18px", color: t.paper,
      background: active ? t.ink2 : "transparent",
      borderLeft: active ? `3px solid ${t.accent}` : "3px solid transparent",
      paddingLeft: active ? 15 : 18, cursor: "pointer",
    }}>
      <Icon name={icon} size={13} color={active ? t.paper : t.ink4}/>
      <span style={{ flex: 1, fontFamily: T.fonts.body, fontSize: 13,
        fontWeight: active ? 700 : 400 }}>{label}</span>
      {badge && (
        <span style={{ fontFamily: T.fonts.bold, fontWeight: 700, fontSize: 10,
          color: t.ink, background: t.paper, padding: "1px 5px", minWidth: 16,
          textAlign: "center" }}>{badge}</span>
      )}
    </div>
  );
};

window.AtlSidebar = AtlSidebar;
