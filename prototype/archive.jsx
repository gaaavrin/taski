// Archive – sortable list with restore action
const AtlArchive = ({ S, dispatch }) => {
  const T = window.__atlT; const t = T.theme;
  const archive = S.archive;
  return (
    <div style={{ flex: 1, background: t.paper, color: t.ink, padding: "24px 28px",
      overflow: "auto", display: "flex", flexDirection: "column" }}>
      <Label color={t.ink3}>Раздел</Label>
      <div style={{ fontFamily: T.fonts.display, fontSize: 38, fontWeight: 800,
        textTransform: "uppercase", letterSpacing: "-.005em",
        color: t.ink, marginTop: 4, marginBottom: 4 }}>АРХИВ</div>
      <Num color={t.ink3} size={12} weight={400}>
        {archive.length} записей · обновлено сегодня
      </Num>

      <div style={{ height: 16 }}/>
      <Bar color={t.ink} height={2}/>
      <div style={{ display: "grid", gridTemplateColumns: "auto auto 1fr auto auto", gap: "0 16px",
        padding: "8px 0", borderBottom: `1px solid ${t.ink}` }}>
        <Label>№</Label><Label>Дата</Label><Label>Карточка</Label>
        <Label>Доска</Label><Label>Действие</Label>
      </div>
      {archive.map((a, i) => (
        <div key={a.id} style={{ display: "grid", gridTemplateColumns: "auto auto 1fr auto auto",
          gap: "0 16px", padding: "10px 0", borderBottom: `1px solid ${t.rule2}`, alignItems: "center" }}>
          <Num size={11} color={t.ink4} weight={400}>{String(i + 1).padStart(3,"0")}</Num>
          <Num size={12} color={t.ink2} weight={500}>{a.at}</Num>
          <span style={{ fontSize: 13.5, color: t.ink2, textDecoration: "line-through",
            textDecorationColor: t.ink4, fontFamily: T.fonts.body }}>
            {a.title}
            {a.tags && a.tags.length > 0 && (
              <span style={{ marginLeft: 8 }}>
                {a.tags.map(tk => S.tags[tk] && (
                  <span key={tk} style={{ marginRight: 4 }}>
                    <ATag tag={S.tags[tk]} small/>
                  </span>
                ))}
              </span>
            )}
          </span>
          <Label>{a.board}</Label>
          <span onClick={() => dispatch({ type: "RESTORE_ARCHIVE", id: a.id })}
            style={{ fontFamily: T.fonts.body, fontWeight: 700, fontSize: 10,
              color: t.accent, textTransform: "uppercase", letterSpacing: ".12em",
              cursor: "pointer", userSelect: "none" }}>▶ Восстан.</span>
        </div>
      ))}
    </div>
  );
};

window.AtlArchive = AtlArchive;
