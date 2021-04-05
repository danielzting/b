function substitute(node) {
    if (
        node.parentNode.tagName !== 'SCRIPT'
        && node.parentNode.tagName !== 'STYLE'
        && !node.parentNode.isContentEditable
    ) {
        node.nodeValue = node.nodeValue.replace(/b/gi, '🅱️');
    }
}

var url = new URL(location.href).origin;
chrome.storage.sync.get([url], function(data) {
    if (!data[url]) {
        var observer = new MutationSummary({
            callback: function(summaries) {
                summaries[0].added.forEach(substitute);
                summaries[0].valueChanged.forEach(substitute);
            },
            queries: [{ characterData: true }]
        });
    }
});
