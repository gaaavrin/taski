// Board view – pointer-event drag & drop (reliable on macOS trackpad)
const AtlBoard = ({ S, dispatch, activeBoard, openCard, search }) => {
  const T = window.__atlT; const t = T.theme;
  const boardRef   = React.useRef(null);
  const dragRef    = React.useRef(null);   // mutable, avoids stale closure
  const didDragRef = React.useRef(false);  // true if pointer moved > threshold
  const [draggingId, setDraggingId] = React.useState(null);
  const [dropInfo,   setDropInfo]   = React.useState(null); // { col, idx }

  const board = S.boards.find(b => b.id === activeBoard) || S.boards[0];
  const cols  = S.boardColumns[board?.id] || [];
  const order = S.order[board?.id] || {};

  const updatedStr = React.useMemo(() => {
    if (!S.lastUpdated) return "--";
    const d = new Date(S.lastUpdated);
    return d.getHours().toString().padStart(2,"0") + ":" + d.getMinutes().toString().padStart(2,"0");
  }, [S.lastUpdated]);

  const filterCard = (c) =>
    !search || c.title.toLowerCase().includes(search.toLowerCase());

  // ── Drop-target geometry ─────────────────────────────────────────────────
  const getDropInfo = React.useCallback((x, y, skipId) => {
    const el = boardRef.current;
    if (!el) return null;

    // Find column by horizontal position
    let colId = null;
    for (const colEl of el.querySelectorAll('[data-col-id]')) {
      const r = colEl.getBoundingClientRect();
      if (x >= r.left && x <= r.right) { colId = colEl.dataset.colId; break; }
    }
    if (!colId) return null;

    // Find insertion index by vertical midpoints
    let idx = 0;
    for (const cardEl of el.querySelectorAll(`[data-card-col="${colId}"]`)) {
      if (cardEl.dataset.cardId === skipId) continue;
      const r = cardEl.getBoundingClientRect();
      if (y > r.top + r.height * 0.5) idx++;
    }
    return { col: colId, idx };
  }, []);

  // ── Global pointer handlers ──────────────────────────────────────────────
  React.useEffect(() => {
    const THRESHOLD = 5;

    const onMove = (e) => {
      const d = dragRef.current;
      if (!d) return;
      if (!d.active) {
        if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < THRESHOLD) return;
        d.active = true;
        setDraggingId(d.cardId);
        document.body.style.cursor = 'grabbing';
      }
      setDropInfo(getDropInfo(e.clientX, e.clientY, d.cardId));
    };

    const onUp = (e) => {
      const d = dragRef.current;
      dragRef.current = null;
      document.body.style.cursor = '';

      didDragRef.current = !!d?.active;
      if (!d?.active) { setDraggingId(null); setDropInfo(null); return; }

      const info = getDropInfo(e.clientX, e.clientY, d.cardId);
      if (info) {
        dispatch({ type: "MOVE_CARD", boardId: activeBoard,
          cardId: d.cardId, fromCol: d.fromCol, toCol: info.col, toIdx: info.idx });
      }
      setDraggingId(null);
      setDropInfo(null);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup',   onUp);
    document.addEventListener('pointercancel', onUp);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup',   onUp);
      document.removeEventListener('pointercancel', onUp);
    };
  }, [activeBoard, dispatch, getDropInfo]);

  const startDrag = (e, cardId, fromCol) => {
    if (e.button !== 0) return;
    didDragRef.current = false;
    dragRef.current = { cardId, fromCol, sx: e.clientX, sy: e.clientY, active: false };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, minHeight: 0 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "stretch",
        background: t.paper, borderBottom: `2px solid ${t.ink}` }}>
        <div style={{ padding: "16px 22px", display: "flex", alignItems: "baseline",
          gap: 12, borderRight: `1px solid ${t.rule2}` }}>
          <span style={{ fontFamily: T.fonts.display, fontSize: 28, fontWeight: 800,
            color: t.ink, textTransform: "uppercase", letterSpacing: ".005em" }}>{board.name}</span>
          <span style={{ width: 8, height: 8, background: board.color }}/>
        </div>
        <Stat label="карточек" value={Object.values(S.cards).filter(c => c.board === activeBoard).length}/>
        <Stat label="обновлено" value={updatedStr}/>
        <span style={{ flex: 1 }}/>
        <div style={{ padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <SearchBox value={search} onChange={v => dispatch({ type: "SEARCH", value: v })}/>
          <ABtn primary onClick={() => dispatch({ type: "OPEN_QUICK_ADD" })}>＋ карточка</ABtn>
        </div>
      </div>

      {/* Columns */}
      <div ref={boardRef} style={{ padding: "18px 22px", display: "flex", gap: 16,
        flex: 1, overflow: "auto", alignItems: "flex-start", minHeight: 0 }}>
        {cols.map((col, i) => {
          const ids = order[col.id] || [];
          const isTarget = draggingId && dropInfo?.col === col.id;
          return (
            <Column key={col.id} col={col} idx={i + 1} count={ids.length}
              colId={col.id} isDropTarget={!!draggingId}>
              {ids.map((cid, idx) => {
                const c = S.cards[cid];
                if (!c || !filterCard(c)) return null;
                const showInsert = isTarget && dropInfo.idx === idx;
                return (
                  <React.Fragment key={cid}>
                    {showInsert && <Insert/>}
                    <BoardCard
                      card={c} columnColor={col.color} idx={idx + 1}
                      colId={col.id}
                      isDragging={draggingId === cid}
                      onPointerDown={(e) => startDrag(e, cid, col.id)}
                      onClick={() => { if (!didDragRef.current) openCard(cid); }}
                      onToggleDone={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_DONE", cardId: cid }); }}
                    />
                  </React.Fragment>
                );
              })}
              {isTarget && dropInfo.idx === ids.length && <Insert/>}
              <ColumnFooter onAdd={() => dispatch({ type: "ADD_CARD", boardId: activeBoard, columnId: col.id })}/>
            </Column>
          );
        })}
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div style={{ padding: "12px 18px", borderRight: `1px solid ${t.rule2}` }}>
      <Label>{label}</Label>
      <div><Num size={20}>{value}</Num></div>
    </div>
  );
};

const SearchBox = ({ value, onChange }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6,
      background: t.paper2, border: `1px solid ${t.rule2}`, padding: "5px 10px" }}>
      <Icon name="search" size={11} color={t.ink3}/>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск…"
        style={{ background: "transparent", border: 0, outline: "none",
          fontFamily: T.fonts.body, fontSize: 12, width: 140, color: t.ink }}/>
    </div>
  );
};

