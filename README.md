[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](README.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](README-RU.md)

# YouTube Extras

A Chrome extension that adds missing keyboard shortcuts and UI improvements to YouTube.

## Features

All shortcuts work in both fullscreen and normal mode and are shown as badges in the native button tooltips.

| Shortcut | Action |
|----------|--------|
| `Shift+C` | Toggle comments panel / scroll to comments |
| `Shift+L` | Like / unlike |
| `Shift+D` | Dislike / remove dislike |
| `Shift+I` | Toggle description / scroll to description |

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the project folder
5. Open YouTube, play a video, enter fullscreen and try the shortcuts

## Project structure

```
youtube-extras/
├── manifest.json
├── content.js                  # Entry point — initializes all modules
├── styles/
│   └── badge.css               # Shortcut badge styles injected into YouTube pages
└── modules/
    ├── shortcutCore.js         # Shared utilities (fullscreen detection, tooltip watcher, shortcut registration)
    ├── playerShortcuts.js      # All player shortcuts
    └── debugAutoHide.js        # Keeps player controls visible (activated via localStorage)
```

## Documentation

- [Player shortcuts](docs/en/playerShortcuts.md)
- [Development guide](docs/en/development.md)

## Contributing

Pull requests are welcome. When adding a new feature:
1. Create a new file in `modules/`
2. Use `registerFullscreenShortcut()` and `initTooltipWatcher()` from `shortcutCore.js`
3. Call your init function from `content.js`
4. Add documentation to `docs/en/` and `docs/ru/`
