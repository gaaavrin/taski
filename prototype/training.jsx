// Тренировки – три вкладки: план, питание, силовые

const DEFAULT_WORKOUT_TEXT = `ПЛАН ТРЕНИРОВОК
79 кг | 173 см | 24 года
Цель: снижение веса + выносливость для футбола

═══════════════════════════════════════════════
РАСПИСАНИЕ НА НЕДЕЛЮ
═══════════════════════════════════════════════
Пн — Силовая (ноги + толкающие)
Вт — Бег 25-30 мин (средний темп)
Ср — Бег 20-25 мин (лёгкий темп)
Чт — Силовая (задняя цепь + тянущие)
Пт — Интервалы
Сб — Отдых
Вс — Футбол

═══════════════════════════════════════════════
ПОНЕДЕЛЬНИК — СИЛОВАЯ ТРЕНИРОВКА
═══════════════════════════════════════════════
Акцент: ноги + толкающие (грудь, плечи, трицепс)
Разминка: 5-7 минут

Упражнение                       Подх  Повт        Мышцы
──────────────────────────────────────────────────────────
Приседания с гантелями           3     10-12       Ноги
Выпады в ходьбе                  3     10 на ногу  Ноги
Жим на наклонной скамье          3     8-10        Грудь
Махи в стороны                   3     12-15       Средняя дельта
Разгибание гантели из-за головы  3     12          Трицепс
Планка                           3     30-45 сек   Кор

Всего: 18 подходов | Отдых: 2 мин | Время: ~55-60 мин

═══════════════════════════════════════════════
ВТОРНИК — БЕГ (СРЕДНИЙ ТЕМП)
═══════════════════════════════════════════════
Пульс: 130-150 уд/мин

• Недели 1-2: 20-25 мин равномерного бега, без маски
• Недели 3-4: 5 мин без маски → 15 мин с маской → 5 мин без маски
• С 5-й недели: 25-30 мин с маской в среднем темпе

═══════════════════════════════════════════════
СРЕДА — БЕГ (ЛЁГКИЙ ТЕМП)
═══════════════════════════════════════════════
Пульс: 115-125 уд/мин | Без маски

• 20-25 минут в очень лёгком темпе (можешь разговаривать)
• После бега: 10 минут растяжки (бёдра, икры)
• Лёгкий темп сжигает жир лучше быстрого

═══════════════════════════════════════════════
ЧЕТВЕРГ — СИЛОВАЯ ТРЕНИРОВКА
═══════════════════════════════════════════════
Акцент: задняя цепь + тянущие (спина, бицепс, задняя дельта)
Разминка: 5-7 минут

Упражнение              Подх  Повт        Мышцы
──────────────────────────────────────────────────────────
Румынская тяга          3     10          Задняя пов-ть бедра
Приседания с гантелями  3     10-12       Ноги
Тяга гантели к поясу    3     8-10        Спина
Махи в наклоне          3     15          Задняя дельта
Бицепс (сгибание)       3     10-12       Бицепс
Скручивания             3     15          Кор

Всего: 18 подходов | Отдых: 2 мин | Время: ~55-60 мин

═══════════════════════════════════════════════
ПЯТНИЦА — ИНТЕРВАЛЬНАЯ ТРЕНИРОВКА
═══════════════════════════════════════════════
Развивает взрывную выносливость для футбола

• 10 минут разминка (лёгкий бег)
• 8 раундов: 30 сек СПРИНТ / 90 сек отдыха
• 10 минут заминка (лёгкий бег или ходьба)

Прогрессия: через 3-4 недели сократи отдых до 60 сек или увеличь спринт до 40 сек

═══════════════════════════════════════════════
СУББОТА — ОТДЫХ
═══════════════════════════════════════════════
Полный отдых перед футболом.
Можно лёгкую прогулку или растяжку.

═══════════════════════════════════════════════
ВОСКРЕСЕНЬЕ — ФУТБОЛ
═══════════════════════════════════════════════
• За 2-3 часа до игры: приём пищи с углеводами (рис, гречка, хлеб)
• За 30-40 минут: банан или батончик для быстрой энергии

═══════════════════════════════════════════════
ПРОГРЕССИЯ (ЧЕРЕЗ 3-4 НЕДЕЛИ)
═══════════════════════════════════════════════
• Добавь 4-й подход на приседания и жим
• Добавь горизонтальный жим гантелей (понедельник)
• Увеличивай рабочий вес каждые 2-3 недели
• Интервалы: сократи отдых с 90 до 60 сек
• Бег с маской: увеличь до 35-40 минут`;

