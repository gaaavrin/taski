// Календарные виды: Неделя, Месяц, Год
const _CAL_DAYS   = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const _CAL_MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const _CAL_MON_G  = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const _PRIO       = ['#2CB67D','#F5C518','#E53E3E'];

const _toISO = (d) => {
  const x = new Date(d);
  return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');
};
const _todayISO = () => _toISO(new Date());
const _isToday  = (s) => s === _todayISO();

const _weekMon = (date) => {
  const d = new Date(date); d.setHours(0,0,0,0);
  const w = d.getDay(); d.setDate(d.getDate() - (w===0?6:w-1)); return d;
};

const _monthGrid = (yr, mo) => {
  const fd  = new Date(yr,mo,1).getDay();
  const off = fd===0?6:fd-1;
  const tot = new Date(yr,mo+1,0).getDate();
  const arr = Array(off).fill(null);
  for (let i=1;i<=tot;i++) arr.push(new Date(yr,mo,i));
  while(arr.length%7!==0) arr.push(null);
  return arr;
};

const _onDate = (cards, iso) =>
  Object.values(cards).filter(c=>c.date===iso).sort((a,b)=>(b.priority||0)-(a.priority||0));

// ── Маленькая задача-строка ──────────────────────────────────────────────────
const _TaskLine = ({ card, dispatch, openCard }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 8px',marginBottom:2,
      borderLeft:`3px solid ${card.done?t.ink4:_PRIO[card.priority||0]}`,
      background:T.theme.mode==='dark'?'rgba(255,255,255,.06)':'rgba(0,0,0,.05)',
      cursor:'pointer'}}
      onClick={()=>openCard(card.id)}
      onMouseEnter={e=>e.currentTarget.style.background=T.theme.mode==='dark'?'rgba(255,255,255,.12)':'rgba(0,0,0,.1)'}
      onMouseLeave={e=>e.currentTarget.style.background=T.theme.mode==='dark'?'rgba(255,255,255,.06)':'rgba(0,0,0,.05)'}>
      <span onClick={e=>{e.stopPropagation();dispatch({type:'TOGGLE_DONE',cardId:card.id});}}
        style={{width:13,height:13,flexShrink:0,border:`1.5px solid ${card.done?t.accent:t.ink3}`,
          background:card.done?t.accent:'transparent',display:'grid',placeItems:'center',
          fontSize:8,color:t.paper,cursor:'pointer'}}>{card.done?'✓':''}</span>
      <span style={{flex:1,fontFamily:T.fonts.body,fontSize:12,color:card.done?t.ink4:t.ink,
        textDecoration:card.done?'line-through':'none',
        overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{card.title}</span>
    </div>
  );
};

// ── Навигационные кнопки ─────────────────────────────────────────────────────
const _BtnNav = ({onClick, children}) => {
  const t = window.__atlT.theme;
  return <button onClick={onClick} style={{background:'transparent',border:`1px solid ${t.rule2}`,
    color:t.ink,width:32,height:32,fontSize:20,cursor:'pointer',display:'flex',
    alignItems:'center',justifyContent:'center',lineHeight:1,fontFamily:'system-ui'}}>{children}</button>;
};

