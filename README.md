[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](README.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](README-RU.md)

# YouTube Extras

A Chrome extension that adds missing keyboard shortcuts and UI improvements to YouTube.

## Features

| Shortcut | Action | Context |
|----------|--------|---------|
| `Shift+C` | Toggle comments panel | Fullscreen mode |

More features coming soon.

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the project folder
5. Open YouTube, play a video, enter fullscreen and press `Shift+C`

## Project structure

```
YT_extension/
├── manifest.json
├── content.js              # Entry point — initializes all modules
└── modules/
    └── commentsShortcut.js # Shift+C shortcut + tooltip patch
```

## Documentation

- [Comments shortcut](docs/en/commentsShortcut.md)
- [Development guide](docs/en/development.md)

## Contributing

Pull requests are welcome. When adding a new feature:
1. Create a new file in `modules/`
2. Declare an `initYourFeature()` function at the top level
3. Call it from `content.js`
4. Add documentation to `docs/en/` and `docs/ru/`
