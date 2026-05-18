// Привычки – управление и трекинг
const HABIT_DAYS   = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const HABIT_DAYS_N = [1,2,3,4,5,6,0]; // JS getDay(): 0=Sun
const HABIT_COLORS = ["#FF4814","#1B3CFF","#F5C518","#2C6147","#7C5CFF","#E07A1F","#D7263D","#2A6FDB","#1F8A5B"];

const _habitToday = (habit) => {
  const dow = new Date().getDay();
  return (habit.days || []).includes(dow);
};

const _habitISO = () => {
  const d = new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
};

// ── Строка привычки ──────────────────────────────────────────────────────────
const HabitRow = ({ habit, dispatch, editing, onEdit }) => {
  const T = window.__atlT; const t = T.theme;
  const [confirmDel, setConfirmDel] = React.useState(false);

  const today = _habitISO();
  const done  = !!(habit.completions || {})[today];
  const isToday = _habitToday(habit);

  return (
    <div style={{ display:'flex', alignItems:'center', gap:12,
      padding:'12px 20px', borderBottom:`1px solid ${t.rule2}` }}>

      {/* Чекбокс сегодня */}
      <span onClick={() => dispatch({ type:'COMPLETE_HABIT', id:habit.id, date:today, done:!done })}
        style={{ width:18, height:18, flexShrink:0,
          border:`2px solid ${isToday ? habit.color : t.rule2}`,
          background: done ? habit.color : 'transparent',
          display:'grid', placeItems:'center', fontSize:11, color:t.paper,
          cursor: isToday ? 'pointer' : 'default',
          opacity: isToday ? 1 : 0.35 }}>
        {done ? '✓' : ''}
      </span>

      {/* Цвет + название */}
      <span style={{ width:10, height:10, borderRadius:'50%',
        background:habit.color, flexShrink:0 }}/>
      <span style={{ flex:1, fontFamily:T.fonts.body, fontSize:14,
        color:t.ink, fontWeight:500 }}>{habit.title}</span>

      {/* Дни недели */}
      <div style={{ display:'flex', gap:4 }}>
        {HABIT_DAYS.map((d,i) => {
          const active = (habit.days||[]).includes(HABIT_DAYS_N[i]);
          return (
            <span key={d} style={{ fontFamily:T.fonts.mono, fontSize:9, fontWeight:700,
              color: active ? habit.color : t.ink4,
              textTransform:'uppercase', letterSpacing:'.05em',
              opacity: active ? 1 : 0.4 }}>{d}</span>
          );
        })}
      </div>

      {/* Кнопки */}
      <button onClick={onEdit} style={{ background:'transparent',
        border:`1px solid ${t.rule2}`, color:t.ink3, padding:'3px 10px',
        fontFamily:T.fonts.body, fontWeight:700, fontSize:9.5,
        textTransform:'uppercase', letterSpacing:'.08em', cursor:'pointer' }}>
        Изменить
      </button>
      <button onClick={() => {
        if (confirmDel) dispatch({ type:'DELETE_HABIT', id:habit.id });
        else { setConfirmDel(true); setTimeout(()=>setConfirmDel(false),2500); }
      }} style={{ background: confirmDel ? 'rgba(255,72,20,.1)' : 'transparent',
        border:`1px solid ${confirmDel ? t.accent : 'rgba(255,72,20,.35)'}`,
        color:t.accent, padding:'3px 10px', fontFamily:T.fonts.body, fontWeight:700,
        fontSize:9.5, textTransform:'uppercase', letterSpacing:'.08em', cursor:'pointer' }}>
        {confirmDel ? 'Точно?' : 'Удалить'}
      </button>
    </div>
  );
};

