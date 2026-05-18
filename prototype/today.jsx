// Today view – overdue + today rows
const AtlToday = ({ S, dispatch, openCard }) => {
  const T = window.__atlT; const t = T.theme;

  // Dynamic date
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const weekDayRu = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'][now.getDay()];
  // ISO week number
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now - jan1) / 864e5 + (jan1.getDay() || 7)) / 7);

  const overdue = Object.values(S.cards)
    .filter(c => c.overdue && !c.done)
    .map(c => ({ ...c, days: 1 }));
  const todayList = Object.values(S.cards)
    .filter(c => c.due && !c.overdue && !c.done &&
      (c.current || c.priority === 2 || c.due === "9 мая" || ["s1","h2"].includes(c.id)))
    .slice(0, 4);

  const colMeta = (c) => {
    const board = S.boards.find(b => b.id === c.board);
    const col = S.boardColumns[c.board].find(cc => cc.id === c.columnId);
    return { boardName: board?.name, colName: col?.name, colColor: col?.color };
  };

  const doneCount = Object.values(S.cards).filter(c => c.done).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
      <div style={{ background: t.ink, color: t.paper,
        padding: "26px 32px", display: "flex", alignItems: "stretch",
        borderBottom: `4px solid ${t.accent}`, flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <Label color={t.ink4}>{weekDayRu}, {weekNum}-я неделя</Label>
          <div style={{ fontFamily: T.fonts.display, fontSize: 110, fontWeight: 800,
            lineHeight: 0.85, letterSpacing: "-.02em", marginTop: 6, color: t.paper }}>
            {dd}<span style={{ color: t.accent }}>.{mm}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, alignSelf: "flex-end" }}>
          <HeroStat label="Просрочено" value={String(overdue.length).padStart(2,"0")} color={t.accent}/>
          <HeroStat label="Сегодня"    value={String(todayList.length).padStart(2,"0")} color={t.yellow}/>
          <HeroStat label="Завершено"  value={String(doneCount).padStart(2,"0")} color={t.paper}/>
        </div>
      </div>

      <div style={{ flex: 1, padding: "22px 32px", overflow: "auto" }}>
        <SectionHead title="Просрочено" count={overdue.length} accent={t.accent}/>
        {overdue.length === 0 && <Empty>Просрочек нет — образцовая дисциплина.</Empty>}
        {overdue.map((c, i) => (
          <TodayRow key={c.id} c={c} idx={i + 1} overdue meta={colMeta(c)}
            onClick={() => openCard(c.id)}
            onCheck={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_DONE", cardId: c.id }); }}/>
        ))}

        <div style={{ height: 22 }}/>

        <SectionHead title="Сегодня" count={todayList.length}/>
        {todayList.length === 0 && <Empty>На сегодня план пуст.</Empty>}
        {todayList.map((c, i) => (
          <TodayRow key={c.id} c={c} idx={i + 1} meta={colMeta(c)}
            onClick={() => openCard(c.id)}
            onCheck={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_DONE", cardId: c.id }); }}/>
        ))}
      </div>
    </div>
  );
};

const SectionHead = ({ title, count, accent }) => {
  const T = window.__atlT; const t = T.theme;
  const c = accent || t.ink;
  return (
    <div style={{ display: "flex", alignItems: "baseline", marginBottom: 12, gap: 12 }}>
      <span style={{ fontFamily: T.fonts.display, fontSize: 26, fontWeight: 800,
        color: c, textTransform: "uppercase", letterSpacing: ".005em" }}>{title}</span>
      <span style={{ flex: 1, height: 2, background: c }}/>
      <Num size={26} color={c}>{String(count).padStart(2,"0")}</Num>
    </div>
  );
};

const HeroStat = ({ label, value, color }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div style={{ padding: "0 18px", borderLeft: `1px solid ${t.ink2}`, alignSelf: "flex-end" }}>
      <Label color={t.ink4}>{label}</Label>
      <div style={{ fontFamily: T.fonts.display, fontSize: 56, fontWeight: 800,
        color, lineHeight: 1, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );
};

const TodayRow = ({ c, idx, overdue, meta, onClick, onCheck }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 16,
      padding: "10px 0", borderBottom: `1px solid ${t.rule2}`, cursor: "pointer" }}>
      <Num size={11} color={t.ink4} weight={400}>{String(idx).padStart(2,"0")}</Num>
      <span onClick={onCheck} style={{ width: 18, height: 18,
        border: `1.5px solid ${overdue ? t.accent : t.ink}`,
        cursor: "pointer", flexShrink: 0 }}/>
      <span style={{ fontSize: 14.5, color: t.ink, flex: 1, lineHeight: 1.25, fontFamily: T.fonts.body }}>
        {c.title}
      </span>
      <span style={{ fontFamily: T.fonts.body, fontSize: 10, fontWeight: 700,
        color: T.theme.mode === "dark" ? "#0F0F0E" : t.paper,
        background: meta.colColor, padding: "3px 8px",
        textTransform: "uppercase", letterSpacing: ".1em" }}>
        {meta.boardName}/{meta.colName}
      </span>
      <Num size={14} color={overdue ? t.accent : t.ink}>
        {overdue ? `−${c.days || 1} дн` : (c.due || "сегодня")}
      </Num>
    </div>
  );
};

const Empty = ({ children }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div style={{ padding: "16px 0", color: t.ink3, fontFamily: T.fonts.body,
      fontSize: 13, borderBottom: `1px solid ${t.rule2}`, fontStyle: "italic" }}>
      {children}
    </div>
  );
};

window.AtlToday = AtlToday;
