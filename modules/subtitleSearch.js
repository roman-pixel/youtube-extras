/**
 * @module subtitleSearch
 * Wires the generic search-injector to the player settings menu, which
 * surfaces long lists in the subtitles and auto-translate panels.
 */

function initSubtitleSearch() {
  attachSearch({
    container: Selectors.playerMenu.settingsMenu,
    itemSelector: Selectors.playerMenu.menuItem,
    labelSelector: Selectors.playerMenu.menuItemLabel,
    placeholder: "Поиск",
  });
}
