// App root – reducer + screen routing + persistence

const LS_KEY = 'taski-state-v1';
const API_BASE = 'http://localhost:27852';

const TWEAK_DEFAULTS = {
  theme: "light",
  accent: "#FF4814",
  density: "normal",
  fontFamily: "narrow",
};

const ACCENTS = ["#FF4814", "#1B3CFF", "#F5C518", "#2C6147", "#0E0E0C"];

const getISOWeek = (d) => {
  const date = new Date(d); date.setHours(0,0,0,0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  const y = date.getFullYear();
  return y + "-W" + String(Math.ceil((((date - new Date(y,0,1)) / 86400000) + 1) / 7)).padStart(2,"0");
};

function _reducer(s, a) {
  switch (a.type) {
    case "TOGGLE_DONE": {
      const c = s.cards[a.cardId];
      if (!c) return s;
      const nextDone = !c.done;
      return { ...s, cards: { ...s.cards, [a.cardId]: { ...c, done: nextDone, overdue: nextDone ? false : c.overdue } } };
    }
    case "TOGGLE_CHECKLIST": {
      const c = s.cards[a.cardId];
      if (c?.checklistItems) {
        const items = c.checklistItems.map((it, i) => i === a.idx ? { ...it, done: !it.done } : it);
        const done = items.filter(x => x.done).length;
        return { ...s, cards: { ...s.cards, [a.cardId]: { ...c, checklistItems: items, checklist: [done, items.length] } } };
      }
      return s;
    }
    case "UPDATE_CARD":
      return { ...s, cards: { ...s.cards, [a.cardId]: { ...s.cards[a.cardId], ...a.patch } } };
    case "ADD_CARD": {
      const id = "n" + Date.now().toString(36);
      const card = { id, title: "Новая задача", date: a.date || null, priority: 0, done: false };
      return { ...s, cards: { ...s.cards, [id]: card }, openCardId: id, openCardEdit: true };
    }
    case "QUICK_ADD": {
      const id = "n" + Date.now().toString(36);
      const card = { id, title: a.title, date: a.date || null, priority: 0, done: false };
      return { ...s, cards: { ...s.cards, [id]: card } };
    }
    case "DELETE_CARD": {
      const cards = { ...s.cards }; delete cards[a.cardId];
      if (a.onClose) a.onClose();
      return { ...s, cards };
    }
    case "ADD_CHECKLIST_ITEM": {
      const c = s.cards[a.cardId];
      const items = [...(c.checklistItems || []), { t: a.text, done: false }];
      const done = items.filter(x => x.done).length;
      return { ...s, cards: { ...s.cards, [a.cardId]: { ...c, checklistItems: items, checklist: [done, items.length] } } };
    }
    case "REMOVE_CHECKLIST_ITEM": {
      const c = s.cards[a.cardId];
      const items = (c.checklistItems || []).filter((_, i) => i !== a.idx);
      const done = items.filter(x => x.done).length;
      return { ...s, cards: { ...s.cards, [a.cardId]: { ...c, checklistItems: items.length ? items : null, checklist: items.length ? [done, items.length] : null } } };
    }
    case "SET_WEEKLY_RESET": {
      const c = s.cards[a.cardId];
      return { ...s, cards: { ...s.cards, [a.cardId]: { ...c, weeklyReset: a.value } } };
    }
    case "TOGGLE_FILTER_TAG": {
      const tags = s.filterTags || [];
      const next = tags.includes(a.tag) ? tags.filter(t => t !== a.tag) : [...tags, a.tag];
      return { ...s, filterTags: next };
    }
    case "CLEAR_FILTER_TAGS":  return { ...s, filterTags: [] };
    case "DELETE_TAG": {
      const tags = { ...s.tags }; delete tags[a.id];
      const cards = Object.fromEntries(Object.entries(s.cards).map(([id, c]) => [
        id, { ...c, tags: (c.tags || []).filter(t => t !== a.id) }
      ]));
      const filterTags = (s.filterTags || []).filter(t => t !== a.id);
      return { ...s, tags, cards, filterTags };
    }
    case "UPDATE_TAG":
      return { ...s, tags: { ...s.tags, [a.id]: { ...s.tags[a.id], ...a.patch } } };
    case "ADD_TAG": {
      const id = "t" + Date.now().toString(36);
      return { ...s, tags: { ...s.tags, [id]: { id, name: a.name, color: a.color } } };
    }
    case "SEARCH":             return { ...s, search: a.value };
    case "SET_VIEW":           return { ...s, view: a.view };
    case "OPEN_CARD":          return { ...s, openCardId: a.id, openCardEdit: false };
    case "CLOSE_CARD":         return { ...s, openCardId: null, openCardEdit: false };
    case "OPEN_MENUBAR":
    case "OPEN_QUICK_ADD":     return { ...s, menuBarOpen: true };
    case "CLOSE_MENUBAR":      return { ...s, menuBarOpen: false };
    case "ADD_HABIT": {
      const id = "h" + Date.now().toString(36);
      const habit = { id, title: a.title, color: a.color, days: a.days, completions: {} };
      return { ...s, habits: [...(s.habits || []), habit] };
    }
    case "DELETE_HABIT":
      return { ...s, habits: (s.habits || []).filter(h => h.id !== a.id) };
    case "UPDATE_HABIT":
      return { ...s, habits: (s.habits || []).map(h => h.id === a.id ? { ...h, title: a.title, color: a.color, days: a.days } : h) };
    case "COMPLETE_HABIT": {
      const habits = (s.habits || []).map(h => {
        if (h.id !== a.id) return h;
        const completions = { ...(h.completions || {}) };
        if (a.done) completions[a.date] = true;
        else delete completions[a.date];
        return { ...h, completions };
      });
      return { ...s, habits };
    }
    case "UPDATE_WORKOUT_TEXT":   return { ...s, workoutText: a.text };
    case "UPDATE_NUTRITION_TEXT": return { ...s, nutritionText: a.text };
    case "UPDATE_STRENGTH_RECORD": {
      const recs = (s.strengthRecords || []).map(r => r.id === a.id ? { ...r, kg: a.kg } : r);
      return { ...s, strengthRecords: recs };
    }
    case "ADD_STRENGTH_EXERCISE": {
      const id = "se" + Date.now().toString(36);
      const recs = [...(s.strengthRecords || []), { id, name: a.name, day: a.day, unit: a.unit || "кг", kg: null }];
      return { ...s, strengthRecords: recs };
    }
    case "REMOVE_STRENGTH_EXERCISE": {
      const recs = (s.strengthRecords || []).filter(r => r.id !== a.id);
      return { ...s, strengthRecords: recs };
    }
    case "WEEKLY_RESET": {
      const week = getISOWeek(new Date());
      const cards = { ...s.cards };
      let changed = false;
      Object.values(s.cards).forEach(c => {
        if (c.weeklyReset && c.checklistItems && c.lastResetWeek !== week) {
          const items = c.checklistItems.map(it => ({ ...it, done: false }));
          cards[c.id] = { ...c, checklistItems: items, checklist: [0, items.length], lastResetWeek: week };
          changed = true;
        }
      });
      return changed ? { ...s, cards } : s;
    }
    case "WEEKLY_CLEANUP": {
      const week = getISOWeek(new Date());
      if (s.lastCleanupWeek === week) return s;
      const cards = Object.fromEntries(Object.entries(s.cards).filter(([, c]) => !c.done));
      return { ...s, cards, lastCleanupWeek: week };
    }
    case "HYDRATE": {
      const payload = { ...a.payload };
      // Миграция: добавляем horizon старым карточкам
      if (payload.cards) {
        payload.cards = Object.fromEntries(
          Object.entries(payload.cards).map(([id, c]) => [
            id, c.horizon ? c : { ...c, horizon: "week" }
          ])
        );
      }
      return { ...s, ...payload };
    }
    case "RESET":
      return {
        ...s,
        cards: {},
        filterTags: [],
        openCardId: null,
        menuBarOpen: false,
        search: "",
      };
    default: return s;
  }
}

function reducer(s, a) {
  const next = _reducer(s, a);
  if (next === s || a.type === "HYDRATE") return next;
  return { ...next, lastUpdated: Date.now() };
}

// Serialisable subset of state – what we persist to disk
const PERSIST_KEYS = ["cards", "tags", "lastUpdated", "filterTags", "workoutText", "nutritionText", "strengthRecords", "lastCleanupWeek", "habits"];
const pickPersist = (s) => Object.fromEntries(PERSIST_KEYS.map(k => [k, s[k]]));

const AtelierApp = () => {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [state, dispatch] = React.useReducer(reducer, null, () => ({
    ...window.makeAtlState(),
    view: "day", openCardId: null, openCardEdit: false,
    menuBarOpen: false, search: "", filterTags: [], lastUpdated: Date.now(), habits: [],
  }));
  const [ready, setReady] = React.useState(false);
  const saveTimer = React.useRef(null);

  const loadFromServer = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/state`);
      if (r.ok) { const d = await r.json(); return d; }
    } catch {}
    return null;
  };

  const saveToServer = (payload) =>
    fetch(`${API_BASE}/api/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});

  // Load persisted state on mount
  React.useEffect(() => {
    const load = async () => {
      try {
        // 1. Electron IPC
        if (window.electronAPI) {
          const s = await window.electronAPI.loadState();
          if (s) { dispatch({ type: "HYDRATE", payload: s }); setReady(true); return; }
        }
        // 2. Python server API
        const s = await loadFromServer();
        if (s) { dispatch({ type: "HYDRATE", payload: s }); setReady(true); return; }
        // 3. localStorage fallback
        const raw = localStorage.getItem(LS_KEY);
        if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) });
      } catch (e) { console.warn("load:", e); }
      setReady(true);
    };
    load();
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    dispatch({ type: "WEEKLY_RESET" });
    dispatch({ type: "WEEKLY_CLEANUP" });
  }, [ready]);

  // Save state (debounced 600ms)
  React.useEffect(() => {
    if (!ready) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const payload = pickPersist(state);
      if (window.electronAPI) { window.electronAPI.saveState(payload).catch(() => {}); return; }
      saveToServer(payload);
      try { localStorage.setItem(LS_KEY, JSON.stringify(payload)); } catch {}
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [state, ready]);

  const theme = window.atlTheme(tw.theme, tw.accent);
  const fonts = window.atlFonts(tw.fontFamily);
  window.__atlT = { theme, fonts, tags: state.tags, density: tw.density };

  const openCard  = (id) => dispatch({ type: "OPEN_CARD", id });
  const closeCard = ()   => dispatch({ type: "CLOSE_CARD" });
  const openMenuBar = () => dispatch({ type: "OPEN_MENUBAR" });

  React.useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.color = theme.ink;
  }, [theme.bg, theme.ink]);

  // Keyboard shortcut ⌘K → menu bar
  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openMenuBar(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (!ready) return (
    <div style={{ width: "100vw", height: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", background: theme.bg,
      fontFamily: fonts.body, color: theme.ink3, fontSize: 14 }}>
      Загрузка…
    </div>
  );

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex",
      background: theme.bg, color: theme.ink, fontFamily: fonts.body,
      position: "relative", overflow: "hidden" }}>

      <AtlSidebar
        view={state.view}
        setView={(v) => dispatch({ type: "SET_VIEW", view: v })}
        S={state} openMenuBar={openMenuBar} dispatch={dispatch}/>

      <main style={{ flex: 1, display: "flex", flexDirection: "column",
        minWidth: 0, minHeight: 0, position: "relative" }}>
        {["day","backlog"].includes(state.view) && (
          <AtlTasks S={state} dispatch={dispatch} view={state.view} openCard={openCard}/>
        )}
        {["week","month","year"].includes(state.view) && (
          <AtlCalendar S={state} dispatch={dispatch} view={state.view}
            openCard={openCard} setView={(v) => dispatch({ type: "SET_VIEW", view: v })}/>
        )}
        {state.view === "coins"    && <AtlCoins/>}
        {state.view === "training" && <AtlTraining S={state} dispatch={dispatch}/>}
        {state.view === "habits"   && <AtlHabits  S={state} dispatch={dispatch}/>}

        {state.openCardId && (
          <AtlDetail S={state} dispatch={dispatch} cardId={state.openCardId} onClose={closeCard} autoEdit={state.openCardEdit}/>
        )}
        {state.menuBarOpen && (
          <AtlMenuBar S={state} dispatch={dispatch}
            onClose={() => dispatch({ type: "CLOSE_MENUBAR" })}
            openCard={openCard}/>
        )}
      </main>

      <TweaksPanel title="Настройки">
        <TweakSection label="Тема"/>
        <TweakRadio label="Режим" value={tw.theme}
          options={[{ value: "light", label: "Светлая" }, { value: "dark", label: "Тёмная" }]}
          onChange={(v) => setTweak("theme", v)}/>
        <TweakColor label="Акцент" value={tw.accent} options={ACCENTS}
          onChange={(v) => setTweak("accent", v)}/>
        <TweakSection label="Раскладка"/>
        <TweakRadio label="Плотность" value={tw.density}
          options={[{ value: "compact", label: "Компакт" }, { value: "normal", label: "Норма" }]}
          onChange={(v) => setTweak("density", v)}/>
        <TweakSelect label="Типографика" value={tw.fontFamily}
          options={[
            { value: "narrow", label: "Archivo Narrow" },
            { value: "archivo", label: "Archivo" },
            { value: "grotesk", label: "Space Grotesk" },
          ]}
          onChange={(v) => setTweak("fontFamily", v)}/>
        <TweakSection label="Данные"/>
        <TweakButton label="Очистить все данные" danger onClick={() => {
          dispatch({ type: "RESET" });
          try { localStorage.removeItem(LS_KEY); } catch {}
          fetch(`${API_BASE}/api/state`, { method: 'DELETE' }).catch(() => {});
        }}/>
      </TweaksPanel>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<AtelierApp/>);
