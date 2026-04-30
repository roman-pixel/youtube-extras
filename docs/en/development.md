[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](development.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](../ru/development.md)

# Development Guide

## Setup

1. Clone the repository
2. Go to `chrome://extensions/` in Chrome
3. Enable **Developer mode**
4. Click **Load unpacked** → select the project folder
5. After any code change, click the reload button (↺) on the extension card

## Adding a new module

1. Create `modules/yourFeature.js` with an `initYourFeature()` function at the top level
2. Add the file to `content_scripts` in `manifest.json`:
   ```json
   "js": ["modules/commentsShortcut.js", "modules/yourFeature.js", "content.js"]
   ```
3. Call `initYourFeature()` in `content.js`
4. Add documentation to `docs/en/yourFeature.md` and `docs/ru/yourFeature.md`

## Debug module

For development it is useful to disable the YouTube player auto-hide behavior (which hides controls after inactivity). Create the following file locally — it is listed in `.gitignore` and will not be committed:

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

Then register it in `manifest.json` and `content.js`:
```json
"js": ["modules/commentsShortcut.js", "modules/debugAutoHide.js", "content.js"]
```
```js
initCommentsShortcut();
initDebugAutoHide();
```
