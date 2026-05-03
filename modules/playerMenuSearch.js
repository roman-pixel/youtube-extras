/**
 * @module playerMenuSearch
 * Wires the generic search-injector to the player settings menu, covering
 * any long list inside it (subtitles, auto-translate languages, etc.).
 * Also exposes focusPlayerMenuSearch() so other modules can request that
 * the active panel's search input be focused once it appears.
 */

let _controller = null;

function initPlayerMenuSearch() {
  _controller = attachSearch({
    container: Selectors.playerMenu.settingsMenu,
    itemSelector: Selectors.playerMenu.menuItem,
    labelSelector: Selectors.playerMenu.menuItemLabel,
    placeholder: t("searchPlaceholder"),
  });
}

function focusPlayerMenuSearch() {
  _controller?.focusActive();
}