const DEFAULT_NUTRITION_TEXT = `ПИТАНИЕ — КБЖУ
Тип дня              Ккал  Белки  Жиры  Углеводы
──────────────────────────────────────────────────────────
Тренировка/бег/футбол  2100  150г   65г   240г
Отдых                  1850  150г   65г   170г

═══════════════════════════════════════════════
ПРИЁМЫ ПИЩИ (~2100 ккал)
═══════════════════════════════════════════════
9:00  — Завтрак   →  ~500 ккал
13:00 — Обед      →  ~600 ккал
17:00 — Перекус   →  ~400 ккал
21:00 — Ужин      →  ~600 ккал

═══════════════════════════════════════════════
ИСТОЧНИКИ БЕЛКА
═══════════════════════════════════════════════
Куриная грудка 200г          ~46г
Куриные бёдра 200г           ~34г
Творог 200г                  ~34г
Яйца 3 шт                    ~18г
Рыба 200г                    ~40г
Протеин 1 порция             ~25г
Тунец консервированный       ~25г
Фасоль/нут 100г              ~8г
Молоко 200мл                 ~6г

Пример на 150г белка: куриная грудка + творог + 3 яйца

═══════════════════════════════════════════════
УГЛЕВОДЫ НА ДЕНЬ
═══════════════════════════════════════════════
Завтрак   — Овсянка + банан              ~80г
Обед      — Рис/гречка 150г + курица     ~80г
Перекус   — Банан + хлеб с мёдом         ~50г
Ужин      — Белок + овощи                ~30г

═══════════════════════════════════════════════
ПОЛЕЗНЫЕ ПРАВИЛА
═══════════════════════════════════════════════
• Белок 150г каждый день — без исключений
• Углеводы не срезай — они топливо для тренировок и футбола
• Стакан воды перед каждым приёмом пищи
• Сон 7-8 часов минимум
• Один плохой день — не повод бросать. Просто продолжай
• Записывай рабочие веса — прогрессия = результат
• Диапазон 1900-2300 ккал — нормально, не нужно идеально`;

const DEFAULT_STRENGTH = [
  { id: "s1",  name: "Приседания с гантелями",           day: "Пн/Чт", kg: null, unit: "кг" },
  { id: "s2",  name: "Выпады в ходьбе",                  day: "Пн",    kg: null, unit: "кг" },
  { id: "s3",  name: "Жим на наклонной скамье",          day: "Пн",    kg: null, unit: "кг" },
  { id: "s4",  name: "Махи в стороны",                   day: "Пн",    kg: null, unit: "кг" },
  { id: "s5",  name: "Разгибание гантели из-за головы",  day: "Пн",    kg: null, unit: "кг" },
  { id: "s6",  name: "Планка",                           day: "Пн/Чт", kg: null, unit: "сек" },
  { id: "s7",  name: "Румынская тяга",                   day: "Чт",    kg: null, unit: "кг" },
  { id: "s8",  name: "Тяга гантели к поясу",             day: "Чт",    kg: null, unit: "кг" },
  { id: "s9",  name: "Махи в наклоне",                   day: "Чт",    kg: null, unit: "кг" },
  { id: "s10", name: "Бицепс (сгибание)",                day: "Чт",    kg: null, unit: "кг" },
  { id: "s11", name: "Скручивания",                      day: "Пн/Чт", kg: null, unit: "раз" },
];

