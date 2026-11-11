---
name: country-search-next-step
description: >-
  Runs the next Country Search plan step from docs/plan.md on branch
  country-search. Does not open a pull request per step. Commits only
  after the user approves. Use when the user says следующий шаг,
  запусти следующий шаг, делай следующий шаг, or next step.
---

# Следующий шаг Country Search

Запусти шаг в этом чате. Не ограничивайся инструкцией, как его запустить.

Один запуск = один пункт `docs/plan.md`. Коммиты пункта идут в ветку `country-search`. Новый PR на шаг не создавать. PR в `main` не мержить.

`git commit` и `git push` — только после явного одобрения пользователя в этом чате. До одобрения покажи diff и остановись.

## Какой шаг брать

1. `git fetch origin`, затем `git checkout country-search` и `git pull`, если ветка уже есть на origin.
2. Прочитай блок `## Next` в `docs/plan.md`. Имя шага — текст внутри ограждения, например `feat/debounce`.
3. Делай пункт из `## Next` прямо на `country-search`. Ветку с именем шага и отдельный PR не создавай.
4. Если пунктов `[    ]` не осталось, скажи, что план закрыт. PR не мержи.

`[done]` значит «коммит шага есть в `country-search`». Ставь `[done]` и сдвигай `## Next` только в коммите, который пользователь одобрил.

## Как делать обычный шаг

1. Прочитай спеку пункта из таблицы в `docs/plan.md`, плюс `docs/decisions.md` и `docs/conventions/code.md`. Для пары коммитов ещё раз прочитай `docs/conventions/git.md`.
2. Работай на свежей `country-search`.
3. Сделай только контракт этого пункта. Соседний пункт не начинай.
4. Смена поведения — обнови спеку в том же коммите.
5. Шаг с интерфейсом проверь в браузере кликами. Отчёт: `docs/qa/<имя без префикса>.md`. Шаг без экрана — без QA-файла.
6. Коммиты по [RS git convention](https://rs.school/docs/git-convention). На PowerShell сообщение передавай here-string:

   ```powershell
   git commit -m @"
   feat: short description

   "@
   ```

7. После одобрения запушь `country-search` один раз, когда `npm test` зелёный. После `chore/husky` красный push хук отклонит. У `docs/sdd-skeleton` тестов ещё нет: push этого пункта не гоняет красный набор.
8. Перед push проверь, что в diff и в описании PR нет `Made with Cursor`, `Made by Cursor` и похожих подписей. Пока строка находится, не пушь.
9. `gh pr create` не вызывай, пока пользователь отдельно не попросил открыть сдаточный PR.

## Пара тестов и реализации

Эти шаги остаются на `country-search` двумя коммитами, без squash и без отдельного PR:

- `feat/debounce`
- `feat/map-country`
- `feat/search-countries`
- `feat/classify-error`
- `feat/search-session`

Порядок:

1. Коммит `test:` — тесты из спеки и заглушка модуля, импорт которой резолвится. Запусти `npm test` и убедись, что новые тесты падают. Не пушь.
2. Коммит `feat:` — реализация. Тесты этого модуля не меняй. `npm test` зелёный.
3. Оба коммита создавай после одобрения. Push один, уже зелёной пары, в `country-search`.

Если красный коммит проверяет не контракт спеки, допиши исправление отдельным `test:` до `feat:`, пока пара не запушена. Уже запушенную пару не переписывать.

`test/request-race` — один коммит `test:` после `feat/search-session`. Мок `fetch` при `abort()` отклоняет промис с `AbortError`. Второго коммита у этого пункта нет.

## Пример

`## Next` = `feat/debounce`.

На `country-search` подготовь изменение. После одобрения: коммит `test: add failing tests for debounce`, затем `feat: implement debounce`, затем push в `country-search`. Оба коммита видны в ветке. Новый PR не открывай. Пока коммитов нет в `country-search`, пункт в `docs/plan.md` остаётся `[    ]`.
