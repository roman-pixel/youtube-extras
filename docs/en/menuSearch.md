[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](menuSearch.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](../ru/menuSearch.md)

# Menu Search

A search bar injected into YouTube's player settings menu (`.ytp-settings-menu`) for any panel longer than `SEARCH_MIN_ITEMS` (5). Covers subtitles, auto-translate languages, and any other long list YouTube might surface there.

## Behavior

- **Inject.** A wrapper with text input + match counter + prev/next buttons is inserted between the panel header and the items.
- **Filter.** Substring match, case-insensitive. Matches are highlighted with `<mark>`. The current match has a distinct color and is scrolled into view via `scrollIntoView({ block: "nearest" })`.
- **Navigation.** `Enter` → next, `Shift+Enter` → previous. The `‹` / `›` buttons do the same. Buttons are disabled when there are no matches.
- **Focus.** `Shift+F` focuses the active panel's input. `Escape` blurs it. Keyboard events inside the input have their propagation stopped so YouTube/browser shortcuts don't fire.
- **Sticky.** The search bar uses `position: sticky` so it stays in view while the user scrolls the list.
- **i18n.** Placeholder and tooltip texts come from `t()` in `i18n.js`. Russian for `ru-*` browser locales, English otherwise.

## API

```js
const controller = attachSearch({
  container: ".ytp-settings-menu",
  itemSelector: ".ytp-menuitem",
  labelSelector: ".ytp-menuitem-label",
  placeholder: "Search",
});
```

`attachSearch` waits for the container, watches it via `MutationObserver`, and processes every panel that meets the threshold. Returns `{ focusActive() }`.

`focusActive()` focuses the visible panel's input. If no input exists yet, the request is queued and resolved as soon as one mounts. Used by `Shift+S` to auto-focus right after the menu opens (`focusPlayerMenuSearch()` in `playerMenuSearch.js`).

## Files

- `modules/search.js` — generic injector
- `modules/playerMenuSearch.js` — registration for the player settings menu, `focusPlayerMenuSearch()`
- `styles/search.css` — search bar styling
- `styles/tooltip.css` — custom tooltip used on the nav buttons