// ── Форма добавления/редактирования ─────────────────────────────────────────
const HabitForm = ({ initial, onSave, onCancel }) => {
  const T = window.__atlT; const t = T.theme;
  const [name,  setName]  = React.useState(initial?.title || '');
  const [color, setColor] = React.useState(initial?.color || HABIT_COLORS[0]);
  const [days,  setDays]  = React.useState(initial?.days  || [1,2,3,4,5]);
  const inputRef = React.useRef(null);

  React.useEffect(() => { setTimeout(()=>inputRef.current?.focus(), 30); }, []);

  const toggleDay = (dow) => setDays(ds => ds.includes(dow) ? ds.filter(d=>d!==dow) : [...ds, dow]);
  const save = () => { if (name.trim()) onSave({ title:name.trim(), color, days }); };

  return (
    <div style={{ padding:'16px 20px', background:t.paper2,
      borderBottom:`2px solid ${t.ink}`, display:'flex', flexDirection:'column', gap:12 }}>

      <input ref={inputRef} value={name} onChange={e=>setName(e.target.value)}
        onKeyDown={e=>{ if(e.key==='Enter') save(); if(e.key==='Escape') onCancel(); }}
        placeholder="Название привычки"
        style={{ fontFamily:T.fonts.body, fontSize:15, fontWeight:500, color:t.ink,
          background:t.paper, border:`1px solid ${t.rule2}`, padding:'8px 12px',
          outline:'none', borderRadius:0 }}/>

      {/* Дни недели */}
      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
        <span style={{ fontFamily:T.fonts.body, fontWeight:700, fontSize:10,
          color:t.ink4, textTransform:'uppercase', letterSpacing:'.1em', marginRight:4 }}>Дни:</span>
        {HABIT_DAYS.map((d,i) => {
          const dow    = HABIT_DAYS_N[i];
          const active = days.includes(dow);
          return (
            <button key={d} onClick={()=>toggleDay(dow)}
              style={{ fontFamily:T.fonts.body, fontWeight:700, fontSize:10,
                textTransform:'uppercase', letterSpacing:'.06em',
                color: active ? t.paper : t.ink3,
                background: active ? color : 'transparent',
                border:`1.5px solid ${active ? color : t.rule2}`,
                padding:'4px 8px', cursor:'pointer' }}>{d}</button>
          );
        })}
        <button onClick={()=>setDays([1,2,3,4,5])}
          style={{ marginLeft:4, background:'transparent', border:`1px solid ${t.rule2}`,
            color:t.ink4, padding:'4px 8px', fontFamily:T.fonts.body, fontWeight:700,
            fontSize:9, textTransform:'uppercase', letterSpacing:'.08em', cursor:'pointer' }}>
          Пн–Пт
        </button>
        <button onClick={()=>setDays([0,1,2,3,4,5,6])}
          style={{ background:'transparent', border:`1px solid ${t.rule2}`,
            color:t.ink4, padding:'4px 8px', fontFamily:T.fonts.body, fontWeight:700,
            fontSize:9, textTransform:'uppercase', letterSpacing:'.08em', cursor:'pointer' }}>
          Каждый день
        </button>
      </div>

      {/* Цвет */}
      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
        <span style={{ fontFamily:T.fonts.body, fontWeight:700, fontSize:10,
          color:t.ink4, textTransform:'uppercase', letterSpacing:'.1em', marginRight:4 }}>Цвет:</span>
        {HABIT_COLORS.map(c => (
          <span key={c} onClick={()=>setColor(c)}
            style={{ width:18, height:18, background:c, cursor:'pointer', flexShrink:0,
              outline: color===c ? `2px solid ${t.ink}` : 'none', outlineOffset:2 }}/>
        ))}
      </div>

      {/* Кнопки */}
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={save}
          style={{ background:name.trim()?t.ink:'transparent', color:name.trim()?t.paper:t.ink4,
            border:`1px solid ${name.trim()?t.ink:t.rule2}`, padding:'7px 20px',
            fontFamily:T.fonts.body, fontWeight:700, fontSize:10,
            textTransform:'uppercase', letterSpacing:'.1em', cursor:'pointer' }}>
          {initial ? 'Сохранить' : 'Добавить'}
        </button>
        <button onClick={onCancel}
          style={{ background:'transparent', border:`1px solid ${t.rule2}`, color:t.ink3,
            padding:'7px 20px', fontFamily:T.fonts.body, fontWeight:700, fontSize:10,
            textTransform:'uppercase', letterSpacing:'.1em', cursor:'pointer' }}>
          Отмена
        </button>
      </div>
    </div>
  );
};

