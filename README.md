[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](README.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](README-RU.md)

# YouTube Extras

Chrome extension. Adds keyboard shortcuts and a search bar to the player settings menu.

## Shortcuts

All shortcuts work in fullscreen and normal mode. Each combo is shown as a badge inside YouTube's native button tooltip.

| Shortcut | Action |
|----------|--------|
| `Shift+C` | Toggle comments / scroll to comments |
| `Shift+L` | Like / unlike |
| `Shift+D` | Dislike / remove dislike |
| `Shift+I` | Toggle description / scroll to description |
| `Shift+S` | Toggle settings menu (auto-focuses the search input) |
| `Shift+F` | Focus the search input inside an open settings menu |
| `Enter` / `Shift+Enter` | Next / previous match in the search bar |
| `Escape` | Blur the search input |

## Menu search

The player settings menu (`.ytp-settings-menu`) gets a search bar when a panel has more than 5 items: subtitles, auto-translate language list, etc. Substring filter, match counter, prev/next navigation, scroll to current match. UI strings are localized — Russian for `ru-*` browser locales, English otherwise.

## Installation

1. Clone the repository
2. Open `chrome://extensions/`
3. Enable Developer mode
4. Load unpacked → select the project folder

## Project structure

```
youtube-extras/
├── manifest.json
├── content.js                  # Entry point
├── styles/
│   ├── badge.css               # Shortcut badge
│   ├── tooltip.css             # Custom tooltip
│   └── search.css              # Menu search bar
└── modules/
    ├── youtubeSelectors.js     # YouTube DOM selectors
    ├── shortcuts.js            # Shortcut codes + badges
    ├── i18n.js                 # User-facing strings (ru/en)
    ├── shortcutCore.js         # registerShortcut, tooltip watcher, scroll helpers
    ├── search.js               # Generic search-injector
    ├── playerShortcuts.js      # Player shortcuts
    ├── playerMenuSearch.js     # Wires search into the player settings menu
    └── debugAutoHide.js        # Disables player auto-hide (debug, opt-in)
```

## Documentation

- [Player shortcuts](docs/en/playerShortcuts.md)
- [Menu search](docs/en/menuSearch.md)
- [Development guide](docs/en/development.md)