// ── Рендер строки текстового плана ─────────────────────────────────────────
const TLine = ({ line }) => {
  const T = window.__atlT; const t = T.theme;
  const tr = line.trim();
  if (!tr) return <div style={{ height: 7 }}/>;
  if (/^[═─]{4,}$/.test(tr)) return <div style={{ height: 1, background: t.rule2, margin: "4px 0" }}/>;
  const isHeader = tr.length > 3 && tr === tr.toUpperCase() && /[А-ЯA-Z]/.test(tr);
  if (isHeader) return (
    <div style={{ fontFamily: T.fonts.display, fontSize: 15, fontWeight: 800,
      color: t.ink, textTransform: "uppercase", letterSpacing: ".04em", marginTop: 6, marginBottom: 2 }}>
      {tr}
    </div>
  );
  if (/^[•\-\*]/.test(tr)) return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start",
      fontFamily: T.fonts.body, fontSize: 13, color: t.ink2, lineHeight: 1.55 }}>
      <span style={{ color: t.accent, flexShrink: 0, fontWeight: 700 }}>•</span>
      <span>{tr.replace(/^[•\-\*]\s*/, '')}</span>
    </div>
  );
  if (/\s{3,}/.test(tr) && !/^(Акцент|Разминка|Пульс|Всего|Цель|Прогрессия)/.test(tr)) return (
    <div style={{ fontFamily: T.fonts.mono, fontSize: 11.5, color: t.ink2, whiteSpace: "pre" }}>
      {line.replace(/^\s{0,4}/, '')}
    </div>
  );
  const indent = (line.match(/^(\s+)/)?.[1].length || 0) > 0;
  return (
    <div style={{ fontFamily: T.fonts.body, fontSize: 13, color: t.ink2,
      lineHeight: 1.55, paddingLeft: indent ? 12 : 0 }}>{tr}</div>
  );
};

const TSection = ({ lines, sectionIdx }) => {
  const T = window.__atlT; const t = T.theme;
  const noSep = lines.filter(l => l.trim() && !/^[═─]{4,}$/.test(l.trim()));
  const first  = noSep[0]?.trim() || "";
  const isHeader = first.length > 3 && first === first.toUpperCase() && /[А-ЯA-Z]/.test(first);
  return (
    <div style={{ marginBottom: 22 }}>
      {isHeader && (
        <div style={{ background: t.ink, color: t.paper, padding: "7px 14px", marginBottom: 10,
          fontFamily: T.fonts.display, fontSize: 14, fontWeight: 800,
          textTransform: "uppercase", letterSpacing: ".05em" }}>
          {first}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingLeft: 2 }}>
        {lines.map((l, i) => {
          const tr = l.trim();
          if (!tr || /^[═─]{4,}$/.test(tr)) return null;
          if (isHeader && l.trim() === first) return null;
          return <TLine key={i} line={l}/>;
        })}
      </div>
    </div>
  );
};

