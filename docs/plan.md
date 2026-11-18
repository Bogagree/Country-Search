# Country Search — план шагов

Общие правила: [implementation-plan.md](./implementation-plan.md).
Спека продукта: [specs/overview.md](./specs/overview.md).
Канон: [README задания](https://github.com/rolling-scopes-school/tasks/blob/master/fullstack-engineering/tasks/country-search/README.md) (**145**, бонус до **10**).

База: ветка `country-search` от `main`. Шаги коммитятся прямо сюда после одобрения. Отдельный PR на шаг не открывать. PR в `main` не мержить.

`main` остаётся с текущим `README.md`. Код, спеки и инструменты живут в `country-search`. Черновик двух общих файлов сохранён коммитом `82b307b` и этим планом заменён.

---

## Next (для нового чата)

```text
feat/classify-error
```

---

## Шаги

Маркер `[done]` = влито в `country-search`.
Маркер `[    ]` = ещё не влито.

Шаги `feat/debounce` … `feat/search-session` коммитятся парой `test:` → `feat:` и пушатся одним зелёным push. См. [conventions/git.md](./conventions/git.md).

```text
main
└── country-search
    ├── [done] docs/sdd-skeleton       # эти docs и скилл следующего шага
    ├── [done] chore/tooling           # TypeScript, ESLint, Prettier, Jest, tsc
    ├── [done] chore/husky             # pre-commit = lint-staged, pre-push = npm test
    ├── [done] feat/debounce           # debounce, красный затем зелёный
    ├── [done] feat/map-country        # mapCountryResponse на фикстуре
    ├── [done] feat/search-countries   # fetch, response.ok, HttpError, 404
    ├── [    ] feat/classify-error     # AbortError, TimeoutError, HttpError
    ├── [    ] feat/search-session     # abort на каждое изменение ввода
    ├── [    ] test/request-race       # один коммит: мок с инверсией порядка
    ├── [    ] feat/app-shell          # пустой body, el(), каркас экрана
    ├── [    ] feat/search-screen      # загрузка, карточки, пусто, ошибка, повтор
    ├── [    ] feat/country-detail     # клик по карточке
    ├── [    ] docs/design             # DESIGN.md по уже написанному коду
    └── [    ] feat/readme-deploy      # Pages, текст сдаточного PR
```

| Шаг                     | Спека                                        | Что закрывает                                          |
| ----------------------- | -------------------------------------------- | ------------------------------------------------------ |
| `docs/sdd-skeleton`     | [docs/README.md](./README.md)                | знания в файлах, не в чате                             |
| `chore/tooling`         | [tooling.md](./specs/tooling.md)             | TypeScript 5, ESLint + Prettier 5                      |
| `chore/husky`           | [tooling.md](./specs/tooling.md)             | pre-commit 3, pre-push 2                               |
| `feat/debounce`         | [search.md](./specs/search.md)               | TDD 5; свой debounce со сбросом таймера 10             |
| `feat/map-country`      | [search.md](./specs/search.md)               | TDD 5; чистый маппер карточки                          |
| `feat/search-countries` | [search.md](./specs/search.md)               | TDD 5; `response.ok` и `HttpError` 5; 404 как пусто 10 |
| `feat/classify-error`   | [search.md](./specs/search.md)               | TDD 5; `AbortError` не ошибка экрана 10; таймаут 5     |
| `feat/search-session`   | [search.md](./specs/search.md)               | abort при каждом изменении ввода 15                    |
| `test/request-race`     | [search.md](./specs/search.md)               | отдельный тест гонки 10                                |
| `feat/app-shell`        | [ui.md](./specs/ui.md)                       | пустой `body`, каркас                                  |
| `feat/search-screen`    | [ui.md](./specs/ui.md)                       | состояния 10; «Повторить» 5; быстрый набор 5           |
| `feat/country-detail`   | [ui.md](./specs/ui.md)                       | детальный вид по клику 5                               |
| `docs/design`           | [design.md](./specs/design.md)               | `DESIGN.md`, 20                                        |
| `feat/readme-deploy`    | [submit-checklist.md](./submit-checklist.md) | деплой и схема PR, иначе штраф 50                      |

FIRST — свойство тестов обязательных функций, не отдельный шаг. Проверяется по [search.md](./specs/search.md) и [conventions/code.md](./conventions/code.md).

---

## Пока не делать

- Свой backend, прокси, ключ API
- Vite/Webpack как бандлер страницы
- lodash и чужие debounce, кэш, мемоизация
- Гонка только флагом «последний ответ» без `AbortController.abort()`
- `innerHTML`, `insertAdjacentHTML`
- Кэш ответов и история `localStorage` (бонус, в обязательный объём не входит)
- Выдуманный текст «описания» страны: в ответе `/name/{query}` такого поля нет
- `DESIGN.md` до шага `docs/design`
- Merge PR `country-search` → `main`
- Submit в RS App
