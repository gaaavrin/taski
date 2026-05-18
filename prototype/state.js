// Начальное состояние приложения
window.makeAtlState = () => ({
  cards: {},
  tags: window.kanbanData?.tags || {},
});
