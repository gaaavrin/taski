// Design tokens + atoms
const ATL_BASE = {
  bg:     "#F1EEE7", paper:  "#FBFAF6", paper2: "#F5F3EC",
  ink:    "#0E0E0C", ink2:   "#2A2A26", ink3:   "#5C5A52", ink4:   "#8C8A82",
  rule:   "#0E0E0C", rule2:  "#D6D2C7",
  yellow: "#F5C518", green:  "#2C6147", blue:   "#1B3CFF",
};
const ATL_DARK = {
  bg:     "#0F0F0E", paper:  "#1A1A18", paper2: "#23231F",
  ink:    "#F1EEE7", ink2:   "#D9D5C9", ink3:   "#9C9A90", ink4:   "#6B695F",
  rule:   "#F1EEE7", rule2:  "#3A3933",
  yellow: "#F5C518", green:  "#3A8961", blue:   "#5778FF",
};

window.atlTheme = (mode = "light", accent = "#FF4814") => ({
  ...(mode === "dark" ? ATL_DARK : ATL_BASE), accent, mode,
});

const FONTS = {
  narrow:  { display: "'Archivo Narrow', system-ui, sans-serif", bold: "'Archivo', system-ui, sans-serif" },
  archivo: { display: "'Archivo', system-ui, sans-serif",        bold: "'Archivo', system-ui, sans-serif" },
  grotesk: { display: "'Space Grotesk', system-ui, sans-serif",  bold: "'Space Grotesk', system-ui, sans-serif" },
};
window.atlFonts = (key = "narrow") => ({
  ...FONTS[key] || FONTS.narrow,
  body: "'Public Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
});

const Num = ({ children, color, size = 12, weight = 600, style }) => {
  const T = window.__atlT;
  return (
    <span style={{ fontFamily: T.fonts.bold, fontWeight: weight, fontSize: size,
      color: color || T.theme.ink, fontVariantNumeric: "tabular-nums",
      letterSpacing: ".01em", ...style }}>{children}</span>
  );
};

const Label = ({ children, color, size = 10, style }) => {
  const T = window.__atlT;
  return (
    <span style={{ fontFamily: T.fonts.body, fontWeight: 700, fontSize: size,
      color: color || T.theme.ink3, textTransform: "uppercase",
      letterSpacing: ".14em", ...style }}>{children}</span>
  );
};

const Bar = ({ height = 1, color, style }) => {
  const T = window.__atlT;
  return <div style={{ height, background: color || T.theme.rule, ...style }}/>;
};

const ATag = ({ tag, small }) => {
  const T = window.__atlT;
  return (
    <span style={{ fontFamily: T.fonts.body, fontWeight: 700, fontSize: small ? 8.5 : 9,
      color: T.theme.mode === "dark" ? "#0F0F0E" : T.theme.paper,
      background: tag.color, padding: small ? "1px 5px" : "2px 6px",
      textTransform: "uppercase", letterSpacing: ".1em", whiteSpace: "nowrap" }}>
      {tag.name}
    </span>
  );
};

const ABtn = ({ children, onClick, primary, danger, ghost, style }) => {
  const T = window.__atlT;
  const bg = primary ? T.theme.ink : danger ? T.theme.accent : ghost ? "transparent" : T.theme.paper;
  const fg = primary || danger ? T.theme.paper : T.theme.ink;
  const bd = ghost ? "transparent" : T.theme.ink;
  return (
    <button onClick={onClick} style={{ background: bg, color: fg, border: `1px solid ${bd}`,
      padding: "6px 12px", fontFamily: T.fonts.body, fontWeight: 700,
      fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".12em",
      cursor: "pointer", borderRadius: 0, ...style }}>{children}</button>
  );
};

const Prio = ({ p, accent }) => {
  const T = window.__atlT;
  if (!p) return null;
  return (
    <span style={{ fontFamily: T.fonts.bold, fontSize: 9, fontWeight: 700,
      color: p === 2 ? (accent || T.theme.accent) : T.theme.ink2,
      textTransform: "uppercase", letterSpacing: ".1em" }}>
      {p === 2 ? "приоритет A" : "приоритет B"}
    </span>
  );
};

const Icon = ({ name, size = 14, color }) => {
  const T = window.__atlT;
  const c = color || T.theme.ink;
  const p = { width: size, height: size, fill: "none", stroke: c, strokeWidth: 1.5, viewBox: "0 0 16 16", style: { display: "block" } };
  switch (name) {
    case "today":   return <svg {...p}><rect x="2" y="3" width="12" height="11"/><line x1="2" y1="6" x2="14" y2="6"/><circle cx="8" cy="10" r="1.4" fill={c} stroke="none"/></svg>;
    case "archive": return <svg {...p}><rect x="2" y="3" width="12" height="3"/><rect x="3" y="6" width="10" height="8"/><line x1="6" y1="9" x2="10" y2="9"/></svg>;
    case "sprint":  return <svg {...p}><polygon points="8,2 14,8 8,14 2,8"/></svg>;
    case "search":  return <svg {...p}><circle cx="7" cy="7" r="4"/><line x1="10" y1="10" x2="14" y2="14"/></svg>;
    case "plus":    return <svg {...p}><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>;
    case "x":       return <svg {...p}><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>;
    case "check":   return <svg {...p}><polyline points="3,8 7,12 13,4"/></svg>;
    case "menu":    return <svg {...p}><rect x="2" y="2" width="5" height="5"/><rect x="9" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/></svg>;
    case "bell":    return <svg {...p}><path d="M4 11 V8 a4 4 0 0 1 8 0 v3 l1 2 H3 z"/><line x1="6.5" y1="14" x2="9.5" y2="14"/></svg>;
    case "drag":    return <svg width={size} height={size} viewBox="0 0 16 16" fill={c}><circle cx="6" cy="4" r="1"/><circle cx="10" cy="4" r="1"/><circle cx="6" cy="8" r="1"/><circle cx="10" cy="8" r="1"/><circle cx="6" cy="12" r="1"/><circle cx="10" cy="12" r="1"/></svg>;
    case "warn":    return <svg {...p}><polygon points="8,2 14,13 2,13"/><line x1="8" y1="6" x2="8" y2="9"/><circle cx="8" cy="11" r=".7" fill={c} stroke="none"/></svg>;
    case "boards":  return <svg {...p}><rect x="2" y="2" width="5" height="12"/><rect x="9" y="2" width="5" height="7"/></svg>;
    case "settings":return <svg {...p}><circle cx="8" cy="8" r="2.5"/><line x1="8" y1="1.5" x2="8" y2="3.5"/><line x1="8" y1="12.5" x2="8" y2="14.5"/><line x1="1.5" y1="8" x2="3.5" y2="8"/><line x1="12.5" y1="8" x2="14.5" y2="8"/></svg>;
    default: return null;
  }
};

Object.assign(window, { Num, Label, Bar, ATag, ABtn, Prio, Icon });
