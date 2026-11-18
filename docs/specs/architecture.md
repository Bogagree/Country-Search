# Architecture

Связано с [decisions.md](../decisions.md). Меняешь границы слоёв — обнови эту спеку и decision.

## Стек

- TypeScript, ESLint, Prettier, Jest, Husky ([D-002](../decisions.md))
- Сборка страницы: `tsc` → `dist/`. Бандлера нет.
- Деплой: GitHub Pages из артефакта workflow ([D-007](../decisions.md))

## Слои

```text
index.html
css/
  base.css
src/
  dom.ts
  main.ts
  debounce.ts
  map-country.ts
  http-error.ts
  search-countries.ts
  classify-error.ts
  search-session.ts
  ui/
    search-screen.ts
    country-detail.ts
```

`index.html`: в `<head>` — charset, viewport, title «Поиск стран», ссылка на CSS. В `<body>` — только `<script type="module" src="./dist/main.js"></script>`.

## Правила модулей

- `el(tag, { className, text, attrs, children })` вызывает `document.createElement`, ставит класс, `textContent`, атрибуты и детей через `append`. HTML-строку не принимает.
- `debounce`, `map-country`, `http-error`, `search-countries`, `classify-error`, `search-session` не импортируют `src/ui` и `src/dom.ts`.
- `search-countries.ts` вызывает `fetch` и возвращает массив сырых стран. 404 превращает в пустой массив. Прочий неуспешный статус бросает `HttpError`.
- `search-session.ts` на каждое изменение текста вызывает `abort()` предыдущего контроллера, затем через `debounce` зовёт `searchCountries`. Пустая строка сеть не трогает.
- `main.ts` создаёт экран, передаёт ввод в сессию и рисует состояние. Сырой объект страны хранится рядом с карточкой, чтобы детальный вид читал площадь, границы, языки и валюту.

## Поток

```text
input "" → abort, очистить список, fetch нет
input text → abort предыдущего → debounce → searchCountries(text, signal)
  AbortError → экран ошибки не показывать
  404 → «ничего не найдено»
  страны → карточки
  TimeoutError / HttpError / сеть → ошибка и «Повторить»
retry → тот же последний текст
click card → детальный вид этой страны
```
