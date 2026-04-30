[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](../en/development.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](development.md)

# Руководство разработчика

## Настройка

1. Склонируй репозиторий
2. Открой `chrome://extensions/` в Chrome
3. Включи **Режим разработчика**
4. Нажми **Загрузить распакованное** → выбери папку проекта
5. После любого изменения кода нажми кнопку перезагрузки (↺) на карточке расширения

## Добавление нового модуля

1. Создай `modules/yourFeature.js` с функцией `initYourFeature()` на верхнем уровне
2. Добавь файл в `content_scripts` в `manifest.json`:
   ```json
   "js": ["modules/commentsShortcut.js", "modules/yourFeature.js", "content.js"]
   ```
3. Вызови `initYourFeature()` в `content.js`
4. Добавь документацию в `docs/en/yourFeature.md` и `docs/ru/yourFeature.md`

## Debug-модуль

В разработке полезно отключить автоскрытие контролов плеера YouTube. Создай следующий файл локально — он добавлен в `.gitignore` и не попадёт в репозиторий:

**`modules/debugAutoHide.js`**
```js
function initDebugAutoHide() {
  const player = document.querySelector('#movie_player');
  if (!player) return;

  new MutationObserver(() => {
    if (player.classList.contains('ytp-autohide')) {
      player.classList.remove('ytp-autohide');
    }
  }).observe(player, { attributeFilter: ['class'] });
}
```

Затем зарегистрируй в `manifest.json` и `content.js`:
```json
"js": ["modules/commentsShortcut.js", "modules/debugAutoHide.js", "content.js"]
```
```js
initCommentsShortcut();
initDebugAutoHide();
```
