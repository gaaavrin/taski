// Tasks – основной вид: список задач по горизонту
const PRIO_DOT   = ["#2CB67D", "#F5C518", "#E53E3E"];
const PRIO_LABEL = ["низкий", "средний", "высокий"];
const HORIZON_LABEL = { day: "Сегодня", week: "Неделя", month: "Месяц", year: "Год", backlog: "Бэклог" };
const _MON_GEN = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const _todayLabel = () => { const d = new Date(); return d.getDate() + ' ' + _MON_GEN[d.getMonth()]; };

// ── Одна строка задачи ───────────────────────────────────────────────────────
const TaskRow = ({ card, dispatch, openCard, tags }) => {
  const T = window.__atlT; const t = T.theme;
  const compact = T.density === "compact";

  const toggleDone = (e) => {
    e.stopPropagation();
    dispatch({ type: "TOGGLE_DONE", cardId: card.id });
  };

  return (
    <div onClick={() => openCard(card.id)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: compact ? "8px 20px" : "11px 20px",
        borderBottom: `1px solid ${t.rule2}`,
        cursor: "pointer", background: "transparent",
        opacity: card.done ? 0.55 : 1,
        transition: "background .1s",
      }}
      onMouseEnter={e => e.currentTarget.style.background = t.paper2}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

      {/* Чекбокс */}
      <span onClick={toggleDone} style={{
        width: 17, height: 17, flexShrink: 0,
        border: `1.5px solid ${card.done ? t.accent : t.ink3}`,
        background: card.done ? t.accent : "transparent",
        display: "grid", placeItems: "center",
        fontSize: 10, color: t.paper, cursor: "pointer",
      }}>
        {card.done ? "✓" : ""}
      </span>

      {/* Приоритет */}
      {(card.priority > 0) && (
        <span style={{
          width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
          background: PRIO_DOT[card.priority || 0],
        }}/>
      )}

      {/* Заголовок */}
      <span style={{
        flex: 1, fontFamily: T.fonts.body, fontSize: 13.5,
        color: card.done ? t.ink3 : t.ink,
        textDecoration: card.done ? "line-through" : "none",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{card.title}</span>

      {/* Чеклист индикатор */}
      {card.checklistItems?.length > 0 && (
        <span style={{ fontFamily: T.fonts.mono, fontSize: 10, color: t.ink4, flexShrink: 0 }}>
          {card.checklistItems.filter(x => x.done).length}/{card.checklistItems.length}
        </span>
      )}

      {/* Дедлайн */}
      {card.due && (
        <span style={{
          fontFamily: T.fonts.mono, fontSize: 10, flexShrink: 0,
          color: card.overdue ? t.accent : t.ink4, fontWeight: card.overdue ? 700 : 400,
        }}>{card.due}</span>
      )}

      {/* Тэги */}
      {card.tags?.map(tk => tags[tk] && (
        <ATag key={tk} tag={tags[tk]} small/>
      ))}
    </div>
  );
};

const TAG_COLORS = ["#FF4814","#1B3CFF","#F5C518","#2C6147","#7C5CFF","#E07A1F","#D7263D","#2A6FDB","#1F8A5B","#5C6470"];

// ── Главный компонент ────────────────────────────────────────────────────────
const AtlTasks = ({ S, dispatch, view, openCard }) => {
  const T = window.__atlT; const t = T.theme;
  const label      = HORIZON_LABEL[view] || view;
  const filterTags = S.filterTags || [];
  const allTags = Object.entries(S.tags || {}).map(([key, tag]) => ({ id: key, ...tag }));
  const [editingTags, setEditingTags] = React.useState(false);
  const [editTagId,   setEditTagId]   = React.useState(null);
  const [editName,    setEditName]    = React.useState("");
  const [editColor,   setEditColor]   = React.useState(TAG_COLORS[0]);
  const [addingTag,   setAddingTag]   = React.useState(false);
  const [newTagName,  setNewTagName]  = React.useState("");
  const [newTagColor, setNewTagColor] = React.useState(TAG_COLORS[0]);

  const startEditTag = (tag) => {
    setEditTagId(tag.id); setEditName(tag.name); setEditColor(tag.color);
  };
  const saveTag = () => {
    if (editName.trim()) dispatch({ type: "UPDATE_TAG", id: editTagId, patch: { name: editName.trim(), color: editColor } });
    setEditTagId(null);
  };
  const addTag = () => {
    if (newTagName.trim()) {
      dispatch({ type: "ADD_TAG", name: newTagName.trim(), color: newTagColor });
      setNewTagName(""); setAddingTag(false);
    }
  };

  const _todayStr = _todayLabel ? (()=>{ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); })() : "";

  // Фильтрация: сегодня = по дате, бэклог = без даты
  const allCards = Object.values(S.cards).filter(c => {
    if (view === "day")     { if (c.date !== _todayStr) return false; }
    else if (view === "backlog") { if (c.date) return false; }
    if (S.search && !c.title.toLowerCase().includes(S.search.toLowerCase())) return false;
    if (filterTags.length > 0 && !filterTags.some(tag => c.tags?.includes(tag))) return false;
    return true;
  });

  const undone = allCards.filter(c => !c.done)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0) || a.title.localeCompare(b.title));
  const done = allCards.filter(c => c.done);

  const addTask = () => dispatch({ type: "ADD_CARD", date: view === "day" ? _todayStr : undefined });

  // Подсчёт просроченных
  const overdueCount = undone.filter(c => c.overdue).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, minHeight: 0 }}>

      {/* ── Toolbar ── */}
      <div style={{ display: "flex", alignItems: "stretch", flexShrink: 0,
        background: t.paper, borderBottom: `2px solid ${t.ink}` }}>

        <div style={{ padding: "16px 22px", display: "flex", alignItems: "baseline", gap: 12,
          borderRight: `1px solid ${t.rule2}` }}>
          <span style={{ fontFamily: T.fonts.display, fontSize: 28, fontWeight: 800,
            color: t.ink, textTransform: "uppercase", letterSpacing: ".005em" }}>{label}</span>
          {view === "day" && (
            <span style={{ fontFamily: T.fonts.body, fontSize: 13, color: t.ink3, fontWeight: 400 }}>
              {_todayLabel()}
            </span>
          )}
          <span style={{ width: 8, height: 8, background: t.accent, flexShrink: 0 }}/>
        </div>

        {/* Счётчик */}
        <div style={{ padding: "12px 18px", borderRight: `1px solid ${t.rule2}`,
          display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Label color={t.ink4}>активных</Label>
          <Num size={20}>{undone.length}</Num>
        </div>

        {overdueCount > 0 && (
          <div style={{ padding: "12px 18px", borderRight: `1px solid ${t.rule2}`,
            display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Label color={t.accent}>просрочено</Label>
            <Num size={20} color={t.accent}>{overdueCount}</Num>
          </div>
        )}

        <span style={{ flex: 1 }}/>

        <div style={{ padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <SearchBox value={S.search}
            onChange={v => dispatch({ type: "SEARCH", value: v })}/>
          <ABtn primary onClick={addTask}>＋ задача</ABtn>
        </div>
      </div>

      {/* ── Фильтр по тэгам ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 20px",
        borderBottom: `1px solid ${t.rule2}`, flexWrap: "wrap", background: t.paper, flexShrink: 0 }}>

        <Label color={t.ink4} size={9}>фильтр</Label>

        {filterTags.length > 0 && (
          <button onClick={() => dispatch({ type: "CLEAR_FILTER_TAGS" })}
            style={{ fontFamily: T.fonts.body, fontSize: 10, fontWeight: 700,
              color: t.ink4, cursor: "pointer", padding: "2px 8px", background: "transparent",
              border: `1px solid ${t.rule2}`, textTransform: "uppercase", letterSpacing: ".1em" }}>
            сброс
          </button>
        )}

        {allTags.map(tag => {
          const active = filterTags.includes(tag.id);
          return (
            <button key={tag.id}
              onClick={() => dispatch({ type: "TOGGLE_FILTER_TAG", tag: tag.id })}
              style={{ fontFamily: T.fonts.body, fontWeight: 700, fontSize: 9.5,
                color: active ? t.paper : tag.color,
                background: active ? tag.color : "transparent",
                border: `1.5px solid ${tag.color}`,
                padding: "2px 8px", cursor: "pointer",
                textTransform: "uppercase", letterSpacing: ".1em" }}>
              {tag.name}
            </button>
          );
        })}

        {/* Кнопка управления тегами */}
        <button onClick={() => { setEditingTags(true); setEditTagId(null); setAddingTag(false); }}
          style={{ background: "transparent", border: `1px solid ${t.rule2}`, color: t.ink4,
            padding: "2px 8px", cursor: "pointer", fontFamily: T.fonts.body, fontWeight: 700,
            fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".1em" }}>
          ✏ теги
        </button>
      </div>

      {/* ── Попап управления тегами ── */}
      {editingTags && (
        <div onClick={() => { setEditingTags(false); setEditTagId(null); setAddingTag(false); }}
          style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(14,14,12,.25)" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ position: "absolute", top: 100, left: "50%", transform: "translateX(-50%)",
              width: 440, background: t.paper, border: `2px solid ${t.ink}`,
              boxShadow: "8px 8px 0 rgba(0,0,0,.15)", display: "flex", flexDirection: "column" }}>

            {/* Заголовок попапа */}
            <div style={{ background: t.ink, color: t.paper, padding: "10px 16px",
              display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: T.fonts.display, fontWeight: 800, fontSize: 16,
                textTransform: "uppercase", letterSpacing: ".04em", flex: 1 }}>Теги</span>
              <button onClick={() => { setEditingTags(false); setEditTagId(null); setAddingTag(false); }}
                style={{ background: "transparent", border: 0, color: t.paper, cursor: "pointer",
                  fontSize: 18, lineHeight: 1, padding: "0 4px" }}>×</button>
            </div>

            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
              {allTags.map(tag => (
                editTagId === tag.id ? (
                  /* Строка редактирования */
                  <div key={tag.id} style={{ display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 8px", background: t.paper2, border: `1px solid ${t.rule2}` }}>
                    <input autoFocus value={editName} onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveTag(); if (e.key === "Escape") setEditTagId(null); }}
                      style={{ flex: 1, background: "transparent", border: 0, outline: "none",
                        fontFamily: T.fonts.body, fontWeight: 700, fontSize: 12,
                        textTransform: "uppercase", letterSpacing: ".1em", color: t.ink }}/>
                    <div style={{ display: "flex", gap: 4 }}>
                      {TAG_COLORS.map(c => (
                        <button key={c} onClick={() => setEditColor(c)}
                          style={{ width: 16, height: 16, background: c, cursor: "pointer", border: "none",
                            outline: editColor === c ? `2px solid ${t.ink}` : "none", outlineOffset: 1 }}/>
                      ))}
                    </div>
                    <button onClick={saveTag}
                      style={{ background: t.accent, color: t.paper, border: 0, padding: "4px 10px",
                        fontFamily: T.fonts.body, fontWeight: 700, fontSize: 10, cursor: "pointer",
                        textTransform: "uppercase", letterSpacing: ".1em" }}>Сохранить</button>
                    <button onClick={() => setEditTagId(null)}
                      style={{ background: "transparent", border: `1px solid ${t.rule2}`, color: t.ink3,
                        padding: "4px 10px", fontFamily: T.fonts.body, fontWeight: 700, fontSize: 10,
                        cursor: "pointer" }}>Отмена</button>
                  </div>
                ) : (
                  /* Обычная строка тега */
                  <div key={tag.id} style={{ display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 8px" }}
                    onMouseEnter={e => e.currentTarget.style.background = t.paper2}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ width: 12, height: 12, background: tag.color, flexShrink: 0 }}/>
                    <span style={{ flex: 1, fontFamily: T.fonts.body, fontWeight: 700, fontSize: 12,
                      textTransform: "uppercase", letterSpacing: ".1em", color: t.ink }}>
                      {tag.name}
                    </span>
                    <button onClick={() => startEditTag(tag)}
                      style={{ background: "transparent", border: `1px solid ${t.rule2}`, color: t.ink3,
                        padding: "3px 10px", fontFamily: T.fonts.body, fontWeight: 700, fontSize: 10,
                        cursor: "pointer", textTransform: "uppercase", letterSpacing: ".08em" }}>
                      Изменить
                    </button>
                    <button onClick={() => dispatch({ type: "DELETE_TAG", id: tag.id })}
                      style={{ background: "transparent", border: `1px solid rgba(255,72,20,.4)`,
                        color: t.accent, padding: "3px 10px", fontFamily: T.fonts.body, fontWeight: 700,
                        fontSize: 10, cursor: "pointer", textTransform: "uppercase", letterSpacing: ".08em" }}>
                      Удалить
                    </button>
                  </div>
                )
              ))}

              {/* Добавить тег */}
              {addingTag ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 8px", background: t.paper2, border: `1px solid ${t.rule2}`, marginTop: 4 }}>
                  <input autoFocus value={newTagName} onChange={e => setNewTagName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") addTag(); if (e.key === "Escape") setAddingTag(false); }}
                    placeholder="Название тега"
                    style={{ flex: 1, background: "transparent", border: 0, outline: "none",
                      fontFamily: T.fonts.body, fontWeight: 700, fontSize: 12,
                      textTransform: "uppercase", letterSpacing: ".1em", color: t.ink }}/>
                  <div style={{ display: "flex", gap: 4 }}>
                    {TAG_COLORS.map(c => (
                      <button key={c} onClick={() => setNewTagColor(c)}
                        style={{ width: 16, height: 16, background: c, cursor: "pointer", border: "none",
                          outline: newTagColor === c ? `2px solid ${t.ink}` : "none", outlineOffset: 1 }}/>
                    ))}
                  </div>
                  <button onClick={addTag}
                    style={{ background: t.ink, color: t.paper, border: 0, padding: "4px 10px",
                      fontFamily: T.fonts.body, fontWeight: 700, fontSize: 10, cursor: "pointer",
                      textTransform: "uppercase", letterSpacing: ".1em" }}>Добавить</button>
                </div>
              ) : (
                <button onClick={() => { setAddingTag(true); setNewTagName(""); setNewTagColor(TAG_COLORS[0]); }}
                  style={{ marginTop: 4, background: "transparent", border: `1px dashed ${t.rule2}`,
                    color: t.ink3, padding: "7px 0", fontFamily: T.fonts.body, fontWeight: 700,
                    fontSize: 10, cursor: "pointer", textTransform: "uppercase", letterSpacing: ".12em",
                    width: "100%" }}>
                  + добавить тег
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Список задач ── */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* ── Привычки на сегодня (только в виде Сегодня) ── */}
        {view === "day" && (() => {
          const todayHabits = (S.habits || []).filter(h => window._habitToday(h));
          if (todayHabits.length === 0) return null;
          const today = window._habitISO();
          return (
            <div style={{ borderBottom: `2px solid ${t.rule2}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                padding: '6px 20px', background: t.paper2 }}>
                <span style={{ fontFamily: T.fonts.body, fontWeight: 700, fontSize: 9.5,
                  color: t.ink4, textTransform: 'uppercase', letterSpacing: '.12em' }}>Привычки сегодня</span>
                <span style={{ flex: 1, height: 1, background: t.rule2 }}/>
              </div>
              {todayHabits.map(h => {
                const done = !!(h.completions || {})[today];
                return (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12,
                    padding: '9px 20px', borderBottom: `1px solid ${t.rule2}` }}>
                    <span onClick={() => dispatch({ type: 'COMPLETE_HABIT', id: h.id, date: today, done: !done })}
                      style={{ width: 17, height: 17, flexShrink: 0,
                        border: `2px solid ${done ? h.color : h.color}`,
                        background: done ? h.color : 'transparent',
                        display: 'grid', placeItems: 'center', fontSize: 10,
                        color: t.paper, cursor: 'pointer', opacity: 1 }}>
                      {done ? '✓' : ''}
                    </span>
                    <span style={{ width: 8, height: 8, borderRadius: '50%',
                      background: h.color, flexShrink: 0 }}/>
                    <span style={{ flex: 1, fontFamily: T.fonts.body, fontSize: 13.5,
                      color: done ? t.ink3 : t.ink, fontWeight: 500,
                      textDecoration: done ? 'line-through' : 'none' }}>{h.title}</span>
                    <span style={{ fontFamily: T.fonts.body, fontSize: 9, color: t.ink4,
                      textTransform: 'uppercase', letterSpacing: '.08em' }}>привычка</span>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {undone.length === 0 && done.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", gap: 12, color: t.ink4 }}>
            <div style={{ fontFamily: T.fonts.display, fontSize: 32, fontWeight: 800,
              textTransform: "uppercase", letterSpacing: ".05em", opacity: 0.25 }}>
              {label}
            </div>
            <div style={{ fontFamily: T.fonts.body, fontSize: 13, color: t.ink4 }}>
              Нет задач
            </div>
            <button onClick={addTask} style={{
              marginTop: 4, background: "transparent",
              border: `1px solid ${t.rule2}`, color: t.ink3,
              padding: "7px 20px", fontFamily: T.fonts.body, fontWeight: 700,
              fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em",
              cursor: "pointer", borderRadius: 0,
            }}>+ добавить задачу</button>
          </div>
        ) : (
          <div>
            {undone.map(card => (
              <TaskRow key={card.id} card={card} tags={S.tags || {}}
                dispatch={dispatch} openCard={openCard}/>
            ))}

            {done.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 20px", borderBottom: `1px solid ${t.rule2}` }}>
                  <span style={{ width: 24, height: 1, background: t.rule2 }}/>
                  <Label color={t.ink4} size={9}>выполнено {done.length}</Label>
                  <span style={{ flex: 1, height: 1, background: t.rule2 }}/>
                </div>
                {done.map(card => (
                  <TaskRow key={card.id} card={card} tags={S.tags || {}}
                    dispatch={dispatch} openCard={openCard}/>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// SearchBox взят из board.jsx — определяем здесь если нужно
const SearchBox = ({ value, onChange }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6,
      background: t.paper2, border: `1px solid ${t.rule2}`, padding: "5px 10px" }}>
      <Icon name="search" size={11} color={t.ink3}/>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск…"
        style={{ background: "transparent", border: 0, outline: "none",
          fontFamily: T.fonts.body, fontSize: 12, width: 140, color: T.theme.ink }}/>
    </div>
  );
};

window.AtlTasks = AtlTasks;