const Column = ({ col, idx, count, children, colId, isDropTarget }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div data-col-id={colId}
      style={{ flex: 1, minWidth: 240, maxWidth: 340, display: "flex",
        flexDirection: "column", gap: 10,
        outline: isDropTarget ? `1.5px dashed ${t.accent}` : "none",
        outlineOffset: 8, transition: "outline .12s" }}>
      <div style={{ borderTop: `2px solid ${col.color}`, padding: "8px 0 4px",
        display: "flex", alignItems: "baseline", gap: 8 }}>
        <Num size={11} color={col.color} weight={700}>0{idx}</Num>
        <span style={{ fontFamily: T.fonts.display, fontSize: 17, fontWeight: 700,
          color: t.ink, textTransform: "uppercase", letterSpacing: ".02em" }}>{col.name}</span>
        <span style={{ flex: 1 }}/>
        <Num size={20} color={t.ink}>{String(count).padStart(2,"0")}</Num>
      </div>
      {children}
    </div>
  );
};

const ColumnFooter = ({ onAdd }) => {
  const T = window.__atlT; const t = T.theme;
  return (
    <div onClick={onAdd}
      style={{ fontFamily: T.fonts.body, fontWeight: 700, fontSize: 10.5,
        textAlign: "center", padding: "10px 0", color: t.ink3,
        textTransform: "uppercase", letterSpacing: ".12em",
        border: `1px dashed ${t.rule2}`, cursor: "pointer", userSelect: "none" }}>
      ＋ добавить
    </div>
  );
};