// ── Вкладка текстового плана (Тренировки / Питание) ────────────────────────
const TextTab = ({ text, onSave }) => {
  const T = window.__atlT; const t = T.theme;
  const [editing, setEditing] = React.useState(false);
  const [draft,   setDraft]   = React.useState("");
  const taRef = React.useRef(null);

  const openEdit = () => { setDraft(text); setEditing(true); setTimeout(() => taRef.current?.focus(), 30); };
  const save = () => { onSave(draft); setEditing(false); };

  const sections = React.useMemo(() => text.split(/(?=^═{3,})/m).map(p => p.split('\n')), [text]);
  const titleLines = sections[0]?.filter(l => l.trim() && !/^[═─]{4,}$/.test(l.trim())) || [];

  if (editing) return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ display: "flex", gap: 8, padding: "10px 24px", background: t.paper2,
        borderBottom: `1px solid ${t.rule2}`, flexShrink: 0 }}>
        <button onClick={save} style={{ background: t.ink, color: t.paper, border: 0,
          padding: "5px 16px", fontFamily: T.fonts.body, fontWeight: 700, fontSize: 10,
          textTransform: "uppercase", letterSpacing: ".12em", cursor: "pointer" }}>Сохранить</button>
        <button onClick={() => setEditing(false)} style={{ background: "transparent",
          border: `1px solid ${t.rule2}`, color: t.ink3, padding: "5px 16px",
          fontFamily: T.fonts.body, fontWeight: 700, fontSize: 10,
          textTransform: "uppercase", letterSpacing: ".12em", cursor: "pointer" }}>Отмена</button>
      </div>
      <textarea ref={taRef} value={draft} onChange={e => setDraft(e.target.value)}
        style={{ flex: 1, padding: "20px 24px", fontFamily: T.fonts.mono, fontSize: 12.5,
          lineHeight: 1.7, color: t.ink, background: t.paper2, border: 0, outline: "none", resize: "none" }}/>
    </div>
  );

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "24px 32px 48px", position: "relative" }}>
      <button onClick={openEdit} style={{
        position: "absolute", top: 20, right: 28,
        background: "transparent", border: `1px solid ${t.rule2}`, color: t.ink3,
        padding: "4px 12px", fontFamily: T.fonts.body, fontWeight: 700,
        fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".12em",
        cursor: "pointer", borderRadius: 0, display: "flex", alignItems: "center", gap: 5,
      }}>
        <svg width="10" height="10" viewBox="0 0 11 11" fill="none"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.5 1.5 9.5 3.5 3.5 9.5 1 10 1.5 7.5z"/>
        </svg>
        редактировать
      </button>

      {titleLines.length > 0 && (
        <div style={{ marginBottom: 26, paddingRight: 120 }}>
          <div style={{ fontFamily: T.fonts.display, fontSize: 22, fontWeight: 800,
            color: t.ink, textTransform: "uppercase", letterSpacing: ".01em", lineHeight: 1 }}>
            {titleLines[0]}
          </div>
          {titleLines.slice(1).map((l, i) => (
            <div key={i} style={{ fontFamily: T.fonts.body, fontSize: 13, color: t.ink3, marginTop: i === 0 ? 5 : 1 }}>{l}</div>
          ))}
        </div>
      )}
      {sections.slice(1).map((lines, i) => <TSection key={i} lines={lines} sectionIdx={i}/>)}
    </div>
  );
};

