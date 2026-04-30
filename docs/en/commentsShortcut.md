[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](commentsShortcut.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](../ru/commentsShortcut.md)

# Comments Shortcut

## What it does

Adds a `Shift+C` keyboard shortcut to toggle the comments panel while YouTube is in fullscreen mode. Also patches the button tooltip to display the shortcut hint.

## Shortcut

| Keys | Action |
|------|--------|
| `Shift+C` | Toggle comments panel (fullscreen only) |

Works on any keyboard layout — uses `e.code` (physical key position) instead of `e.key` (character).

## How it works

**Fullscreen detection**
YouTube sets an `is-fullscreen` attribute on the comments panel element when entering fullscreen. This is more reliable than `document.fullscreenElement`, which returns `null` when YouTube uses its own fullscreen implementation.

**Finding the button**
The comments button lives inside `.ytp-fullscreen-quick-actions`. It is found first by `aria-label` (covering RU and EN locales), then by the unique SVG path of the comments icon as a locale-independent fallback.

**Triggering the action**
Instead of manipulating DOM attributes directly, the module clicks the native YouTube button. This ensures comments content is loaded and YouTube's internal state stays consistent.

**Tooltip patch**
YouTube uses a single shared `yt-popover` element for all button tooltips. A `MutationObserver` watches it and appends a styled `Shift+C` badge when the comments tooltip is active. The existing text node is preserved so YouTube can continue updating it for other buttons.

## File

`modules/commentsShortcut.js`