const Insert = () => {
  const T = window.__atlT;
  return <div style={{ height: 3, background: T.theme.accent, margin: "1px 0", flexShrink: 0 }}/>;
};

const BoardCard = ({ card, columnColor, idx, colId, isDragging, onPointerDown, onClick, onToggleDone }) => {
  const T = window.__atlT; const t = T.theme;
  const tags = T.tags;
  const compact = T.density === "compact";
  return (
    <div
      data-card-id={card.id}
      data-card-col={colId}
      onPointerDown={onPointerDown}
      onClick={onClick}
      style={{ background: t.paper, border: `1px solid ${t.ink}`,
        position: "relative", cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.4 : 1, userSelect: "none",
        transition: "opacity .12s",
        ...(card.current ? { boxShadow: `4px 4px 0 ${t.accent}`, transform: "translate(-1px,-1px)" } : {}) }}>

      <div style={{ display: "flex", alignItems: "stretch",
        borderBottom: `1px solid ${t.ink}`, height: compact ? 18 : 22 }}>
        <div onClick={onToggleDone}
          style={{ width: compact ? 28 : 34,
            background: card.done ? t.green : columnColor,
            color: T.theme.mode === "dark" ? "#0F0F0E" : t.paper,
            fontFamily: T.fonts.bold, fontSize: compact ? 10 : 11, fontWeight: 700,
            display: "grid", placeItems: "center", letterSpacing: ".04em", cursor: "pointer" }}>
          {card.done ? "✓" : String(idx).padStart(2,"00")}
        </div>
        <div style={{ flex: 1, padding: "0 8px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ flex: 1 }}/>
          {card.due && (
            <span style={{ fontFamily: T.fonts.mono, fontSize: 10,
              color: card.overdue ? t.accent : t.ink3,
              fontWeight: card.overdue ? 700 : 400 }}>
              {card.overdue ? "▲" : "◷"} {card.due}
            </span>
          )}
          <span style={{
            width: compact ? 7 : 8, height: compact ? 7 : 8, borderRadius: "50%", flexShrink: 0,
            background: card.priority === 2 ? "#E53E3E" : card.priority === 1 ? "#F5C518" : "#2CB67D",
          }}/>
        </div>
      </div>

      <div style={{ padding: compact ? "6px 10px 8px" : "8px 10px 10px" }}>
        <div style={{ fontFamily: T.fonts.bold, fontSize: compact ? 12.5 : 13.5,
          fontWeight: 500, lineHeight: 1.22, color: card.done ? t.ink3 : t.ink,
          textDecoration: card.done ? "line-through" : "none",
          textWrap: "pretty" }}>{card.title}</div>

        {(card.tags?.length || card.checklist || card.notes) && (
          <div style={{ display: "flex", alignItems: "center",
            gap: 6, marginTop: compact ? 6 : 8, flexWrap: "wrap" }}>
            {card.tags?.map(tk => tags[tk] && <ATag key={tk} tag={tags[tk]} small={compact}/>)}
            <span style={{ flex: 1 }}/>
            {card.checklist && (
              <span style={{ fontFamily: T.fonts.mono, fontSize: 10, color: t.ink3 }}>
                {card.checklist[0]}/{card.checklist[1]} ☑
              </span>
            )}
            {card.notes && <span style={{ fontFamily: T.fonts.mono, fontSize: 10, color: t.ink3 }}>¶</span>}
          </div>
        )}
      </div>
    </div>
  );
};

window.AtlBoard = AtlBoard;
