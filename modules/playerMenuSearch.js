/**
 * @module playerMenuSearch
 * Wires the generic search-injector to the player settings menu, covering
 * any long list inside it (subtitles, auto-translate languages, etc.).
 */

function initPlayerMenuSearch() {
  attachSearch({
    container: Selectors.playerMenu.settingsMenu,
    itemSelector: Selectors.playerMenu.menuItem,
    labelSelector: Selectors.playerMenu.menuItemLabel,
    placeholder: t("searchPlaceholder"),
  });
}
