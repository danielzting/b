function replaceNode(node) {
    if (
        node.parentNode !== null
        && node.parentNode.tagName !== 'SCRIPT'
        && node.parentNode.tagName !== 'STYLE'
        && node.parentNode.tagName !== 'NOSCRIPT'
        // Ignore user-editable elements as manipulating them resets the cursor position
        && !node.parentNode.isContentEditable
        // Workaround to avoid breaking icon fonts
        && !window.getComputedStyle(node.parentNode).getPropertyValue('font-family').toUpperCase().includes("ICON")
    ) {
        // HACK: Use Unicode zero-width characters to preserve case when copying to clipboard
        node.nodeValue = node.nodeValue.replace(/B/g, '🅱️\u200c').replace(/b/g, '🅱️\u200d');
    }
}

// Check if extension is enabled for current page
let url = new URL(location.href).origin;
chrome.storage.sync.get([url], function(data) {
    if (data[url] === undefined) {
        // Override clipboard handler to restore modified text with original
        document.addEventListener('copy', function(event) {
            event.clipboardData.setData('text/plain', window.getSelection().toString().replace(/🅱️\u200c/gu, 'B').replace(/🅱️\u200d/gu, 'b'));
            event.preventDefault();
        });

        // Set up observer for future page changes
        let observer = new MutationSummary({
            callback: function(summaries) {
                summaries[0].added.forEach(replaceNode);
                summaries[0].valueChanged.forEach(replaceNode);
            },
            queries: [{ characterData: true }],
        });

        // Perform an initial round of substitution
        let nodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (nodes.nextNode()) {
            replaceNode(nodes.currentNode);
        }
    }
});
