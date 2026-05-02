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

1. Create `modules/yourFeature.js`
2. Use `registerShortcut(keyTest, action)` from `shortcutCore.js` to bind keys
3. Pass button finders to `initTooltipWatcher()` for tooltip badges (called once in the last module that needs it)
4. Add the file to `content_scripts` in `manifest.json` after `shortcutCore.js`:
   ```json
   "css": ["styles/badge.css"],
   "js": ["modules/shortcutCore.js", "modules/playerShortcuts.js", "modules/yourFeature.js", "content.js"]
   ```
5. If your module injects UI elements, add styles to `styles/badge.css` or a new CSS file listed in `css`
6. Call your init function from `content.js`
7. Add documentation to `docs/en/yourFeature.md` and `docs/ru/yourFeature.md`

## Debug mode

`modules/debugAutoHide.js` prevents the YouTube player controls from auto-hiding during development. It is always present in the repo but only activates when a `localStorage` flag is set.

**Enable** (run in the YouTube page console):
```js
localStorage.setItem("ytExtrasDebug", "1")
```

**Disable:**
```js
localStorage.removeItem("ytExtrasDebug")
```

Reload the page after toggling.
