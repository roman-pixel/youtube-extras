/**
 * @module i18n
 * Single source of truth for user-facing strings. Russian is used for any
 * ru-* browser locale; English is used everywhere else.
 *
 * Usage: t("searchPlaceholder")
 */

const _LANG = navigator.language?.toLowerCase().startsWith("ru") ? "ru" : "en";

const Strings = {
  searchPlaceholder: { ru: "Поиск", en: "Search" },
  searchPrev: { ru: "Предыдущее", en: "Previous" },
  searchNext: { ru: "Следующее", en: "Next" },
};

function t(key) {
  return Strings[key]?.[_LANG] ?? Strings[key]?.en ?? key;
}
