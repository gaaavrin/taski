// Mock data shared by all views. Mirrors the SwiftData model.
window.kanbanData = (() => {
  const tags = {
    design:  { id: "design",   name: "дизайн",   color: "#7C5CFF" },
    backend: { id: "backend",  name: "бэкенд",   color: "#1F8A5B" },
    bug:     { id: "bug",      name: "баг",      color: "#D7263D" },
    urgent:  { id: "urgent",   name: "срочно",   color: "#E07A1F" },
    research:{ id: "research", name: "research", color: "#2A6FDB" },
    copy:    { id: "copy",     name: "копирайт", color: "#A06B2D" },
    review:  { id: "review",   name: "ревью",    color: "#5C6470" },
  };

  const boards = [
    { id: "work",  name: "Работа",       icon: "briefcase", color: "#2A6FDB", count: 28 },
    { id: "home",  name: "Дом",          icon: "house",     color: "#1F8A5B", count: 9  },
    { id: "study", name: "Учёба",        icon: "book",      color: "#A06B2D", count: 14 },
    { id: "side",  name: "Свой проект",  icon: "rocket",    color: "#7C5CFF", count: 6  },
  ];

  const columns = [
    {
      id: "open", name: "Открыто", color: "#5C6470", count: 6,
      cards: [
        { id: "c1",  title: "Сделать новый онбординг для платных тарифов", tags: ["design","copy"], due: "12 мая", checklist: [0,4], notes: true, priority: 1 },
        { id: "c2",  title: "Аналитика по воронке регистрации за апрель", tags: ["research"], notes: true, priority: 0 },
        { id: "c3",  title: "Перевести экраны настроек на новые токены", tags: ["design"], checklist: [0,7], priority: 0 },
        { id: "c4",  title: "Письмо в поддержку Stripe – disputed charge", due: "8 мая", overdue: true, priority: 2 },
        { id: "c5",  title: "Собрать отзывы из App Store за неделю", priority: 0 },
        { id: "c6",  title: "Обновить changelog за последние два релиза", tags: ["copy"], priority: 0 },
      ],
    },
    {
      id: "wait", name: "Ожидание", color: "#E07A1F", count: 5,
      cards: [
        { id: "c7",  title: "Юристы – проверка условий партнёрки", due: "15 мая", priority: 1, notes: true },
        { id: "c8",  title: "Ждём дизайн от Наши: новые иллюстрации", tags: ["design"], priority: 1 },
        { id: "c9",  title: "Ответ от Apple по rejection (2.1)", tags: ["urgent"], due: "11 мая", priority: 2 },
        { id: "c10", title: "Согласование сметы на инфраструктуру Q3", priority: 0 },
        { id: "c11", title: "Контракт с подрядчиком (DocuSign)", priority: 0 },
      ],
    },
    {
      id: "doing", name: "В работе", color: "#2A6FDB", count: 9,
      cards: [
        { id: "c12", title: "Редизайн карточки задачи: компактная и просторная", tags: ["design","review"], due: "9 мая", checklist: [3,5], notes: true, priority: 2, current: true },
        { id: "c13", title: "Починить дроп между колонками на iPad", tags: ["bug","urgent"], due: "8 мая", overdue: true, priority: 2 },
        { id: "c14", title: "Поиск по карточкам – Spotlight интеграция", tags: ["backend"], checklist: [4,6], priority: 1 },
        { id: "c15", title: "Сократить запуск приложения с 1.4s до <0.8s", tags: ["backend","research"], priority: 1, notes: true },
        { id: "c16", title: "Виджет «Сегодня» – состояния пустоты", tags: ["design"], checklist: [2,3], priority: 1 },
        { id: "c17", title: "Шаринг доски: первая версия read-only ссылки", tags: ["backend"], priority: 0 },
        { id: "c18", title: "Импорт из Trello: парсер JSON-экспорта", tags: ["backend"], priority: 0 },
        { id: "c19", title: "Тема: настраиваемая палитра колонок", tags: ["design"], priority: 0, checklist: [1,4] },
        { id: "c20", title: "Drag & drop на тач-устройствах", tags: ["bug"], priority: 1 },
      ],
    },
    {
      id: "done", name: "Выполнено", color: "#1F8A5B", count: 8,
      cards: [
        { id: "c21", title: "Уведомления через UserNotifications", done: true, tags: ["backend"], checklist: [5,5] },
        { id: "c22", title: "Теги: many-to-many миграция SwiftData", done: true, tags: ["backend"] },
        { id: "c23", title: "Архив с восстановлением карточек", done: true },
        { id: "c24", title: "Menu Bar Extra: быстрое добавление", done: true, tags: ["design"] },
        { id: "c25", title: "Календарь: создание событий из карточки", done: true, tags: ["backend"], checklist: [4,4] },
        { id: "c26", title: "Иконки SF Symbols в выборе доски", done: true, tags: ["design"] },
        { id: "c27", title: "Реординг колонок", done: true },
        { id: "c28", title: "Hotkeys ⌘1…⌘9 переключение досок", done: true },
      ],
    },
  ];

  const today = {
    overdue: [
      { id: "c4",  title: "Письмо в поддержку Stripe – disputed charge", board: "Работа", column: "Открыто",  colColor: "#5C6470", due: "8 мая",  days: 1 },
      { id: "c13", title: "Починить дроп между колонками на iPad",       board: "Работа", column: "В работе", colColor: "#2A6FDB", due: "8 мая",  days: 1 },
      { id: "h1",  title: "Заплатить за интернет",                       board: "Дом",    column: "Открыто",  colColor: "#5C6470", due: "5 мая",  days: 4 },
    ],
    today: [
      { id: "c12", title: "Редизайн карточки задачи: компактная и просторная", board: "Работа", column: "В работе",  colColor: "#2A6FDB", time: "до 18:00" },
      { id: "s1",  title: "Лекция по статистике, глава 7",               board: "Учёба",  column: "В работе",  colColor: "#2A6FDB", time: "19:00" },
      { id: "h2",  title: "Полить цветы у соседей",                      board: "Дом",    column: "Открыто",   colColor: "#5C6470", time: "вечер" },
      { id: "c9",  title: "Ответ от Apple по rejection (2.1)",            board: "Работа", column: "Ожидание",  colColor: "#E07A1F", time: "в течение дня" },
    ],
  };

  const sprint = {
    title: "Спринт #14 · «Релиз 1.7»",
    days: 7, daysLeft: 3, daysSpent: 4,
    range: "5 – 11 мая",
    columns: [
      { id: "taken", name: "Взял", count: 5, items: [
        { id: "s11", title: "Drag & drop на тач-устройствах", priority: 1 },
        { id: "s12", title: "Тема: настраиваемая палитра",    priority: 0 },
        { id: "s13", title: "Онбординг для платных тарифов",  priority: 1 },
        { id: "s14", title: "Импорт из Trello",               priority: 0 },
        { id: "s15", title: "Виджет «Сегодня» – пустые состояния", priority: 0 },
      ]},
      { id: "doing", name: "Делаю", count: 3, items: [
        { id: "s21", title: "Редизайн карточки задачи",       priority: 2, progress: 0.6 },
        { id: "s22", title: "Поиск по карточкам – Spotlight", priority: 1, progress: 0.66 },
        { id: "s23", title: "Сократить запуск до <0.8s",      priority: 1, progress: 0.4 },
      ]},
      { id: "done", name: "Готово", count: 4, items: [
        { id: "s31", title: "Иконки SF Symbols в выборе доски" },
        { id: "s32", title: "Реординг колонок" },
        { id: "s33", title: "Hotkeys ⌘1…⌘9" },
        { id: "s34", title: "Календарь: создание событий" },
      ]},
    ],
    backlog: [
      { id: "b1", title: "Совместный доступ к доске (read-only ссылка)", priority: 2 },
      { id: "b2", title: "Bulk-операции над карточками",                 priority: 1 },
      { id: "b3", title: "Шаблоны досок",                               priority: 1 },
      { id: "b4", title: "Экспорт в Markdown",                          priority: 0 },
      { id: "b5", title: "Свайпы для архивации на iPad",                priority: 0 },
      { id: "b6", title: "Автоархив выполненных через 7 дней",          priority: 0 },
      { id: "b7", title: "Слияние тегов",                               priority: 0 },
      { id: "b8", title: "Виджет на macOS Lock Screen",                 priority: 0 },
    ],
  };

  const archive = [
    { id: "a1", title: "Старый онбординг (v1.4)",           board: "Работа",       at: "2 мая",   tags: ["design"] },
    { id: "a2", title: "Эксперимент с paywall – отменён",   board: "Работа",       at: "29 апр",  tags: ["copy"]   },
    { id: "a3", title: "Купить новый чайник",                board: "Дом",          at: "27 апр"  },
    { id: "a4", title: "Прочитать главу 5 «Statistics»",    board: "Учёба",        at: "24 апр"  },
    { id: "a5", title: "Refactor: вынести StorageService",  board: "Работа",       at: "22 апр",  tags: ["backend"] },
    { id: "a6", title: "MVP лендинга",                       board: "Свой проект",  at: "20 апр",  tags: ["design"] },
    { id: "a7", title: "Эпизод подкаста – заметки",         board: "Учёба",        at: "18 апр"  },
  ];

  const detail = {
    id: "c12",
    title: "Редизайн карточки задачи: компактная и просторная",
    board: "Работа", column: "В работе", colColor: "#2A6FDB",
    due: "9 мая", reminder: "за 1 час",
    tags: ["design","review"],
    notes: "Сделать два режима – компактный (для плотных досок)\nи просторный (для одиночной работы).\n\nПроверить читаемость и баланс с тегами и индикаторами.\nМаксимум 2 строки заголовка, дальше – усечение.",
    checklist: [
      { t: "Аудит существующих карточек",            done: true  },
      { t: "Исследование плотности у Linear / Things", done: true  },
      { t: "Прототип трёх вариантов",                done: true  },
      { t: "Демо команде в четверг",                 done: false, due: "9 мая" },
      { t: "Финальные ассеты в репозиторий",         done: false },
    ],
    created: "1 мая",
    updated: "8 мая, 14:23",
  };

  return { tags, boards, columns, today, sprint, archive, detail };
})();
