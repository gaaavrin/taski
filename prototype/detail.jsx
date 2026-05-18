// Card detail – slide-in panel with edit / delete / calendar

// ── Calendar helpers ─────────────────────────────────────────────────────────
const MONTHS_NOM = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня',
                    'июля','августа','сентября','октября','ноября','декабря'];
const DAYS_SHORT  = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];

const parseDue = (str) => {
  if (!str) return null;
  const [dayStr, monthStr] = (str || '').trim().split(' ');
  const d = parseInt(dayStr);
  const m = MONTHS_GEN.indexOf(monthStr);
  if (!d || m < 0) return null;
  const now = new Date();
  // Assume current year, but if month is already past try next year
  let yr = now.getFullYear();
  if (m < now.getMonth()) yr++;
  return new Date(yr, m, d);
};

const formatDue = (date) => {
  if (!date) return null;
  return `${date.getDate()} ${MONTHS_GEN[date.getMonth()]}`;
};

// ── Calendar component ───────────────────────────────────────────────────────
const _DetailCal = ({ selected, onSelect, onClear }) => {
  const T = window.__atlT; const t = T.theme;
  const today = React.useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);

  const [view, setView] = React.useState(() => {
    const base = selected || today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const yr  = view.getFullYear();
  const mo  = view.getMonth();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const rawFirst    = new Date(yr, mo, 1).getDay();           // 0=Sun
  const firstOffset = rawFirst === 0 ? 6 : rawFirst - 1;     // Mon-first

  const cells = [];
  for (let i = 0; i < firstOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday    = (d) => d && yr === today.getFullYear() && mo === today.getMonth() && d === today.getDate();
  const isSelected = (d) => d && selected && yr === selected.getFullYear() && mo === selected.getMonth() && d === selected.getDate();
  const isPast     = (d) => d && new Date(yr, mo, d) < today;

  const nav = (delta) => setView(new Date(yr, mo + delta, 1));

  const navBtn = (label, onClick) => (
    <button onClick={onClick} style={{
      background: "transparent", border: 0, color: t.paper, cursor: "pointer",
      fontFamily: T.fonts.display, fontSize: 18, fontWeight: 700, lineHeight: 1,
      padding: "0 10px", opacity: 0.7,
    }}>{label}</button>
  );

  return (
    <div style={{ background: t.ink, border: `2px solid ${t.ink}`, userSelect: "none" }}
      onMouseDown={e => e.stopPropagation()}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 12px 8px",
        borderBottom: `1px solid rgba(255,255,255,.1)` }}>
        {navBtn("‹", () => nav(-1))}
        <span style={{ flex: 1, textAlign: "center", fontFamily: T.fonts.display,
          fontSize: 14, fontWeight: 700, color: t.paper, textTransform: "uppercase",
          letterSpacing: ".05em" }}>
          {MONTHS_NOM[mo]} {yr}
        </span>
        {navBtn("›", () => nav(1))}
      </div>

      {/* Day names */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        padding: "8px 10px 4px" }}>
        {DAYS_SHORT.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 9, fontWeight: 700,
            color: "rgba(255,255,255,.35)", fontFamily: T.fonts.body,
            letterSpacing: ".08em", padding: "2px 0" }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        gap: 2, padding: "0 10px 10px" }}>
        {cells.map((day, i) => {
          const sel  = isSelected(day);
          const tod  = isToday(day);
          const past = isPast(day);
          return (
            <div key={i} onClick={() => day && onSelect(new Date(yr, mo, day))}
              style={{
                textAlign: "center", fontSize: 12, fontFamily: T.fonts.bold,
                padding: "5px 2px", borderRadius: 0,
                cursor: day ? "pointer" : "default",
                fontWeight: sel || tod ? 700 : 400,
                background: sel ? t.accent : tod ? "rgba(255,255,255,.15)" : "transparent",
                color: sel ? t.paper : tod ? t.paper : past ? "rgba(255,255,255,.3)" : day ? "rgba(255,255,255,.85)" : "transparent",
              }}>
              {day || ""}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid rgba(255,255,255,.1)`,
        display: "flex", gap: 0 }}>
        <button onClick={onClear} style={{
          flex: 1, background: "transparent", color: "rgba(255,255,255,.4)",
          border: 0, padding: "8px 0", fontFamily: T.fonts.body, fontWeight: 700,
          fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".1em", cursor: "pointer",
        }}>Без дедлайна</button>
        <button onClick={() => onSelect(today)} style={{
          flex: 1, background: "transparent", color: t.accent,
          border: 0, borderLeft: `1px solid rgba(255,255,255,.1)`,
          padding: "8px 0", fontFamily: T.fonts.body, fontWeight: 700,
          fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".1em", cursor: "pointer",
        }}>Сегодня</button>
      </div>
    </div>
  );
};

// ── Card detail panel ────────────────────────────────────────────────────────
const AtlDetail = ({ S, dispatch, cardId, onClose, autoEdit = false }) => {
  const T = window.__atlT; const t = T.theme;
  const card = S.cards[cardId];
  const [editMode,  setEditMode]  = React.useState(autoEdit);
  const [deleteStep, setDeleteStep] = React.useState(0);
  const [calOpen,   setCalOpen]   = React.useState(false);
  const [newItem,   setNewItem]   = React.useState("");
  const deleteTimer = React.useRef(null);

  if (!card) return null;
  const HORIZON_LABEL = { day: "День", week: "Неделя", month: "Месяц", year: "Год" };
  const horizonLabel  = HORIZON_LABEL[card.horizon] || card.horizon || "—";

  const rich      = (cardId === S.detail?.id) ? S.detail : null;
  const checklist = card.checklistItems ||
    rich?.checklist ||
    (card.checklist ? Array.from({ length: card.checklist[1] }, (_, i) => ({
      t: `Шаг ${i + 1}`, done: i < card.checklist[0],
    })) : []);
  const notes     = rich?.notes || "—";
  const cdone     = checklist.filter(x => x.done).length;
  const ctotal    = checklist.length || 1;

  const patch = (p) => dispatch({ type: "UPDATE_CARD", cardId, patch: p });

  const handleDelete = () => {
    if (deleteStep === 1) {
      clearTimeout(deleteTimer.current);
      dispatch({ type: "DELETE_CARD", cardId });
      onClose();
    } else {
      setDeleteStep(1);
      deleteTimer.current = setTimeout(() => setDeleteStep(0), 3000);
    }
  };

  const selectDate = (date) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const iso = date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0');
    patch({ due: formatDue(date), date: iso, overdue: date < today });
    setCalOpen(false);
  };

  const clearDate = () => { patch({ due: null, date: null, overdue: false }); setCalOpen(false); };

  // Close calendar on outside click
  React.useEffect(() => {
    if (!calOpen) return;
    const handler = () => setCalOpen(false);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [calOpen]);

  const PRIO_LABELS = ["низкий", "средний", "высокий"];
  const PRIO_DOT    = ["#2CB67D", "#F5C518", "#E53E3E"];

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0,
      background: "rgba(14,14,12,.34)", zIndex: 30, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 540, background: t.paper,
        borderLeft: `2px solid ${t.ink}`, display: "flex", flexDirection: "column",
        overflow: "hidden", boxShadow: "-12px 0 0 rgba(0,0,0,.05)",
        animation: "atlSlideIn .22s cubic-bezier(.2,.7,.2,1)" }}>

        {/* ── Top bar ── */}
        <div style={{ background: t.ink, color: t.paper, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${t.ink2}`,
          flexWrap: "wrap" }}>
          <Num color={t.paper} size={11}>#{card.id.toUpperCase()}</Num>
          <Label color={t.ink4}>{horizonLabel}</Label>
          <span style={{ flex: 1 }}/>
          <button onClick={() => { setEditMode(e => !e); setCalOpen(false); }} style={{
            background: editMode ? t.accent : "transparent", color: t.paper,
            border: `1px solid ${editMode ? t.accent : "rgba(255,255,255,.3)"}`,
            padding: "3px 10px", fontFamily: T.fonts.body, fontWeight: 700, fontSize: 9.5,
            textTransform: "uppercase", letterSpacing: ".12em", cursor: "pointer",
          }}>{editMode ? "✓ сохранить" : "✏ редактировать"}</button>
          <button onClick={() => patch({ done: !card.done, overdue: card.done ? card.overdue : false })}
            style={{ background: card.done ? t.green : "transparent", color: t.paper,
              border: `1px solid ${t.paper}`, padding: "3px 10px",
              fontFamily: T.fonts.body, fontWeight: 700, fontSize: 9.5,
              textTransform: "uppercase", letterSpacing: ".12em", cursor: "pointer" }}>
            {card.done ? "✓ выполнено" : "выполнить"}
          </button>
          <button onClick={onClose} style={{ background: "transparent",
            border: `1px solid ${t.paper}`, color: t.paper,
            width: 26, height: 26, padding: 0, cursor: "pointer",
            display: "grid", placeItems: "center" }}>
            <Icon name="x" size={12} color={t.paper}/>
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "20px 24px 24px", overflow: "auto", flex: 1 }}>

          {/* Title */}
          <input value={card.title}
            onChange={(e) => patch({ title: e.target.value })}
            readOnly={!editMode}
            style={{ width: "100%", boxSizing: "border-box",
              fontFamily: T.fonts.display, fontSize: 32, fontWeight: 700,
              lineHeight: 1.06, color: t.ink, letterSpacing: "-.005em",
              border: 0, outline: "none", background: "transparent",
              padding: "4px 0 8px", marginBottom: 6,
              borderBottom: editMode ? `1px solid ${t.rule2}` : "1px solid transparent",
              cursor: editMode ? "text" : "default" }}/>

          {/* Tags */}
          {/* Теги */}
          {editMode ? (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {Object.entries(S.tags || {}).map(([key, tag]) => {
                const tid = tag.id || key;
                const active = (card.tags || []).includes(tid);
                return (
                  <span key={tid}
                    onClick={() => {
                      const cur = card.tags || [];
                      patch({ tags: active ? cur.filter(t => t !== tid) : [...cur, tid] });
                    }}
                    style={{ fontFamily: T.fonts.body, fontWeight: 700, fontSize: 10,
                      color: active ? t.paper : tag.color,
                      background: active ? tag.color : "transparent",
                      border: `1.5px solid ${tag.color}`,
                      padding: "3px 10px", cursor: "pointer",
                      textTransform: "uppercase", letterSpacing: ".1em",
                      transition: "all .12s" }}>
                    {tag.name}
                  </span>
                );
              })}
            </div>
          ) : (
            card.tags?.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
                {card.tags.map(tk => S.tags[tk] && <ATag key={tk} tag={S.tags[tk]}/>)}
              </div>
            )
          )}

          {/* Stats grid */}
          <div style={{ position: "relative", marginBottom: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              border: `1px solid ${t.ink}` }}>

              {/* Дата */}
              <div style={{ padding: "10px 12px", borderRight: `1px solid ${t.ink}`,
                position: "relative" }}>
                <Label>Дата</Label>
                {editMode ? (
                  <div onClick={(e) => { e.stopPropagation(); setCalOpen(o => !o); }}
                    style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4,
                      cursor: "pointer" }}>
                    <Num size={13} color={card.overdue ? t.accent : t.ink}>
                      {card.due || "выбрать"}
                    </Num>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                      stroke={card.due ? (card.overdue ? t.accent : t.ink3) : t.ink3}
                      strokeWidth="1.2" strokeLinecap="round">
                      <rect x="1" y="2" width="8" height="7" rx="0"/>
                      <line x1="1" y1="4.5" x2="9" y2="4.5"/>
                      <line x1="3.5" y1="1" x2="3.5" y2="3"/>
                      <line x1="6.5" y1="1" x2="6.5" y2="3"/>
                    </svg>
                  </div>
                ) : (
                  <div><Num size={14} color={card.overdue ? t.accent : t.ink}>
                    {card.due || "не задан"}
                  </Num></div>
                )}
              </div>

              {/* Приоритет */}
              <div style={{ padding: "10px 12px", borderRight: `1px solid ${t.ink}` }}>
                <Label>Приоритет</Label>
                {editMode
                  ? <div style={{ display: "flex", gap: 8, marginTop: 7, alignItems: "center" }}>
                      {[0,1,2].map(p => (
                        <span key={p} onClick={() => patch({ priority: p })}
                          title={PRIO_LABELS[p]}
                          style={{ width: 14, height: 14, borderRadius: "50%", cursor: "pointer",
                            background: PRIO_DOT[p], flexShrink: 0,
                            outline: card.priority === p ? `2px solid ${t.ink}` : "2px solid transparent",
                            outlineOffset: 2, transition: "outline .1s" }}/>
                      ))}
                    </div>
                  : <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 4 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%",
                        background: PRIO_DOT[card.priority || 0], flexShrink: 0 }}/>
                      <Num size={13}>{PRIO_LABELS[card.priority || 0]}</Num>
                    </div>
                }
              </div>

              {/* Чек-лист счётчик */}
              <div style={{ padding: "10px 12px" }}>
                <Label>Чек-лист</Label>
                <div><Num size={14}>{cdone}/{checklist.length || 0}</Num></div>
              </div>
            </div>

            {/* Calendar dropdown */}
            {calOpen && editMode && (
              <div style={{ position: "absolute", top: "100%", left: 0,
                width: "66%", zIndex: 50, marginTop: 2 }}
                onMouseDown={e => e.stopPropagation()}>
                <_DetailCal
                  selected={parseDue(card.due)}
                  onSelect={selectDate}
                  onClear={clearDate}
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <DSectionHead label="Заметки"/>
          <textarea
            value={card.notesText || notes}
            onChange={(e) => patch({ notesText: e.target.value })}
            readOnly={!editMode}
            style={{ width: "100%", boxSizing: "border-box", minHeight: 90,
              fontFamily: T.fonts.body, fontSize: 13.5, lineHeight: 1.55,
              color: t.ink2, background: editMode ? t.paper2 : "transparent",
              border: editMode ? `1px solid ${t.rule2}` : "none",
              padding: editMode ? "10px 12px" : "0",
              outline: "none", resize: editMode ? "vertical" : "none",
              marginBottom: 22, borderRadius: 0,
              cursor: editMode ? "text" : "default" }}/>

          {/* Checklist */}
          <DSectionHead label="Чек-лист" right={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {card.weeklyReset && (
                <span style={{ fontFamily: T.fonts.body, fontWeight: 700, fontSize: 9,
                  color: t.blue, textTransform: "uppercase", letterSpacing: ".1em",
                  border: `1px solid ${t.blue}`, padding: "1px 6px" }}>↻ пн</span>
              )}
              <Num size={11} color={t.accent}>{cdone} / {ctotal}</Num>
            </div>
          }/>
          <div style={{ background: T.theme.mode === "dark" ? "#33332D" : "#0001", height: 6, marginBottom: 12 }}>
            <div style={{ width: `${(cdone / ctotal) * 100}%`, height: "100%", background: t.accent }}/>
          </div>
          {checklist.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0",
              borderBottom: `1px solid ${t.rule2}` }}>
              <Num size={11} color={t.ink4} weight={400}>{String(i+1).padStart(2,"0")}</Num>
              <span onClick={() => dispatch({ type: "TOGGLE_CHECKLIST", cardId, idx: i })}
                style={{ width: 14, height: 14,
                  border: `1.5px solid ${it.done ? t.accent : t.ink}`,
                  background: it.done ? t.accent : "transparent",
                  color: T.theme.mode === "dark" ? "#0F0F0E" : t.paper,
                  display: "grid", placeItems: "center", fontSize: 9, flexShrink: 0, cursor: "pointer" }}>
                {it.done ? "✓" : ""}
              </span>
              <span onClick={() => dispatch({ type: "TOGGLE_CHECKLIST", cardId, idx: i })}
                style={{ fontSize: 13.5, color: it.done ? t.ink3 : t.ink, flex: 1,
                  textDecoration: it.done ? "line-through" : "none",
                  fontFamily: T.fonts.body, cursor: "pointer" }}>{it.t}</span>
              {editMode && card.checklistItems && (
                <span onClick={() => dispatch({ type: "REMOVE_CHECKLIST_ITEM", cardId, idx: i })}
                  style={{ color: t.ink4, cursor: "pointer", fontSize: 14, lineHeight: 1,
                    padding: "0 2px", flexShrink: 0 }}>×</span>
              )}
            </div>
          ))}
          {editMode && (
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <input value={newItem} onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && newItem.trim()) {
                    dispatch({ type: "ADD_CHECKLIST_ITEM", cardId, text: newItem.trim() });
                    setNewItem("");
                  }
                }}
                placeholder="Добавить пункт…"
                style={{ flex: 1, background: t.paper2, border: `1px solid ${t.rule2}`,
                  color: t.ink, fontFamily: T.fonts.body, fontSize: 12,
                  padding: "5px 8px", outline: "none", borderRadius: 0 }}/>
              <button onClick={() => {
                if (newItem.trim()) {
                  dispatch({ type: "ADD_CHECKLIST_ITEM", cardId, text: newItem.trim() });
                  setNewItem("");
                }
              }} style={{ background: t.ink, color: t.paper, border: 0, padding: "5px 12px",
                fontFamily: T.fonts.body, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>+</button>
            </div>
          )}
          {editMode && (
            <div onClick={() => dispatch({ type: "SET_WEEKLY_RESET", cardId, value: !card.weeklyReset })}
              style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10,
                cursor: "pointer", userSelect: "none" }}>
              <span style={{ width: 14, height: 14, flexShrink: 0,
                border: `1.5px solid ${card.weeklyReset ? t.blue : t.ink3}`,
                background: card.weeklyReset ? t.blue : "transparent",
                display: "grid", placeItems: "center", fontSize: 9,
                color: t.paper }}>
                {card.weeklyReset ? "✓" : ""}
              </span>
              <span style={{ fontFamily: T.fonts.body, fontSize: 12, color: card.weeklyReset ? t.blue : t.ink3 }}>
                сбрасывать каждый понедельник
              </span>
            </div>
          )}

          <div style={{ height: 20 }}/>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={handleDelete} style={{
              background: deleteStep === 1 ? "rgba(201,100,66,.12)" : "transparent",
              color: deleteStep === 1 ? t.accent : t.ink3,
              border: `1px solid ${deleteStep === 1 ? t.accent : t.rule2}`,
              padding: "6px 12px", fontFamily: T.fonts.body, fontWeight: 700,
              fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em",
              cursor: "pointer", borderRadius: 0, transition: "all .15s",
            }}>{deleteStep === 1 ? "⚠ подтвердить удаление" : "удалить"}</button>
            <span style={{ flex: 1 }}/>
            <ABtn primary onClick={onClose}>готово</ABtn>
          </div>
        </div>
      </div>
    </div>
  );
};

const DStat = ({ label, value, accent }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div style={{ padding: "10px 12px", borderRight: `1px solid ${t.ink}` }}>
      <Label>{label}</Label>
      <div><Num size={14} color={accent || t.ink}>{value}</Num></div>
    </div>
  );
};

const DSectionHead = ({ label, right }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div style={{ display: "flex", alignItems: "baseline", marginBottom: 8, gap: 8 }}>
      <Label>{label}</Label>
      {right}
      <span style={{ flex: 1, height: 1, background: t.rule2 }}/>
    </div>
  );
};

window.AtlDetail = AtlDetail;
