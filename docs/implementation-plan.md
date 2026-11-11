# Country Search — план реализации (общий)

Шаги — в [plan.md](./plan.md). Требования и решения — в SDD-доках, здесь не дублируем.

## SDD (читать сначала)

| Артефакт         | Путь                           |
| ---------------- | ------------------------------ |
| Как ведём проект | [docs/README.md](./README.md)  |
| Закрытые решения | [decisions.md](./decisions.md) |
| Спеки            | [specs/](./specs/)             |
| Конвенции        | [conventions/](./conventions/) |

Курс (баллы, сдача): ссылки в [docs/README.md](./README.md).

## План

| План шагов           | Спека                                    | Ветка             |
| -------------------- | ---------------------------------------- | ----------------- |
| [plan.md](./plan.md) | [specs/overview.md](./specs/overview.md) | `country-search`  |

## Как пользоваться

1. Следующий шаг запускает скилл `.cursor/skills/country-search-next-step/SKILL.md` (фраза: «следующий шаг»). Он читает блок **`## Next`** в [plan.md](./plan.md), спеку шага и **decisions**.
2. Шаги сверху вниз. Один шаг = коммиты на `country-search` = один короткий контекст чата. Отдельный PR на шаг не открывать.
3. Для обязательных функций один шаг — это два коммита: сначала падающие тесты, потом реализация. Пушить только когда `npm test` зелёный и пользователь одобрил коммиты. См. [conventions/git.md](./conventions/git.md).
4. После коммита шага в `country-search` — `[done]` и сдвиг `## Next`.
5. Не начинать соседний шаг, пока текущий `## Next` не закрыт.
6. Решение или смена поведения → `decisions.md` / спека в том же коммите.

## Жёсткие ограничения

Делать: TypeScript во всём коде, логика запроса без DOM, TDD-пары коммитов, пустой `<body>` кроме `script`, `document.createElement`, ESLint, Prettier, Husky, Jest, `AbortController`, RS git convention.

Не делать: lodash и чужой debounce или кэш, свой backend или прокси, бандлер страницы, `innerHTML` / `insertAdjacentHTML`, отмену гонки флагом без `abort()`, тесты в `pre-commit`, реализацию обязательной функции раньше её тестов, merge PR `country-search` → `main`.
