/**
 * Shared frontend utilities for LLM harness apps.
 * Used by appsimple-assistant and document-explorer.
 */

function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

// Unicode superscript digits the harness emits in citation positions.
// Browser <sup> rendering gives consistent sizing and lets us swap the
// chars for clickable links.
var SUPER_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
var SUPER_RUN_RE = new RegExp(
    '[' + SUPER_DIGITS + ']+(?:,[' + SUPER_DIGITS + ']+)*', 'g'
);

function citationRunToHtml(run) {
    return '<sup class="cite-refs">' + run.split(',').map(function(group) {
        var digits = group.replace(/./g, function(c) {
            return SUPER_DIGITS.indexOf(c).toString();
        });
        return '<a href="#" class="cite-ref" data-cite="' + digits + '">'
            + digits + '</a>';
    }).join(',') + '</sup>';
}

function markdownToHtml(text) {
    if (!text) return '';
    var escaped = text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    escaped = escaped.replace(/^### (.+)$/gm, '<h4>$1</h4>');
    escaped = escaped.replace(/^## (.+)$/gm, '<h3>$1</h3>');
    escaped = escaped.replace(/^( *)[\*\-]\s+(.+)$/gm, function(_, indent, content) {
        var depth = Math.floor(indent.length / 4);
        return depth > 0
            ? '<li style="margin-left:' + (depth * 1.5) + 'em">' + content + '</li>'
            : '<li>' + content + '</li>';
    });
    escaped = escaped.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
    escaped = escaped
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(SUPER_RUN_RE, citationRunToHtml)
        .replace(/\n/g, '<br>');
    escaped = escaped.replace(/<ul><br>/g, '<ul>').replace(/<br><\/ul>/g, '</ul>');
    escaped = escaped.replace(/<br><h/g, '<h').replace(/<\/h3><br>/g, '</h3>').replace(/<\/h4><br>/g, '</h4>');
    return escaped;
}

/**
 * Call a Gradio API endpoint (two-step: POST then fetch SSE result).
 * Returns a Promise resolving to the parsed response JSON.
 */
function callApi(apiBase, endpoint, data) {
    return fetch(apiBase + '/gradio_api/call/' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: Array.isArray(data) ? data : [data || ''] })
    })
    .then(function(r) { return r.json(); })
    .then(function(result) {
        return fetch(apiBase + '/gradio_api/call/' + endpoint + '/' + result.event_id);
    })
    .then(function(r) { return r.text(); })
    .then(function(text) {
        var lines = text.split('\n');
        var dataLine = lines.find(function(l) { return l.startsWith('data:'); });
        var parsed = JSON.parse(dataLine.substring(5).trim());
        return JSON.parse(Array.isArray(parsed) ? parsed[0] : parsed);
    });
}

/**
 * Render a sources list as HTML.
 * options.docLinkBase: if set, doc names become links (e.g. '/doc/')
 */
var EXTERNAL_LINK_ICON = '<svg class="external-icon" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">'
    + '<path d="M4.5 1.5H2a.5.5 0 00-.5.5v8a.5.5 0 00.5.5h8a.5.5 0 00.5-.5V7.5M7 1.5h3.5V5M5.5 6.5l5-5"/></svg>';

function renderSources(sources, options) {
    if (!sources || sources.length === 0) return '';
    options = options || {};

    var html = '<button class="chat-sources-toggle" onclick="this.nextElementSibling.classList.toggle(\'open\')">'
        + sources.length + ' source' + (sources.length !== 1 ? 's' : '') + '</button>';
    html += '<div class="chat-sources">';
    sources.forEach(function(s) {
        var cls = s.matched ? 'chat-source' : 'chat-source unmatched';
        var docName;
        if (options.docLinkBase && s.file) {
            var href = options.docLinkBase + encodeURIComponent(s.file.replace('.md', ''));
            docName = '<a class="chat-source-link" href="' + href + '" target="_blank">'
                + escapeHtml(s.doc) + EXTERNAL_LINK_ICON + '</a>';
        } else {
            docName = escapeHtml(s.doc);
        }
        var quoteHtml = s.quote
            ? ' <em class="chat-source-quote">"' + escapeHtml(s.quote) + '"</em>'
            : '';
        html += '<div class="' + cls + '" data-source-id="' + s.id + '">'
            + '<sup>' + s.id + '</sup>'
            + ' <strong class="chat-source-doc">' + docName + '</strong>'
            + quoteHtml + '</div>';
    });
    html += '</div>';
    return html;
}

/**
 * Wire inline citation links (<a class="cite-ref">) to expand the sources
 * panel and flash the matching source row. Scoped to the given root
 * element so multiple chat turns can coexist without ID collisions.
 */
function wireCitationLinks(rootEl) {
    var sourcesPanel = rootEl.querySelector('.chat-sources');
    if (!sourcesPanel) return;
    rootEl.querySelectorAll('.cite-ref').forEach(function(ref) {
        ref.addEventListener('click', function(e) {
            e.preventDefault();
            var id = ref.getAttribute('data-cite');
            sourcesPanel.classList.add('open');
            var src = sourcesPanel.querySelector('[data-source-id="' + id + '"]');
            if (!src) return;
            src.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            src.classList.add('chat-source-highlight');
            setTimeout(function() {
                src.classList.remove('chat-source-highlight');
            }, 1500);
        });
    });
}
