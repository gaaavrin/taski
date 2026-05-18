// Sprint view – production schedule + 3 columns + backlog rail
const AtlSprint = ({ S, dispatch }) => {
  const T = window.__atlT; const t = T.theme;
  const sp = S.sprint;
  const [drag, setDrag] = React.useState(null);

  // Dynamic sprint week (Mon–Sun of current week)
  const now = new Date();
  const dow = now.getDay() === 0 ? 7 : now.getDay(); // 1=Mon…7=Sun
  const monday = new Date(now); monday.setDate(now.getDate() - (dow - 1)); monday.setHours(0,0,0,0);
  const todayIdx = dow - 1; // 0=Mon…6=Sun
  const daysLeft = 6 - todayIdx; // days remaining after today
  const MONTHS_RU = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
  const sprintRange = `${monday.getDate()} – ${sunday.getDate()} ${MONTHS_RU[monday.getMonth()]}`;
  const sprintDay = (i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; };

  const onDrop = (toCol) => (e) => {
    e.preventDefault();
    if (!drag) return;
    dispatch({ type: "SPRINT_PROMOTE", item: drag, toCol });
    setDrag(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
      <div style={{ background: t.paper, borderBottom: `2px solid ${t.ink}`,
        padding: "20px 24px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <Label color={t.ink3}>Спринт</Label>
          <span style={{ fontFamily: T.fonts.display, fontSize: 28, fontWeight: 800,
            color: t.ink, textTransform: "uppercase", letterSpacing: ".005em" }}>
            №14 «Релиз 1.7»
          </span>
          <Num size={14} color={t.ink3}>{sprintRange}</Num>
          <span style={{ flex: 1 }}/>
          <Num size={36} color={t.accent}>{daysLeft}</Num>
          <Label color={t.accent}>дн. осталось</Label>
        </div>
        <div style={{ marginTop: 14, display: "flex", border: `1px solid ${t.ink}` }}>
          {Array.from({ length: 7 }, (_, i) => {
            const d = sprintDay(i);
            const past = i < todayIdx, tod = i === todayIdx;
            return (
              <div key={i} style={{ flex: 1, padding: "8px 10px",
                borderRight: i < 6 ? `1px solid ${t.rule2}` : "none",
                background: tod ? t.accent : past ? t.ink : t.paper,
                color: tod ? t.paper : past ? t.paper : t.ink }}>
                <Num size={11} weight={400}
                  color={tod ? t.paper : past ? t.ink4 : t.ink3}>
                  {String(d.getDate()).padStart(2,"0")}.{String(d.getMonth()+1).padStart(2,"0")}
                </Num>
                <div style={{ fontFamily: T.fonts.display, fontSize: 22, fontWeight: 700,
                  color: tod ? t.paper : past ? t.paper : t.ink, lineHeight: 1, marginTop: 4 }}>
                  {["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВС"][i]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 2, padding: "18px 22px", display: "flex", gap: 16, overflow: "auto" }}>
          {sp.columns.map((col, i) => (
            <SprintCol key={col.id} col={col} idx={i + 1}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop(col.id)}
              isDropTarget={drag != null}/>
          ))}
        </div>
        <div style={{ flex: 1, padding: "18px 22px",
          background: t.ink, color: t.paper, overflow: "auto",
          display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: T.fonts.display, fontSize: 22, fontWeight: 800,
              color: t.paper, textTransform: "uppercase" }}>Бэклог</span>
            <Num size={14} color={t.ink4}>{String(sp.backlog.length).padStart(2,"0")}</Num>
          </div>
          <div style={{ height: 1, background: t.ink2, marginBottom: 4 }}/>
          {sp.backlog.map((it, i) => (
            <div key={it.id} draggable
              onDragStart={() => setDrag(it)} onDragEnd={() => setDrag(null)}
              style={{ display: "flex", alignItems: "center", gap: 10,
                padding: "8px 0", borderBottom: `1px solid ${t.ink2}`,
                cursor: "grab", opacity: drag && drag.id === it.id ? 0.4 : 1 }}>
              <Num size={10} color={t.ink4} weight={400}>{String(i + 1).padStart(2,"0")}</Num>
              <span style={{ width: 4, height: 14,
                background: ["#5C5A52", t.yellow, t.accent][it.priority] }}/>
              <span style={{ fontSize: 12.5, color: t.paper, flex: 1, lineHeight: 1.25,
                fontFamily: T.fonts.body }}>{it.title}</span>
              <span style={{ fontFamily: T.fonts.mono, fontSize: 10, color: t.ink4 }}>⇥</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SprintCol = ({ col, idx, onDragOver, onDrop, isDropTarget }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div onDragOver={onDragOver} onDrop={onDrop} style={{ flex: 1, display: "flex",
      flexDirection: "column", gap: 8,
      outline: isDropTarget ? `1.5px dashed ${t.accent}` : "none", outlineOffset: 6 }}>
      <div style={{ borderTop: `2px solid ${t.ink}`, padding: "8px 0 6px",
        display: "flex", alignItems: "baseline", gap: 8 }}>
        <Num size={11} color={t.ink3}>0{idx}</Num>
        <span style={{ fontFamily: T.fonts.display, fontSize: 16, fontWeight: 700,
          color: t.ink, textTransform: "uppercase" }}>{col.name}</span>
        <span style={{ flex: 1 }}/>
        <Num size={18}>{String(col.items.length).padStart(2,"0")}</Num>
      </div>
      {col.items.map((it, i) => <SprintItem key={it.id} item={it} idx={i + 1} done={col.id === "done"}/>)}
      {col.items.length === 0 && (
        <div style={{ padding: "20px 8px", textAlign: "center", color: t.ink4,
          border: `1px dashed ${t.rule2}`, fontFamily: T.fonts.body, fontSize: 11,
          textTransform: "uppercase", letterSpacing: ".12em" }}>перетащить из бэклога</div>
      )}
    </div>
  );
};

const SprintItem = ({ item, idx, done }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div style={{ background: t.paper, border: `1px solid ${t.ink}` }}>
      <div style={{ display: "flex", height: 18, borderBottom: `1px solid ${t.ink}` }}>
        <div style={{ width: 28,
          background: done ? t.green : ["#5C5A52", t.yellow, t.accent][item.priority || 0],
          color: done ? t.paper : t.ink, fontFamily: T.fonts.bold,
          fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center" }}>
          {String(idx).padStart(2,"0")}
        </div>
        <div style={{ flex: 1, padding: "0 8px", display: "flex", alignItems: "center", gap: 8 }}>
          {!done && item.priority != null && (
            <Label color={t.ink3} size={9}>
              {["низкий","средний","ВЫСОКИЙ"][item.priority]}
            </Label>
          )}
          {item.progress != null && (
            <span style={{ flex: 1, height: 4, background: T.theme.mode === "dark" ? "#33332D" : "#0001",
              position: "relative" }}>
              <span style={{ position: "absolute", inset: 0,
                width: `${item.progress * 100}%`, background: t.accent }}/>
            </span>
          )}
          {item.progress != null && <Num size={10}>{Math.round(item.progress * 100)}%</Num>}
          {done && <Label color={t.green} size={9}>✓ готово</Label>}
        </div>
      </div>
      <div style={{ padding: "7px 9px", fontFamily: T.fonts.bold,
        fontSize: 12.5, fontWeight: 500, color: done ? t.ink3 : t.ink,
        textDecoration: done ? "line-through" : "none", lineHeight: 1.25 }}>
        {item.title}
      </div>
    </div>
  );
};

window.AtlSprint = AtlSprint;