// ── ВИД НЕДЕЛЯ: 7 колонок Пн–Вс ─────────────────────────────────────────────
const _WeekView = ({ S, dispatch, openCard }) => {
  const T = window.__atlT; const t = T.theme;
  const [mon, setMon] = React.useState(()=>_weekMon(new Date()));

  const days = Array.from({length:7},(_,i)=>{
    const d=new Date(mon); d.setDate(mon.getDate()+i); return d;
  });

  const nav = (n) => {
    const d=new Date(mon); d.setDate(d.getDate()+n*7); setMon(_weekMon(d));
  };

  const label = ()=>{
    const s=days[0],e=days[6];
    return s.getMonth()===e.getMonth()
      ? `${s.getDate()}–${e.getDate()} ${_CAL_MON_G[s.getMonth()]} ${s.getFullYear()}`
      : `${s.getDate()} ${_CAL_MON_G[s.getMonth()]} – ${e.getDate()} ${_CAL_MON_G[e.getMonth()]}`;
  };

  return (
    <div style={{display:'flex',flexDirection:'column',flex:1,minWidth:0,minHeight:0}}>
      {/* Навигация */}
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 20px',
        background:t.paper,borderBottom:`2px solid ${t.ink}`,flexShrink:0}}>
        <_BtnNav onClick={()=>nav(-1)}>‹</_BtnNav>
        <span style={{fontFamily:T.fonts.display,fontWeight:800,fontSize:18,color:t.ink,
          textTransform:'uppercase',letterSpacing:'.03em',flex:1,textAlign:'center'}}>{label()}</span>
        <_BtnNav onClick={()=>nav(1)}>›</_BtnNav>
        <button onClick={()=>setMon(_weekMon(new Date()))}
          style={{background:'transparent',border:`1px solid ${t.rule2}`,color:t.ink3,
            padding:'5px 12px',fontFamily:T.fonts.body,fontWeight:700,fontSize:10,
            textTransform:'uppercase',letterSpacing:'.1em',cursor:'pointer'}}>Сегодня</button>
      </div>

      {/* 7 колонок */}
      <div style={{flex:1,display:'flex',minHeight:0}}>
        {days.map((day,di)=>{
          const dateISO = _toISO(day);
          const today   = _isToday(dateISO);
          const wknd    = di>=5;
          const tasks   = _onDate(S.cards, dateISO);

          return (
            <div key={dateISO} style={{flex:1,display:'flex',flexDirection:'column',
              borderRight:`1px solid ${t.rule2}`,minWidth:0,
              background:wknd?(T.theme.mode==='dark'?'rgba(255,255,255,.02)':'rgba(0,0,0,.015)'):'transparent'}}>

              {/* Заголовок */}
              <div style={{padding:'6px 8px 5px',textAlign:'center',
                borderBottom:`1px solid ${t.rule2}`,flexShrink:0,
                background:today?t.ink:wknd?(T.theme.mode==='dark'?'rgba(255,255,255,.02)':'rgba(0,0,0,.02)'):'transparent'}}>
                <div style={{fontFamily:T.fonts.body,fontWeight:700,fontSize:9,
                  textTransform:'uppercase',letterSpacing:'.14em',
                  color:today?t.paper:wknd?t.ink3:t.ink4,marginBottom:2}}>{_CAL_DAYS[di]}</div>
                <div style={{fontFamily:T.fonts.mono,fontWeight:800,fontSize:18,lineHeight:1.1,
                  color:today?t.paper:wknd?t.ink3:t.ink}}>{day.getDate()}</div>
              </div>

              {/* Привычки */}
              {(()=>{
                const dow = day.getDay();
                const todayHabits = (S.habits||[]).filter(h=>(h.days||[]).includes(dow));
                if (!todayHabits.length) return null;
                const iso = dateISO;
                return (
                  <div style={{padding:'4px 6px 2px',borderBottom:`1px solid ${t.rule2}`,flexShrink:0,display:'flex',flexWrap:'wrap',gap:3}}>
                    {todayHabits.map(h=>{
                      const done=!!(h.completions||{})[iso];
                      return (
                        <span key={h.id} title={h.title}
                          onClick={()=>dispatch({type:'COMPLETE_HABIT',id:h.id,date:iso,done:!done})}
                          style={{width:10,height:10,borderRadius:'50%',flexShrink:0,cursor:'pointer',
                            background:done?h.color:'transparent',
                            border:`1.5px solid ${h.color}`,
                            opacity:done?1:0.6}}/>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Задачи */}
              <div style={{flex:1,overflow:'auto',padding:'8px 6px 4px'}}>
                {tasks.map(c=><_TaskLine key={c.id} card={c} dispatch={dispatch} openCard={openCard}/>)}
              </div>

              {/* + добавить */}
              <div style={{padding:'4px 6px 8px',flexShrink:0}}>
                <button onClick={()=>dispatch({type:'ADD_CARD',horizon:'week',date:dateISO})}
                  style={{width:'100%',background:'transparent',border:`1px dashed ${t.rule2}`,
                    color:t.ink4,padding:'4px 0',fontFamily:T.fonts.body,fontWeight:700,
                    fontSize:9.5,textTransform:'uppercase',letterSpacing:'.1em',cursor:'pointer',
                    transition:'all .12s'}}
                  onMouseEnter={e=>{e.target.style.borderColor=t.accent;e.target.style.color=t.accent;}}
                  onMouseLeave={e=>{e.target.style.borderColor=t.rule2;e.target.style.color=t.ink4;}}>
                  + задача
                </button>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

// ── ВИД МЕСЯЦ: сетка, тыкаешь → панель справа ───────────────────────────────
const _MonthView = ({ S, dispatch, openCard, initialDate }) => {
  const T = window.__atlT; const t = T.theme;
  const now = new Date();
  const [cursor,  setCursor]  = React.useState(()=>initialDate||new Date(now.getFullYear(),now.getMonth(),1));
  const [selISO,  setSelISO]  = React.useState(_todayISO());

  const yr = cursor.getFullYear(), mo = cursor.getMonth();
  const grid = _monthGrid(yr, mo);
  const selTasks = _onDate(S.cards, selISO);
  const selDate  = selISO ? new Date(selISO+'T00:00:00') : null;

  return (
    <div style={{display:'flex',flex:1,minWidth:0,minHeight:0,overflow:'hidden'}}>

      {/* Календарная сетка */}
      <div style={{display:'flex',flexDirection:'column',flex:1,minWidth:0}}>

        {/* Навигация */}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 20px',
          background:t.paper,borderBottom:`2px solid ${t.ink}`,flexShrink:0}}>
          <_BtnNav onClick={()=>setCursor(new Date(yr,mo-1,1))}>‹</_BtnNav>
          <span style={{fontFamily:T.fonts.display,fontWeight:800,fontSize:22,color:t.ink,
            textTransform:'uppercase',letterSpacing:'.03em',flex:1,textAlign:'center'}}>
            {_CAL_MONTHS[mo]} {yr}
          </span>
          <_BtnNav onClick={()=>setCursor(new Date(yr,mo+1,1))}>›</_BtnNav>
          <button onClick={()=>{setCursor(new Date(now.getFullYear(),now.getMonth(),1));setSelISO(_todayISO());}}
            style={{background:'transparent',border:`1px solid ${t.rule2}`,color:t.ink3,
              padding:'5px 12px',fontFamily:T.fonts.body,fontWeight:700,fontSize:10,
              textTransform:'uppercase',letterSpacing:'.1em',cursor:'pointer'}}>Сегодня</button>
        </div>

        {/* Заголовки дней */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',
          background:t.paper,borderBottom:`1px solid ${t.rule2}`,flexShrink:0}}>
          {_CAL_DAYS.map((d,i)=>(
            <div key={d} style={{padding:'8px 0',textAlign:'center',fontFamily:T.fonts.body,
              fontWeight:700,fontSize:10,textTransform:'uppercase',letterSpacing:'.1em',
              color:i>=5?t.ink3:t.ink4}}>{d}</div>
          ))}
        </div>

        {/* Ячейки */}
        <div style={{flex:1,display:'grid',gridTemplateColumns:'repeat(7,1fr)',overflow:'auto',
          gridAutoRows:'minmax(80px,1fr)'}}>
          {grid.map((day,i)=>{
            if (!day) return <div key={'e'+i} style={{borderRight:`1px solid ${t.rule2}`,
              borderBottom:`1px solid ${t.rule2}`,
              background:T.theme.mode==='dark'?'rgba(0,0,0,.3)':'rgba(0,0,0,.04)'}}/>;

            const iso    = _toISO(day);
            const today  = _isToday(iso);
            const isSel  = iso===selISO;
            const wknd   = i%7>=5;
            const tasks  = _onDate(S.cards, iso);
            const active = tasks.filter(c=>!c.done).length;

            return (
              <div key={iso} onClick={()=>setSelISO(iso)}
                style={{borderRight:`1px solid ${t.rule2}`,borderBottom:`1px solid ${t.rule2}`,
                  padding:'5px 6px',cursor:'pointer',display:'flex',flexDirection:'column',
                  background:isSel?(T.theme.mode==='dark'?'rgba(255,72,20,.18)':'rgba(255,72,20,.08)')
                    :wknd?(T.theme.mode==='dark'?'rgba(255,255,255,.02)':'rgba(0,0,0,.02)'):'transparent',
                  outline:today?`2px solid ${t.accent}`:isSel?`2px solid ${t.accent}`:'none',
                  outlineOffset:-2,transition:'background .1s'}}
                onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background=T.theme.mode==='dark'?'rgba(255,255,255,.06)':'rgba(0,0,0,.06)';}}
                onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background=wknd?(T.theme.mode==='dark'?'rgba(255,255,255,.02)':'rgba(0,0,0,.02)'):'transparent';}}>

                {/* Число */}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                  <span style={{fontFamily:T.fonts.mono,fontWeight:today?800:400,fontSize:13,
                    color:today?t.paper:wknd?t.ink3:t.ink,
                    background:today?t.accent:'transparent',
                    padding:today?'2px 5px':'0',lineHeight:1}}>{day.getDate()}</span>
                  {active>0&&<span style={{fontFamily:T.fonts.mono,fontWeight:700,fontSize:10,
                    color:isSel?t.accent:t.ink3}}>{active}</span>}
                </div>

                {/* Превью задач */}
                {tasks.slice(0,2).map(c=>(
                  <div key={c.id} onClick={e=>{e.stopPropagation();openCard(c.id);}}
                    style={{display:'flex',alignItems:'center',gap:2,padding:'1px 3px',marginBottom:1,
                      borderLeft:`2px solid ${c.done?t.ink4:_PRIO[c.priority||0]}`,
                      background:T.theme.mode==='dark'?'rgba(255,255,255,.07)':'rgba(0,0,0,.06)',
                      cursor:'pointer'}}>
                    <span style={{fontFamily:T.fonts.body,fontSize:9.5,
                      color:c.done?t.ink4:t.ink,textDecoration:c.done?'line-through':'none',
                      overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.title}</span>
                  </div>
                ))}
                {tasks.length>2&&(
                  <span style={{fontFamily:T.fonts.body,fontSize:9,color:t.ink4,paddingLeft:3}}>
                    +{tasks.length-2} ещё
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Панель выбранного дня */}
      <div style={{width:230,flexShrink:0,borderLeft:`2px solid ${t.ink}`,
        display:'flex',flexDirection:'column',background:t.paper}}>
        <div style={{background:t.ink,padding:'14px 16px',flexShrink:0}}>
          <div style={{fontFamily:T.fonts.display,fontWeight:800,fontSize:22,
            textTransform:'uppercase',color:t.paper,lineHeight:1}}>
            {selDate?selDate.getDate():'—'}
          </div>
          <div style={{fontFamily:T.fonts.body,fontSize:11,color:t.ink3,marginTop:3}}>
            {selDate?(_CAL_DAYS[(selDate.getDay()===0?6:selDate.getDay()-1)]+', '+_CAL_MON_G[selDate.getMonth()]):''}
          </div>
        </div>

        <div style={{flex:1,overflow:'auto',padding:'10px 10px 6px'}}>
          {selTasks.length===0?(
            <div style={{fontFamily:T.fonts.body,fontSize:12,color:t.ink4,
              textAlign:'center',paddingTop:20}}>Нет задач</div>
          ):selTasks.map(c=>(
            <_TaskLine key={c.id} card={c} dispatch={dispatch} openCard={openCard}/>
          ))}
        </div>

        <div style={{padding:'10px',borderTop:`1px solid ${t.rule2}`,flexShrink:0}}>
          <button onClick={()=>dispatch({type:'ADD_CARD',horizon:'month',date:selISO})}
            style={{width:'100%',background:t.ink,color:t.paper,border:0,padding:'9px 0',
              fontFamily:T.fonts.body,fontWeight:700,fontSize:10,textTransform:'uppercase',
              letterSpacing:'.12em',cursor:'pointer'}}>＋ добавить задачу</button>
        </div>
      </div>
    </div>
  );
};

// ── ВИД ГОД: 12 мини-месяцев ─────────────────────────────────────────────────
const _YearView = ({ S, dispatch, onMonthClick }) => {
  const T = window.__atlT; const t = T.theme;
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());

  const dotDays = (yr,mo) => {
    const s = new Set();
    Object.values(S.cards).forEach(c=>{
      if (!c.date) return;
      const d=new Date(c.date+'T00:00:00');
      if (d.getFullYear()===yr&&d.getMonth()===mo) s.add(d.getDate());
    });
    return s;
  };

  const taskCount = (yr,mo) =>
    Object.values(S.cards).filter(c=>{
      if (!c.date||c.done) return false;
      const d=new Date(c.date+'T00:00:00');
      return d.getFullYear()===yr&&d.getMonth()===mo;
    }).length;

  return (
    <div style={{display:'flex',flexDirection:'column',flex:1,minWidth:0,minHeight:0}}>
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 20px',
        background:t.paper,borderBottom:`2px solid ${t.ink}`,flexShrink:0}}>
        <_BtnNav onClick={()=>setYear(y=>y-1)}>‹</_BtnNav>
        <span style={{fontFamily:T.fonts.display,fontWeight:800,fontSize:28,color:t.ink,
          textTransform:'uppercase',flex:1,textAlign:'center'}}>{year}</span>
        <_BtnNav onClick={()=>setYear(y=>y+1)}>›</_BtnNav>
        <button onClick={()=>setYear(now.getFullYear())}
          style={{background:'transparent',border:`1px solid ${t.rule2}`,color:t.ink3,
            padding:'5px 12px',fontFamily:T.fonts.body,fontWeight:700,fontSize:10,
            textTransform:'uppercase',letterSpacing:'.1em',cursor:'pointer'}}>Сегодня</button>
      </div>

      <div style={{flex:1,overflow:'auto',padding:'20px 24px',
        display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,alignContent:'start'}}>
        {Array.from({length:12},(_,mo)=>{
          const grid  = _monthGrid(year,mo);
          const dots  = dotDays(year,mo);
          const cnt   = taskCount(year,mo);
          const curr  = now.getFullYear()===year&&now.getMonth()===mo;

          return (
            <div key={mo} onClick={()=>onMonthClick(year,mo)}
              style={{background:t.paper,border:`${curr?2:1}px solid ${curr?t.accent:t.rule2}`,
                padding:'12px 10px',cursor:'pointer',transition:'border-color .15s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=t.ink}
              onMouseLeave={e=>e.currentTarget.style.borderColor=curr?t.accent:t.rule2}>

              <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:8}}>
                <span style={{fontFamily:T.fonts.display,fontWeight:800,fontSize:13,
                  textTransform:'uppercase',letterSpacing:'.04em',color:t.ink}}>
                  {_CAL_MONTHS[mo]}
                </span>
                {cnt>0&&<span style={{fontFamily:T.fonts.mono,fontWeight:700,fontSize:11,
                  color:t.accent}}>{cnt}</span>}
              </div>

              <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',marginBottom:3}}>
                {_CAL_DAYS.map(d=><div key={d} style={{textAlign:'center',fontFamily:T.fonts.body,
                  fontWeight:700,fontSize:7,color:t.ink4,textTransform:'uppercase'}}>{d[0]}</div>)}
              </div>

              <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',rowGap:1}}>
                {grid.map((day,i)=>{
                  if (!day) return <div key={'e'+i}/>;
                  const td  = day.getDate()===now.getDate()&&year===now.getFullYear()&&mo===now.getMonth();
                  const has = dots.has(day.getDate());
                  return (
                    <div key={i} style={{textAlign:'center',position:'relative',paddingBottom:3}}>
                      <span style={{fontFamily:T.fonts.mono,fontSize:8.5,lineHeight:1.3,
                        color:td?t.paper:has?t.ink:t.ink3,
                        background:td?t.accent:'transparent',
                        fontWeight:td||has?700:400,padding:td?'1px 2px':'0'}}>
                        {day.getDate()}
                      </span>
                      {has&&!td&&<span style={{position:'absolute',bottom:0,left:'50%',
                        transform:'translateX(-50%)',width:3,height:3,
                        borderRadius:'50%',background:t.accent,display:'block'}}/>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Обёртка ───────────────────────────────────────────────────────────────────
const AtlCalendar = ({ S, dispatch, view, openCard, setView }) => {
  const [monthDate, setMonthDate] = React.useState(null);

  const goMonth = (yr, mo) => {
    setMonthDate(new Date(yr, mo, 1));
    setView('month');
  };

  if (view==='week')  return <_WeekView  S={S} dispatch={dispatch} openCard={openCard}/>;
  if (view==='month') return <_MonthView S={S} dispatch={dispatch} openCard={openCard} initialDate={monthDate}/>;
  if (view==='year')  return <_YearView  S={S} dispatch={dispatch} onMonthClick={goMonth}/>;
  return null;
};

window.AtlCalendar = AtlCalendar;
