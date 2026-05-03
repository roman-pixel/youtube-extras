[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](../en/development.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](development.md)

# Руководство разработчика

## Настройка

1. Склонировать репозиторий
2. Открыть `chrome://extensions/`
3. Включить режим разработчика
4. Нажать «Загрузить распакованное» → выбрать папку проекта
5. После каждого изменения кода нажимать кнопку перезагрузки на карточке расширения

## Конвенции

Сборщика нет. Модули перечислены в `manifest.json` в `content_scripts.js` и выполняются по порядку в одном глобальном scope. Функции и константы верхнего уровня из более ранних файлов доступны в более поздних.

Порядок загрузки важен. Сначала идут базовые модули (`youtubeSelectors.js`, `shortcuts.js`, `i18n.js`), затем `shortcutCore.js`, затем фичи.

## Добавление фичи

1. Добавить новые YouTube-селекторы в `modules/youtubeSelectors.js` в нужную группу.
2. Добавить новые шорткаты (`code` + `badge`) в `modules/shortcuts.js`.
3. Добавить строки для пользователя (RU + EN) в `modules/i18n.js`; доступ через `t("key")`.
4. Создать `modules/yourFeature.js`. Использовать:
   - `registerShortcut(keyTest, action)` — для привязки клавиш.
   - `initTooltipWatcher(buttons)` — для бейджей шорткатов в нативных тултипах.
   - `attachCustomTooltip(el, opts)` — для элементов без нативного тултипа.
   - `attachSearch(opts)` — для инжекта строки поиска в контейнер со списком.
5. Добавить файл в `manifest.json` `js` после `shortcutCore.js`.
6. Если модуль рендерит UI, добавить CSS в `styles/` и подключить в `manifest.json` `css`.
7. Вызвать init из `content.js`.
8. Добавить документацию: `docs/en/yourFeature.md` и `docs/ru/yourFeature.md`.

## Debug-режим

`modules/debugAutoHide.js` оставляет контролы плеера видимыми. Включается через флаг в localStorage (выполнить в консоли на странице YouTube):

```js
localStorage.setItem("ytExtrasDebug", "1")
```

Выключить:

```js
localStorage.removeItem("ytExtrasDebug")
```

После переключения перезагрузить страницу.