// ── Главный компонент ────────────────────────────────────────────────────────
const AtlHabits = ({ S, dispatch }) => {
  const T = window.__atlT; const t = T.theme;
  const habits = S.habits || [];
  const [adding,   setAdding]   = React.useState(false);
  const [editId,   setEditId]   = React.useState(null);

  const saveNew  = (data) => { dispatch({ type:'ADD_HABIT',    ...data }); setAdding(false); };
  const saveEdit = (data) => { dispatch({ type:'UPDATE_HABIT', id:editId, ...data }); setEditId(null); };

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, minWidth:0, minHeight:0 }}>

      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'stretch', flexShrink:0,
        background:t.paper, borderBottom:`2px solid ${t.ink}` }}>
        <div style={{ padding:'16px 22px', display:'flex', alignItems:'baseline', gap:12 }}>
          <span style={{ fontFamily:T.fonts.display, fontSize:28, fontWeight:800,
            color:t.ink, textTransform:'uppercase', letterSpacing:'.005em' }}>Привычки</span>
          <span style={{ width:8, height:8, background:t.green, flexShrink:0 }}/>
        </div>
        <span style={{ flex:1 }}/>
        <div style={{ padding:'10px 20px', display:'flex', alignItems:'center' }}>
          {!adding && !editId && (
            <button onClick={()=>setAdding(true)}
              style={{ background:t.ink, color:t.paper, border:0, padding:'7px 18px',
                fontFamily:T.fonts.body, fontWeight:700, fontSize:11,
                textTransform:'uppercase', letterSpacing:'.1em', cursor:'pointer' }}>
              ＋ привычка
            </button>
          )}
        </div>
      </div>

      {/* Форма добавления */}
      {adding && <HabitForm onSave={saveNew} onCancel={()=>setAdding(false)}/>}

      {/* Список */}
      <div style={{ flex:1, overflow:'auto' }}>
        {habits.length === 0 && !adding ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', height:'60%', gap:12 }}>
            <div style={{ fontFamily:T.fonts.display, fontSize:28, fontWeight:800,
              textTransform:'uppercase', color:t.ink4, opacity:.2 }}>Привычки</div>
            <div style={{ fontFamily:T.fonts.body, fontSize:13, color:t.ink4 }}>
              Добавь первую привычку
            </div>
            <button onClick={()=>setAdding(true)}
              style={{ marginTop:4, background:'transparent', border:`1px solid ${t.rule2}`,
                color:t.ink3, padding:'7px 20px', fontFamily:T.fonts.body, fontWeight:700,
                fontSize:10, textTransform:'uppercase', letterSpacing:'.12em', cursor:'pointer' }}>
              + добавить
            </button>
          </div>
        ) : habits.map(h => (
          editId === h.id ? (
            <div key={h.id}>
              <HabitForm initial={h} onSave={saveEdit} onCancel={()=>setEditId(null)}/>
            </div>
          ) : (
            <HabitRow key={h.id} habit={h} dispatch={dispatch}
              editing={false} onEdit={()=>setEditId(h.id)}/>
          )
        ))}
      </div>
    </div>
  );
};

window.AtlHabits = AtlHabits;
window._habitToday = _habitToday;
window._habitISO   = _habitISO;
window.HABIT_DAYS  = HABIT_DAYS;
window.HABIT_DAYS_N= HABIT_DAYS_N;
