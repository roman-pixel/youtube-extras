[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](development.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](../ru/development.md)

# Development Guide

## Setup

1. Clone the repository
2. Open `chrome://extensions/`
3. Enable Developer mode
4. Load unpacked → select the project folder
5. Reload the extension card after each code change

## Conventions

The extension has no bundler. Modules are listed in `manifest.json` under `content_scripts.js` and execute in order in the same global scope. Top-level functions and constants in earlier files are accessible to later ones.

Load order matters. Foundational modules (`youtubeSelectors.js`, `shortcuts.js`, `i18n.js`) come first, then `shortcutCore.js`, then features.

## Adding a feature

1. Add new YouTube selectors to `modules/youtubeSelectors.js` under the relevant feature group.
2. Add new shortcut entries (`code` + `badge`) to `modules/shortcuts.js`.
3. Add user-facing strings (RU + EN) to `modules/i18n.js`; access via `t("key")`.
4. Create `modules/yourFeature.js`. Use:
   - `registerShortcut(keyTest, action)` to bind keys.
   - `initTooltipWatcher(buttons)` to render shortcut badges in YouTube's tooltips.
   - `attachCustomTooltip(el, opts)` for elements without a native tooltip.
   - `attachSearch(opts)` to inject a search bar into a list container.
5. List the new file in `manifest.json` `js` after `shortcutCore.js`.
6. If the module renders UI, add a CSS file under `styles/` and list it in `manifest.json` `css`.
7. Call your init from `content.js`.
8. Add docs: `docs/en/yourFeature.md` and `docs/ru/yourFeature.md`.

## Debug mode

`modules/debugAutoHide.js` keeps the player controls visible. Activate by setting a localStorage flag in the YouTube page console:

```js
localStorage.setItem("ytExtrasDebug", "1")
```

Disable:

```js
localStorage.removeItem("ytExtrasDebug")
```

Reload the page after toggling.
