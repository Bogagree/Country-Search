# Decisions

Закрытые решения. `Accepted` = факт для агента, не «обсуждали в чате».

Формат:

```md
## D-NNN: Короткий заголовок

- Status: Accepted
- Date: YYYY-MM-DD
- Почему: одно предложение

Текст решения.
```

---

## D-001: Репозиторий и ветки по требованиям курса

- Status: Accepted
- Date: 2026-11-11
- Почему: задание отдельно описывает пустой `main` и несданный PR в него

Репозиторий `Bogagree/Country-Search`, приватный.

```text
main
 └── country-search     ← приложение; PR → main, НЕ мержить
```

На `main` остаётся уже существующий `README.md`. Задание относит к пустому `main` ещё и `.gitignore`: его добавить отдельным коммитом в `main`, не вместе с приложением. Спеки, инструменты и поиск коммитятся в `country-search`. Отдельные feature-ветки на шаг не открываются: см. [D-006](#d-006-один-pr-и-коммит-после-одобрения).

---

## D-002: Стек — TypeScript, tsc, Jest, без бандлера страницы

- Status: Accepted
- Date: 2026-11-11
- Почему: задание требует TypeScript и считает бандлер необязательным, а Jest или Vitest оставляет на выбор

- TypeScript для логики и UI. Сборка страницы — `tsc` в ES-модули, каталог `dist/`. `dist/` в `.gitignore`.
- Тесты — Jest, с fake timers и моком `fetch`. Курс разрешает Jest или Vitest; для этого репозитория выбран Jest, как уже принято в bulls-and-cows при том же выборе курса.
- ESLint (flat config) + Prettier + `eslint-config-prettier`. Скрипты `lint` и `format`.
- Husky: `pre-commit` запускает только `lint-staged`; `pre-push` запускает `npm test`. Commitlint не ставим.
- Страницу в браузере открывать через статический сервер после `npm run build`. Для локальной проверки хватает `npx serve`, отдельный dev-сервер в зависимости не добавлять.
- Свой backend и прокси не писать: `GET https://countries.dev/name/{query}` вызывается из браузера.

---

## D-003: Документация плана и SDD в репозитории

- Status: Accepted
- Date: 2026-11-11
- Почему: как в bulls-and-cows — знания переживают чаты

Держим `docs/` (спеки, decisions, conventions, план) и обновляем вместе с кодом. `DESIGN.md` в корне появляется только на шаге `docs/design`.

---

## D-004: Структура исходников — запрос без DOM, экран отдельно

- Status: Accepted
- Date: 2026-11-11
- Почему: задание требует тестировать запрос, отмену, маппинг и debounce без браузера и без настоящей сети

```text
index.html                 → пустой body + <script type="module">
css/base.css               → состояния визуально различимы
src/main.ts                → сборка экрана и связь модулей
src/dom.ts                 → el()
src/debounce.ts
src/map-country.ts
src/http-error.ts
src/search-countries.ts
src/classify-error.ts
src/search-session.ts
src/ui/search-screen.ts
src/ui/country-detail.ts
src/**/*.test.ts           → рядом с модулем, tsc их не эмитит
```

Импорты в TS пишутся с расширением `.js`, чтобы собранные ES-модули открывались в браузере.

`el()` вызывает `document.createElement`. Динамический контент не собирается через `innerHTML` и `insertAdjacentHTML`. Модули вне `src/ui` и `src/dom.ts` не трогают DOM.

---

## D-005: TDD-пары и хуки

- Status: Accepted
- Date: 2026-11-11
- Почему: порядок «тесты, потом реализация» проверяется по коммитам, а `pre-push` не даёт запушить красный набор

Для `debounce`, `searchCountries`, `mapCountryResponse` и различения `AbortError` / `TimeoutError` / `HttpError` / 404 в истории ветки есть коммит `test:` со заглушкой и падающими тестами и более поздний коммит `feat:` с реализацией. Коммит `feat:` эти тесты не переписывает.

`feat/search-session` идёт тем же порядком: отмена при каждом изменении ввода проверяется без DOM. Отдельный коммит `test/request-race` добавляет тест гонки уже после этой логики. Красный коммит один не пушится.

`pre-commit` тесты не запускает, иначе красный коммит нельзя создать. Push пункта один, после зелёного коммита, в ветку `country-search`.

---

## D-006: Один PR и коммит после одобрения

- Status: Accepted
- Date: 2026-11-11
- Почему: сдача идёт одним PR в `main`, а коммиты в его ветку не должны появляться без явного согласия

Все шаги после `docs/sdd-skeleton` коммитятся в `country-search`. PR из этой ветки в `main` открывается на шаге `feat/readme-deploy` и только по отдельному согласию. Его не мержить.

`git commit` и `git push` делать только после явного одобрения в текущем чате. До одобрения изменение остаётся в рабочей копии.

---

## D-007: Деплой — GitHub Pages из собранного артефакта

- Status: Accepted
- Date: 2026-11-11
- Почему: задание называет GitHub Pages допустимым деплоем, а ревьюер открывает публичный URL

На шаге `feat/readme-deploy` workflow пушит в Pages результат `npm ci`, `npm test`, `npm run build`. В артефакт входят `index.html`, `dist/` и `css/`. Ссылки в `index.html` относительные.

Ожидаемый URL: `https://bogagree.github.io/Country-Search/`. Видимость репозитория после этого решения изменилась: см. [D-008](#d-008-репозиторий-публичный-ради-github-pages).

---

## D-008: Репозиторий публичный ради GitHub Pages

- Status: Accepted
- Date: 2026-11-18
- Почему: бесплатный план не включает Pages для приватного репозитория

Репозиторий `Bogagree/Country-Search` публичный. Видимость сменил владелец, чтобы workflow мог опубликовать `https://bogagree.github.io/Country-Search/`. Источник Pages — GitHub Actions, не ветка. Ветке `country-search` разрешён деплой в окружение `github-pages`, потому что PR в `main` не мержится.

---

## D-009: Бонус — свой кэш и история, не классы

- Status: Accepted
- Date: 2026-11-18
- Почему: бонус задания — кэш строки запроса и история, а в проекте классом остаётся только `HttpError`

Кэш — `createCachedSearch` вокруг `searchCountries`. Ключ нормализуется, один полёт на ключ, ошибка не сохраняется. Если отменился последний ожидающий, `abort()` уходит в сеть. История — функции над переданным `Storage`, ключ `country-search-history`, не больше восьми. Пишет её экран после успешного поиска и после пустого результата. Клик по «Недавние» вызывает `searchNow` и не ждёт debounce. Сессия `localStorage` не читает.
