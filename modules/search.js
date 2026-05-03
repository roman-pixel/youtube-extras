/**
 * @module search
 * Generic search-injector for any DOM container that lists items in bulk.
 * Watches a container, and whenever a panel inside it has more than
 * SEARCH_MIN_ITEMS items, injects an input above that list. Typing highlights
 * matched substrings (substring, case-insensitive). Prev/next buttons and
 * Enter / Shift+Enter cycle through matches; the current match is visually
 * distinct and scrolled into view. Shift+F focuses the input while the panel
 * is open. Browser/YouTube keyboard shortcuts inside the input are suppressed.
 */

const SEARCH_MIN_ITEMS = 6;

const _ICON_CHEVRON_UP =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';

const _ICON_CHEVRON_DOWN =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

const _SEARCH_MARK = "ytExtrasSearchAttached";
const _ORIGINAL_HTML = "ytExtrasOrigLabel";

function _escapeHtml(text) {
  return text.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

function _restoreLabel(label) {
  const original = label.dataset[_ORIGINAL_HTML];

  if (original != null) label.textContent = original;
}

function _highlightLabel(label, query, isCurrent) {
  const original = label.dataset[_ORIGINAL_HTML] ?? label.textContent;

  if (!label.dataset[_ORIGINAL_HTML]) label.dataset[_ORIGINAL_HTML] = original;

  if (!query) {
    label.textContent = original;

    return false;
  }

  const lower = original.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);

  if (idx === -1) {
    label.textContent = original;

    return false;
  }

  const before = _escapeHtml(original.slice(0, idx));
  const match = _escapeHtml(original.slice(idx, idx + q.length));
  const after = _escapeHtml(original.slice(idx + q.length));
  const cls = isCurrent
    ? "yt-extras-search-hit yt-extras-search-hit-current"
    : "yt-extras-search-hit";

  label.innerHTML = `${before}<mark class="${cls}">${match}</mark>${after}`;

  return true;
}

function _createSearchUi(placeholder) {
  const wrapper = document.createElement("div");

  wrapper.className = "yt-extras-search";

  const inputWrap = document.createElement("div");

  inputWrap.className = "yt-extras-search-input-wrap";

  const input = document.createElement("input");

  input.type = "text";
  input.placeholder = `${placeholder} (${Shortcuts.searchFocus.badge})`;
  input.className = "yt-extras-search-input";
  input.autocomplete = "off";
  input.spellcheck = false;

  const counter = document.createElement("span");

  counter.className = "yt-extras-search-counter";

  inputWrap.append(input, counter);

  const prevBtn = document.createElement("button");

  prevBtn.type = "button";
  prevBtn.className = "yt-extras-search-nav";
  prevBtn.innerHTML = _ICON_CHEVRON_UP;

  const nextBtn = document.createElement("button");

  nextBtn.type = "button";
  nextBtn.className = "yt-extras-search-nav";
  nextBtn.innerHTML = _ICON_CHEVRON_DOWN;

  wrapper.append(inputWrap, prevBtn, nextBtn);

  attachCustomTooltip(prevBtn, { badge: "Shift+Enter" });
  attachCustomTooltip(nextBtn, { badge: "Enter" });

  for (const ev of ["keydown", "keyup", "keypress"]) {
    wrapper.addEventListener(ev, (e) => e.stopPropagation());
  }

  wrapper.addEventListener("click", (e) => e.stopPropagation());

  return { wrapper, input, counter, prevBtn, nextBtn };
}

function _attachToPanel(panel, { itemSelector, labelSelector, placeholder }) {
  const menu = panel.querySelector(Selectors.playerMenu.panelMenu);

  if (!menu) return;

  const initialItems = menu.querySelectorAll(itemSelector);

  if (initialItems.length <= SEARCH_MIN_ITEMS) return;

  if (panel.dataset[_SEARCH_MARK]) return;

  panel.dataset[_SEARCH_MARK] = "1";

  const ui = _createSearchUi(placeholder);
  const header = panel.querySelector(Selectors.playerMenu.panelHeader);

  if (header) {
    header.insertAdjacentElement("afterend", ui.wrapper);
  } else {
    panel.insertBefore(ui.wrapper, menu);
  }

  let matches = [];
  let currentIdx = -1;

  function render() {
    const query = ui.input.value.trim();
    const items = menu.querySelectorAll(itemSelector);

    matches = [];

    for (const item of items) {
      const label = item.querySelector(labelSelector);

      if (!label) continue;

      const isMatch = _highlightLabel(label, query, false);

      if (isMatch) matches.push({ item, label });
    }

    if (matches.length === 0) {
      currentIdx = -1;
    } else if (currentIdx < 0 || currentIdx >= matches.length) {
      currentIdx = 0;
    }

    applyCurrent(query);
    updateCounter(query);
  }

  function applyCurrent(query) {
    if (currentIdx < 0) return;

    const { label, item } = matches[currentIdx];

    _highlightLabel(label, query, true);
    item.scrollIntoView({ block: "nearest" });
  }

  function updateCounter(query) {
    if (!query) {
      ui.counter.textContent = "";

      return;
    }

    if (matches.length === 0) {
      ui.counter.textContent = "0/0";

      return;
    }

    ui.counter.textContent = `${currentIdx + 1}/${matches.length}`;
  }

  function step(delta) {
    if (matches.length === 0) return;

    currentIdx = (currentIdx + delta + matches.length) % matches.length;
    render();
  }

  ui.input.addEventListener("input", () => {
    currentIdx = 0;
    render();
  });

  ui.input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    step(e.shiftKey ? -1 : 1);
  });

  ui.prevBtn.addEventListener("click", () => step(-1));
  ui.nextBtn.addEventListener("click", () => step(1));

  return ui.input;
}

/**
 * @param {{
 *   container: string,
 *   itemSelector: string,
 *   labelSelector: string,
 *   placeholder: string,
 * }} opts
 */
function attachSearch(opts) {
  const inputs = new WeakMap();

  function scan(container) {
    for (const panel of container.querySelectorAll(
      Selectors.playerMenu.panel,
    )) {
      const input = _attachToPanel(panel, opts);

      if (input) inputs.set(panel, input);
    }
  }

  function focusActive(container) {
    for (const panel of container.querySelectorAll(
      Selectors.playerMenu.panel,
    )) {
      if (panel.offsetParent === null) continue;

      const input = inputs.get(panel);

      if (input) {
        input.focus();
        input.select();

        return true;
      }
    }

    return false;
  }

  function init(container) {
    scan(container);

    new MutationObserver(() => scan(container)).observe(container, {
      childList: true,
      subtree: true,
    });

    document.addEventListener(
      "keydown",
      (e) => {
        if (
          !e.shiftKey ||
          e.ctrlKey ||
          e.altKey ||
          e.metaKey ||
          e.code !== Shortcuts.searchFocus.code
        )
          return;

        if (!focusActive(container)) return;

        e.preventDefault();
        e.stopPropagation();
      },
      true,
    );
  }

  const existing = document.querySelector(opts.container);

  if (existing) {
    init(existing);

    return;
  }

  new MutationObserver((_, obs) => {
    const found = document.querySelector(opts.container);

    if (found) {
      obs.disconnect();
      init(found);
    }
  }).observe(document.body, { childList: true, subtree: true });
}
