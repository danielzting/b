// Check if extension is enabled for current page
let url = new URL(location.href).origin;
chrome.storage.sync.get([url], function(data) {
    if (data === undefined || data[url] === undefined) {
        // Override clipboard handler to restore modified text with original
        document.addEventListener('copy', function(event) {
            event.clipboardData.setData('text/plain', window.getSelection().toString().replace(/🅱️\u200c/gu, 'B').replace(/🅱️\u200d/gu, 'b'));
            event.preventDefault();
        });

        // HACK: Use Unicode zero-width characters to preserve case when copying to clipboard
        const observer = new TextObserver(text => text.replace(/B/g, '🅱️\u200c').replace(/b/g, '🅱️\u200d'));
    }
});
