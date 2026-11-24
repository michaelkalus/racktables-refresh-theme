/* RackTables Refresh Theme - type-to-filter for long drop-down lists.
 *
 * Adds a small search field above every <select> with at least MIN_OPTIONS
 * options (link existing file, parent container, object type, ...). Typing
 * narrows the list; matching ignores case and diacritics, and several words
 * must all match (in any order). Option groups are kept, empty ones hidden.
 *
 * Options are removed from / re-added to the DOM instead of being hidden,
 * because Safari ignores display:none and [hidden] on <option>.
 * The original option elements are reused, so selection state survives.
 * Selected options always stay in the list (a detached <option> is not
 * submitted), and the filter is cleared before the form is submitted.
 */
(function () {
  'use strict';

  var MIN_OPTIONS = 15;

  function norm(s) {
    return String(s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  function enhance(sel) {
    if (sel.getAttribute('data-rt-filter') || sel.options.length < MIN_OPTIONS)
      return;
    sel.setAttribute('data-rt-filter', '1');

    // Snapshot the original structure (top-level options and optgroups, in order).
    var items = [];
    var groups = [];
    Array.prototype.forEach.call(sel.children, function (child) {
      if (child.tagName === 'OPTGROUP') {
        groups.push(child);
        Array.prototype.forEach.call(child.children, function (opt) {
          items.push({ group: child, opt: opt, text: norm(opt.text + ' ' + child.label) });
        });
      } else if (child.tagName === 'OPTION') {
        items.push({ group: null, opt: child, text: norm(child.text) });
      }
    });

    var input = document.createElement('input');
    input.type = 'search';
    input.className = 'rt-select-filter';
    input.placeholder = 'Filter ' + items.length + ' items...';
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('aria-label', 'Filter list');
    if (sel.offsetWidth > 0)
      input.style.width = sel.offsetWidth + 'px';
    sel.parentNode.insertBefore(input, sel);

    function apply() {
      var words = norm(input.value).split(/\s+/).filter(Boolean);
      var selectedBefore = sel.multiple ? null : sel.options[sel.selectedIndex];
      var firstMatch = null;
      var shown = 0;

      items.forEach(function (it) { if (it.opt.parentNode) it.opt.parentNode.removeChild(it.opt); });
      groups.forEach(function (g) { if (g.parentNode) g.parentNode.removeChild(g); });

      items.forEach(function (it) {
        var match = true;
        for (var i = 0; i < words.length; i++)
          if (it.text.indexOf(words[i]) === -1) { match = false; break; }
        // multi-select: keep chosen options attached so they are still submitted
        if (!match && !(sel.multiple && it.opt.selected))
          return;
        if (match) shown++;
        if (it.group) {
          if (!it.group.parentNode) sel.appendChild(it.group);
          it.group.appendChild(it.opt);
        } else {
          sel.appendChild(it.opt);
        }
        if (match && !firstMatch && !it.opt.disabled) firstMatch = it.opt;
      });

      // Single select: keep the previous choice if still visible, otherwise
      // preselect the first match so the form submits what the user sees.
      if (!sel.multiple) {
        if (selectedBefore && selectedBefore.parentNode)
          selectedBefore.selected = true;
        else if (firstMatch)
          firstMatch.selected = true;
      }

      input.classList.toggle('rt-no-match', words.length > 0 && shown === 0);
      input.title = words.length ? shown + ' / ' + items.length : '';
    }

    input.addEventListener('input', apply);
    // put every option back before submit, whatever is filtered out
    if (sel.form)
      sel.form.addEventListener('submit', function () {
        if (input.value) { input.value = ''; apply(); }
      }, true);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {          // do not submit the form from the filter
        e.preventDefault();
        sel.focus();
      } else if (e.key === 'Escape') {
        input.value = '';
        apply();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        sel.focus();
      }
    });
  }

  function scan(root) {
    if (!root.querySelectorAll) return;
    Array.prototype.forEach.call(root.querySelectorAll('select'), enhance);
  }

  function start() {
    scan(document);
    // Some forms are built dynamically (AJAX); enhance selects added later too.
    if (window.MutationObserver) {
      new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          Array.prototype.forEach.call(m.addedNodes, function (n) {
            if (n.nodeType !== 1) return;
            if (n.tagName === 'SELECT') enhance(n); else scan(n);
          });
        });
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', start);
  else
    start();
})();
