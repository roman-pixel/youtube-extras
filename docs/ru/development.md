[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](../en/development.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](development.md)

# Руководство разработчика

## Настройка

1. Склонировать репозиторий
2. Открыть `chrome://extensions/` в Chrome
3. Включить **Режим разработчика**
4. Нажать **Загрузить распакованное** → выбрать папку проекта
5. После любого изменения кода нажать кнопку перезагрузки (↺) на карточке расширения

## Добавление нового модуля

1. Создать `modules/yourFeature.js`
2. Использовать `registerFullscreenShortcut(keyTest, action)` из `shortcutCore.js` для привязки клавиш
3. Передать функции поиска кнопок в `initTooltipWatcher()` для бейджей в тултипах (вызывается один раз в последнем модуле, которому это нужно)
4. Добавить файл в `content_scripts` в `manifest.json` после `shortcutCore.js`:
   ```json
   "js": ["modules/shortcutCore.js", "modules/playerShortcuts.js", "modules/yourFeature.js", "content.js"]
   ```
5. Вызвать функцию инициализации из `content.js`
6. Добавить документацию в `docs/en/yourFeature.md` и `docs/ru/yourFeature.md`

## Debug-режим

`modules/debugAutoHide.js` отключает автоскрытие контролов плеера YouTube во время разработки. Файл всегда присутствует в репозитории, но активируется только при наличии флага в `localStorage`.

**Включить** (выполнить в консоли на странице YouTube):
```js
localStorage.setItem("ytExtrasDebug", "1")
```

**Выключить:**
```js
localStorage.removeItem("ytExtrasDebug")
```

После переключения перезагрузить страницу.
