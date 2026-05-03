/**
 * @module youtubeSelectors
 * Single source of truth for YouTube DOM selectors, attribute values and class names.
 * Grouped by feature so a YouTube redesign can be patched in one place per area.
 */

const Selectors = {
  comments: {
    panelFullscreen:
      'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"]',
    section: "#comments",
    buttonLabels:
      'button[aria-label="Comments"], button[aria-label="Комментарии"]',
    iconSvgPathStart: "M1 6a4 4 0 014-4h14a4 4 0 014 4v10",
  },
  like: {
    button: "like-button-view-model button",
  },
  dislike: {
    button: "dislike-button-view-model button",
  },
  description: {
    panelFullscreen:
      'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-structured-description"]',
    panelVisibleAttr: "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED",
    panelToggleButton: "#visibility-button button",
    fullscreenOpenTrigger: "yt-player-overlay-video-details-renderer",
    inline: "ytd-watch-metadata #description",
    inlineExpand: "#description-inline-expander #expand",
  },
  player: {
    root: "#movie_player",
    primary: "#primary",
    actionsBar: "#actions",
    fullscreenQuickActions: ".ytp-fullscreen-quick-actions",
    autohideClass: "ytp-autohide",
    fullscreenAttr: "is-fullscreen",
  },
  chrome: {
    masthead: "ytd-masthead",
    popover: "yt-popover",
  },
};
