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

chrome.tabs.onActivated.addListener(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var url = new URL(tabs[0].url).origin;
        chrome.storage.sync.get([url], function(data) {
            if (data[url]) {
                chrome.action.setBadgeText({text: 'OFF'});
            } else {
                chrome.action.setBadgeText({text: ''});
            }
        });
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    chrome.action.setBadgeText({text: request.badgeText});
});