// ── Вкладка Силовые ─────────────────────────────────────────────────────────
const StrengthTab = ({ records, dispatch }) => {
  const T = window.__atlT; const t = T.theme;
  const [editId,  setEditId]  = React.useState(null);
  const [editVal, setEditVal] = React.useState("");
  const [adding,  setAdding]  = React.useState(false);
  const [addName, setAddName] = React.useState("");
  const [addDay,  setAddDay]  = React.useState("Пн");
  const [addUnit, setAddUnit] = React.useState("кг");
  const inputRef = React.useRef(null);

  const startEdit = (r) => {
    setEditId(r.id);
    setEditVal(r.kg != null ? String(r.kg) : "");
    setTimeout(() => inputRef.current?.focus(), 30);
  };
  const saveEdit = (id) => {
    const v = parseFloat(editVal.replace(',', '.'));
    dispatch({ type: "UPDATE_STRENGTH_RECORD", id, kg: isNaN(v) ? null : v });
    setEditId(null);
  };
  const confirmAdd = () => {
    if (!addName.trim()) return;
    dispatch({ type: "ADD_STRENGTH_EXERCISE", name: addName.trim(), day: addDay, unit: addUnit });
    setAddName(""); setAdding(false);
  };

  const GROUPS = [
    { day: "Пн",    label: "ПОНЕДЕЛЬНИК — НОГИ + ТОЛКАЮЩИЕ" },
    { day: "Чт",    label: "ЧЕТВЕРГ — ЗАДНЯЯ ЦЕПЬ + ТЯНУЩИЕ" },
    { day: "Пн/Чт", label: "ОБА ДНЯ" },
  ];

  const inputStyle = {
    width: 64, background: t.paper, border: `2px solid ${t.accent}`,
    color: t.ink, fontFamily: T.fonts.mono, fontSize: 18, fontWeight: 700,
    padding: "3px 6px", outline: "none", textAlign: "right", borderRadius: 0,
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "24px 32px 48px" }}>
      {GROUPS.map(({ day, label }) => {
        const items = records.filter(r => r.day === day);
        if (!items.length) return null;
        return (
          <div key={day} style={{ marginBottom: 28 }}>
            <div style={{ background: t.ink, color: t.paper, padding: "7px 14px", marginBottom: 2,
              fontFamily: T.fonts.display, fontSize: 13, fontWeight: 800,
              textTransform: "uppercase", letterSpacing: ".05em" }}>
              {label}
            </div>
            {items.map((r, i) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center",
                padding: "11px 14px", borderBottom: `1px solid ${t.rule2}`,
                background: editId === r.id ? t.paper2 : "transparent" }}>
                {/* Порядковый номер */}
                <span style={{ fontFamily: T.fonts.mono, fontSize: 10, color: t.ink4,
                  marginRight: 14, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Название */}
                <span style={{ flex: 1, fontFamily: T.fonts.body, fontSize: 13.5, color: t.ink }}>
                  {r.name}
                </span>
                {/* Вес */}
                {editId === r.id ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input ref={inputRef} value={editVal} onChange={e => setEditVal(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveEdit(r.id); if (e.key === "Escape") setEditId(null); }}
                      onBlur={() => saveEdit(r.id)}
                      placeholder="0"
                      style={inputStyle}/>
                    <span style={{ fontFamily: T.fonts.body, fontSize: 12, color: t.ink3, minWidth: 26 }}>
                      {r.unit || "кг"}
                    </span>
                  </div>
                ) : (
                  <div onClick={() => startEdit(r)}
                    style={{ display: "flex", alignItems: "baseline", gap: 4, cursor: "pointer",
                      padding: "4px 10px", border: `1px solid ${r.kg != null ? t.rule2 : "transparent"}`,
                      minWidth: 80, justifyContent: "flex-end" }}>
                    <span style={{ fontFamily: T.fonts.mono, fontSize: 22, fontWeight: 700,
                      color: r.kg != null ? t.ink : t.ink4, lineHeight: 1 }}>
                      {r.kg != null ? r.kg : "—"}
                    </span>
                    <span style={{ fontFamily: T.fonts.body, fontSize: 11, color: t.ink3 }}>
                      {r.unit || "кг"}
                    </span>
                  </div>
                )}
                {/* Удалить */}
                <span onClick={() => dispatch({ type: "REMOVE_STRENGTH_EXERCISE", id: r.id })}
                  title="Удалить"
                  style={{ marginLeft: 8, color: t.ink4, cursor: "pointer",
                    fontSize: 18, lineHeight: 1, padding: "0 4px", flexShrink: 0,
                    opacity: 0.5 }}>×</span>
              </div>
            ))}
          </div>
        );
      })}

      {/* Добавить упражнение */}
      {adding ? (
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input value={addName} onChange={e => setAddName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") confirmAdd(); if (e.key === "Escape") setAdding(false); }}
            autoFocus placeholder="Название упражнения"
            style={{ flex: 1, minWidth: 160, background: t.paper2, border: `1px solid ${t.rule2}`,
              color: t.ink, fontFamily: T.fonts.body, fontSize: 13, padding: "7px 10px",
              outline: "none", borderRadius: 0 }}/>
          <select value={addDay} onChange={e => setAddDay(e.target.value)}
            style={{ background: t.paper2, border: `1px solid ${t.rule2}`, color: t.ink,
              fontFamily: T.fonts.body, fontSize: 12, padding: "7px 8px", outline: "none", borderRadius: 0 }}>
            <option value="Пн">Пн</option>
            <option value="Чт">Чт</option>
            <option value="Пн/Чт">Пн/Чт</option>
          </select>
          <select value={addUnit} onChange={e => setAddUnit(e.target.value)}
            style={{ background: t.paper2, border: `1px solid ${t.rule2}`, color: t.ink,
              fontFamily: T.fonts.body, fontSize: 12, padding: "7px 8px", outline: "none", borderRadius: 0 }}>
            <option value="кг">кг</option>
            <option value="сек">сек</option>
            <option value="раз">раз</option>
          </select>
          <button onClick={confirmAdd} style={{ background: t.ink, color: t.paper, border: 0,
            padding: "7px 16px", fontFamily: T.fonts.body, fontWeight: 700, fontSize: 10,
            textTransform: "uppercase", letterSpacing: ".1em", cursor: "pointer" }}>Добавить</button>
          <button onClick={() => setAdding(false)} style={{ background: "transparent",
            border: `1px solid ${t.rule2}`, color: t.ink3, padding: "7px 16px",
            fontFamily: T.fonts.body, fontWeight: 700, fontSize: 10,
            textTransform: "uppercase", letterSpacing: ".1em", cursor: "pointer" }}>Отмена</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{ marginTop: 12, background: "transparent",
          border: `1px solid ${t.rule2}`, color: t.ink3, padding: "7px 18px",
          fontFamily: T.fonts.body, fontWeight: 700, fontSize: 10, textTransform: "uppercase",
          letterSpacing: ".12em", cursor: "pointer", borderRadius: 0 }}>
          + добавить упражнение
        </button>
      )}
    </div>
  );
};

