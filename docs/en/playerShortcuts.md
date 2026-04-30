[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](playerShortcuts.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](../ru/playerShortcuts.md)

# Player Shortcuts

## What it does

Adds keyboard shortcuts for the quick-action bar buttons that appear in YouTube's fullscreen mode. Each shortcut is shown as a badge in the button's native tooltip.

## Shortcuts

| Keys | Action |
|------|--------|
| `Shift+C` | Toggle comments panel |
| `Shift+L` | Like / unlike |
| `Shift+D` | Dislike / remove dislike |
| `Shift+S` | Share |

All shortcuts work on any keyboard layout — `e.code` (physical key position) is used instead of `e.key` (character).

## How it works

**Fullscreen detection**
YouTube sets an `is-fullscreen` attribute on the comments panel element when entering fullscreen. This is more reliable than `document.fullscreenElement`, which returns `null` when YouTube uses its own fullscreen implementation.

**Finding buttons**
All buttons live inside `.ytp-fullscreen-quick-actions`. Like and dislike are found by their custom element wrappers (`like-button-view-model`, `dislike-button-view-model`), which are language-independent. Comments is found by `aria-label` with a fallback to the unique SVG path of its icon. Share is found by `aria-label`.

**Triggering actions**
Each shortcut clicks the native YouTube button rather than manipulating DOM state directly. This keeps YouTube's internal state consistent (loaded content, animations, counters).

**Tooltip badges**
YouTube uses a single shared `yt-popover` for all button tooltips. A `MutationObserver` watches it. Hover tracking via `mouseover` identifies which button is active — so badge injection is language-independent and works regardless of button state (e.g. "Like" vs "Remove like").

## Files

- `modules/playerShortcuts.js` — button finders and shortcut registration
- `modules/shortcutCore.js` — shared utilities used by this module
