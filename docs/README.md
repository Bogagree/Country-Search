# Docs — Spec-Driven Development

Country Search ведётся по **SDD**, как [bulls-and-cows](https://github.com/Bogagree/bulls-and-cows/tree/bulls-and-cows/docs): требования и решения живут в репозитории и обновляются вместе с кодом.

## Карта

| Файл / папка | Назначение |
| --- | --- |
| [decisions.md](./decisions.md) | Закрытые решения (`Accepted`) |
| [specs/](./specs/) | Спеки продукта и шагов |
| [conventions/](./conventions/) | Код, git, PR |
| [implementation-plan.md](./implementation-plan.md) | Общий порядок работ |
| [plan.md](./plan.md) | Чеклист шагов |
| [Скилл следующего шага](../.cursor/skills/country-search-next-step/SKILL.md) | Запускает пункт из `## Next` |
| [qa/](./qa/) | Отчёты проверки шагов с интерфейсом |
| [submit-checklist.md](./submit-checklist.md) | Сдача cross-check |

## Как работать

1. **Задача** — короткая сессия, один пункт плана на ветке `country-search`.
2. **Перед кодом** — спека этого шага и `decisions.md`.
3. **Решение принято** — `Accepted` в `decisions.md` (дата и короткое «почему»).
4. **Поведение изменилось** — обновить спеку в том же коммите, что и код.
5. **Задача закрыта** — итог в спеке, decision или PR. Длинный чат дальше не тащить.

## Источники

Канон баллов и сдачи — у RS School. Локальные спеки фиксируют наши договорённости.

- [Country Search](https://github.com/rolling-scopes-school/tasks/blob/master/fullstack-engineering/tasks/country-search/README.md)
- [Git convention](https://rs.school/docs/git-convention)
- [PR requirements](https://rs.school/docs/mentoring/pull-request-review-process#pull-request-requirements-pr)
- [countries.dev](https://countries.dev/docs)

См. [D-002](./decisions.md) и [D-003](./decisions.md).