// ── Главный компонент ────────────────────────────────────────────────────────
const AtlTraining = ({ S, dispatch }) => {
  const T = window.__atlT; const t = T.theme;
  const [tab, setTab] = React.useState("workouts");

  const workoutText   = S.workoutText   != null ? S.workoutText   : DEFAULT_WORKOUT_TEXT;
  const nutritionText = S.nutritionText != null ? S.nutritionText : DEFAULT_NUTRITION_TEXT;
  const records       = S.strengthRecords != null ? S.strengthRecords : DEFAULT_STRENGTH;

  const TABS = [
    { id: "workouts",  label: "Тренировки" },
    { id: "nutrition", label: "Питание" },
    { id: "strength",  label: "Силовые" },
  ];

  const tabBtn = (tb) => (
    <button key={tb.id} onClick={() => setTab(tb.id)} style={{
      background: "transparent", border: 0, borderBottom: `3px solid ${tab === tb.id ? t.accent : "transparent"}`,
      color: tab === tb.id ? t.ink : t.ink4,
      padding: "10px 20px", fontFamily: T.fonts.body, fontWeight: 700,
      fontSize: 11, textTransform: "uppercase", letterSpacing: ".12em",
      cursor: "pointer", transition: "color .15s", flexShrink: 0,
    }}>{tb.label}</button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, minHeight: 0 }}>

      {/* ── Toolbar ── */}
      <div style={{ display: "flex", alignItems: "stretch", flexShrink: 0,
        background: t.paper, borderBottom: `2px solid ${t.ink}` }}>
        <div style={{ padding: "16px 22px", display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: T.fonts.display, fontSize: 28, fontWeight: 800,
            color: t.ink, textTransform: "uppercase", letterSpacing: ".005em" }}>Тренировки</span>
          <span style={{ width: 8, height: 8, background: t.accent, flexShrink: 0 }}/>
        </div>
      </div>

      {/* ── Tabs bar ── */}
      <div style={{ display: "flex", background: t.paper, borderBottom: `1px solid ${t.rule2}`,
        flexShrink: 0, paddingLeft: 8 }}>
        {TABS.map(tabBtn)}
      </div>

      {/* ── Content ── */}
      {tab === "workouts"  && (
        <TextTab text={workoutText}
          onSave={text => dispatch({ type: "UPDATE_WORKOUT_TEXT", text })}/>
      )}
      {tab === "nutrition" && (
        <TextTab text={nutritionText}
          onSave={text => dispatch({ type: "UPDATE_NUTRITION_TEXT", text })}/>
      )}
      {tab === "strength"  && (
        <StrengthTab records={records} dispatch={dispatch}/>
      )}
    </div>
  );
};

window.AtlTraining = AtlTraining;
