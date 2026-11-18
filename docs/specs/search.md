# Search

Функции, которые курс проверяет по коммитам и по коду. Сигнатуры ниже фиксированы. Шаг с парой коммитов: `test:` со заглушкой `throw new Error("not implemented")` и этими кейсами, затем `feat:` без правки тестов. См. [D-005](../decisions.md).

Сеть в тестах — мок `fetch`. Таймеры `debounce` — fake timers.

## `debounce`

```ts
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): (...args: Args) => void;
```

Повторный вызов до истечения `delay` сбрасывает таймер. Выполняется один последний вызов, с его аргументами. Библиотек нет.

| вызовы                                  | время          | сколько раз вызвана `fn` |
| --------------------------------------- | -------------- | ------------------------ |
| один вызов `(1)`                        | `delay - 1` мс | 0                        |
| тот же вызов                            | ещё 1 мс       | 1, аргумент `1`          |
| `(1)`, затем через `delay - 1` мс `(2)` | ещё `delay` мс | 1, аргумент `2`          |

Шаг `feat/debounce`.

## `mapCountryResponse`

```ts
export type CountryCard = {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
};

export function mapCountryResponse(raw: unknown): CountryCard;
```

Чистая функция. `flag` берётся из поля `flag` сырого объекта. `languages` — массив `name` из `languages`. Фикстура повторяет форму `GET /name/spain`: `name` и `capital` — строки, `languages` — массив объектов.

| поле         | для объекта Испании |
| ------------ | ------------------- |
| `name`       | `"Spain"`           |
| `flag`       | `"🇪🇸"`              |
| `capital`    | `"Madrid"`          |
| `region`     | `"Europe"`          |
| `population` | `47351567`          |
| `languages`  | `["Spanish"]`       |

Шаг `feat/map-country`.

## `HttpError` и `searchCountries`

```ts
export class HttpError extends Error {
  readonly status: number;
  constructor(status: number);
}

export function searchCountries(
  query: string,
  signal: AbortSignal,
): Promise<unknown[]>;
```

`fetch` на `https://countries.dev/name/${query}`. В вызов уходит сигнал, собранный из `signal` и таймаута: `AbortSignal.any([signal, AbortSignal.timeout(ms)])`. Если `AbortSignal.any` в среде недоступен — ручная связка двух сигналов в один. `fetch` сам не бросает на 4xx/5xx, поэтому проверяется `response.ok`. Таймаут — `SEARCH_TIMEOUT_MS` = 8000.

| ответ             | результат                                                               |
| ----------------- | ----------------------------------------------------------------------- |
| 200 и JSON-массив | тот же массив                                                           |
| 404               | `[]`, без исключения                                                    |
| 500               | отклонение `HttpError` со `status === 500`                              |
| вызов             | `fetch` получил сигнал, который отменяется вместе с аргументом `signal` |

Миллисекунды таймаута — `SEARCH_TIMEOUT_MS` = 8000 в `src/search-countries.ts`. Шаг `feat/search-countries`.

## Различение ошибок

```ts
export type SearchErrorKind = "abort" | "timeout" | "http" | "failure";

export function classifySearchError(error: unknown): SearchErrorKind;
```

| ошибка                                     | вид         |
| ------------------------------------------ | ----------- |
| `DOMException` с `name === "AbortError"`   | `"abort"`   |
| `DOMException` с `name === "TimeoutError"` | `"timeout"` |
| `HttpError`                                | `"http"`    |
| отказ сети, не эти три                     | `"failure"` |

`"abort"` экран как ошибку не рисует. `"timeout"`, `"http"` и `"failure"` рисуют. 404 сюда не приходит: `searchCountries` уже вернул `[]`. Шаг `feat/classify-error`.

## Сессия ввода

Без DOM. На каждое изменение текста, включая изменение во время ожидания debounce, предыдущий `AbortController` получает `abort()` до запуска нового `fetch`. Пустая строка отменяет запрос, очищает результат и `searchCountries` не вызывает.

| событие                                              | состояние                                 |
| ---------------------------------------------------- | ----------------------------------------- |
| ввод `""`                                            | список пуст, `fetch` не вызван            |
| ввод `"sp"`, debounce ещё не сработал, затем `"spa"` | у контроллера `"sp"` уже вызван `abort()` |
| `searchCountries` отклонился с `AbortError`          | состояние ошибки нет                      |
| 404                                                  | пустой результат, не ошибка               |
| массив стран                                         | карточки через `mapCountryResponse`       |
| `HttpError` или `TimeoutError`                       | ошибка, запомнен последний непустой текст |

Шаг `feat/search-session`.

## Гонка

Отдельный коммит `test:` после `feat/search-session`, без второго коммита реализации. Мок `fetch`: промис более раннего запроса резолвится после промиса более позднего. Если `abort()` вызван до резолва, мок отклоняет промис с `AbortError`. Итоговое состояние — данные только последнего запроса.

Шаг `test/request-race`.
