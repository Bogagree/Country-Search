# Git & PR

Источники: [RS Git convention](https://rs.school/docs/git-convention), [PR requirements](https://rs.school/docs/mentoring/pull-request-review-process#pull-request-requirements-pr).

## Ветки

```text
main
 └── country-search          ← сюда коммитятся все шаги; PR в main не мержить
```

- Все шаги коммитятся в `country-search`. Отдельную ветку и PR на шаг не открывать.
- PR в `main` один, на шаге `feat/readme-deploy`, и только после явного согласия. Название — **Country Search**. Этот PR не мержить.
- Коммит и push в `country-search` — только после явного одобрения пользователя.

## Коммиты

Сообщения в нижнем регистре, повелительное наклонение, настоящее время:

```text
<type>: <description>
```

Типы: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `build`, `ci`.

Примеры:

```text
test: add failing tests for debounce
feat: implement debounce
chore: add typescript eslint and jest
docs: describe cancellation in DESIGN.md
```

На Windows сообщение передавать here-string PowerShell, не bash heredoc:

```powershell
git commit -m @"
feat: implement debounce

"@
```

## Пара тестов и реализации

Для шагов из [plan.md](../plan.md): `feat/debounce`, `feat/map-country`, `feat/search-countries`, `feat/classify-error`, `feat/search-session`.

1. Коммит `test:` добавляет тесты и заглушку модуля (`throw new Error("not implemented")`). Импорт резолвится. `npm test` на этом коммите падает по утверждениям, не по отсутствию файла.
2. Коммит `feat:` меняет только реализацию. Существующие тесты этого модуля в нём не правятся.
3. Между этими коммитами не пушить. `pre-push` гоняет `npm test` и отправляет `country-search` только зелёной.
4. Коммиты не сжимать. В PR у функции предок с тестами виден раньше реализации.

`test/request-race` — один коммит `test:` после зелёной сессии. Мок `fetch` в нём слушает `signal` и при `abort()` отклоняет промис с `AbortError`.

Если тест в красном коммите проверяет не то, поправить его новым коммитом `test:` до коммита `feat:`, пока ветка не запушена. Уже запушенную пару не переписывать.

## PR `country-search` → `main`

Единственный PR. Новые шаги дописывают коммиты в его ветку, а не открывают следующий PR.

До шага `feat/readme-deploy` чеклист курса в описание не вставлять. На этом шаге текст брать из [submit-checklist.md](../submit-checklist.md), и в описании обязательно:

1. ссылка на задание;
2. скриншот;
3. ссылка на деплой;
4. done / deadline;
5. подтверждение порядка коммитов тесты → реализация по каждой обязательной функции и отдельный коммит теста гонки;
6. ссылка на `DESIGN.md`;
7. пройденный чеклист поведения;
8. самопроверка по баллам.

Футер `Made with Cursor`, `Made by Cursor` и любые похожие подписи **не добавлять** — ни в PR, ни в коммиты, ни в README.
