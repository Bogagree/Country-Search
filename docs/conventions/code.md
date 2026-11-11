# Code conventions

Стек и слои: [architecture.md](../specs/architecture.md). Решения: [decisions.md](../decisions.md).

## TypeScript

- `strict: true`. Сборка `tsc`, модули ES2022, импорты с суффиксом `.js`.
- `src/**/*.test.ts` не попадает в `dist/`.
- В логике запроса нет `any`. В UI у элемента конкретный тип HTMLElement.
- `HttpError` — единственный класс, который требует задание. Остальную логику запроса держать функциями.

## Тесты

- Jest, среда `node`. DOM-тестов нет. Конфиг: [tooling.md](../specs/tooling.md).
- FIRST: тест не ходит в настоящую сеть, не зависит от порядка файлов, сам говорит pass/fail через `expect`. `fetch` замокан, таймеры debounce — fake timers.
- Один модуль — один файл тестов рядом с ним.
- Заглушка красного коммита — `throw new Error("not implemented")`. Зелёная реализация эту строку не содержит.

## Запрос

- `debounce`, маппер, `searchCountries`, классификатор ошибок и сессия не читают DOM и `localStorage`.
- `searchCountries` проверяет `response.ok`. 404 возвращает пустой массив. Другой неуспешный статус бросает `HttpError` со статусом.
- Отмена своего запроса и таймаут различаются по `name`: `AbortError` и `TimeoutError`.
- Предыдущий запрос отменяется в момент изменения ввода, а не в момент, когда debounce дождался и отправил следующий.

## HTML

- Исходный `<body>` содержит только `<script type="module" src="./dist/main.js"></script>`.
- Элементы приложения — через `el()` из `src/dom.ts`. Текст — только `textContent`.
- У поля ввода есть подпись. Кнопка «Повторить» с видимым текстом.

## Запрещено

- `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`.
- lodash и пакеты с debounce или кэшем.
- Свой backend и прокси к `countries.dev`.
- Считать гонку решённой, если устаревший ответ приходит и отбрасывается без `abort()`.
