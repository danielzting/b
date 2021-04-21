chrome.action.onClicked.addListener(function(tab) {
    var url = new URL(tab.url).origin;
    chrome.storage.sync.get([url], function(data) {
        if (!data[url]) {
            chrome.storage.sync.set({[url]: true});
        }
        else {
            chrome.storage.sync.remove([url]);
        }
    });
    chrome.tabs.reload();
});
