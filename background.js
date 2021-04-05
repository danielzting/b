function updateBadge() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log(tabs[0].url);
        var url = new URL(tabs[0].url).origin;
        chrome.storage.sync.get([url], function(data) {
            if (data[url]) {
                chrome.action.setBadgeText({text: 'OFF'});
            } else {
                chrome.action.setBadgeText({text: ''});
            }
        });
    });
}

chrome.action.onClicked.addListener(function(tab) {
    var url = new URL(tab.url).origin;
    chrome.storage.sync.get([url], function(data) {
        if (!data[url]) {
            chrome.storage.sync.set({[url]: true}, updateBadge);
        }
        else {
            chrome.storage.sync.remove([url], updateBadge);
        }
    });
    chrome.tabs.reload();
});

chrome.tabs.onActivated.addListener(updateBadge);
