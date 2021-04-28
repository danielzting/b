function substitute(node) {
    if (
        node.parentNode !== null
        && node.parentNode.tagName !== 'SCRIPT'
        && node.parentNode.tagName !== 'STYLE'
        && node.parentNode.tagName !== 'NOSCRIPT'
        && !node.parentNode.isContentEditable
    ) {
        // HACK: Use zero-width Unicode characters to remember the
        // original capitalization when modifying the clipboard
        node.nodeValue = node.nodeValue.replace(/B/g, '🅱️\u200c').replace(/b/g, '🅱️\u200d');
    }
}

// Bind listener for page changes
var observer = new MutationSummary({
    callback: function(summaries) {
        var url = new URL(location.href).origin;
        chrome.storage.sync.get([url], function(data) {
            if (data[url] === undefined) {
                summaries[0].added.forEach(substitute);
                summaries[0].valueChanged.forEach(substitute);
            }
        });
    },
    queries: [{ characterData: true }]
});

var url = new URL(location.href).origin;
chrome.storage.sync.get([url], function(data) {
    if (data[url] === undefined) {
        // Override clipboard handler to restore replaced text
        document.addEventListener('copy', function(event) {
            event.clipboardData.setData('text/plain', document.getSelection().toString().replace(/🅱️\u200c/gu, 'B').replace(/🅱️\u200d/gu, 'b'));
            event.preventDefault();
        });
        // Perform an initial round of substitution after page load
        var nodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (nodes.nextNode()) {
            substitute(nodes.currentNode);
        }
    }
});
